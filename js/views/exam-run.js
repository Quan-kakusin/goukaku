// Màn hình làm bài. Hai chế độ:
//   practice (luyện tập): chọn xong thấy đúng/sai và giải thích ngay, không thể đổi đáp án.
//   exam (thi thử): không báo đúng/sai, có thể đổi đáp án và đánh dấu xem lại, có đồng hồ, nộp bài rồi mới chấm.
// Đề thi thử N5 đầy đủ chạy theo từng phần thi (cfg.parts): mỗi phần có màn giới thiệu và giờ riêng, nộp phần này mới sang phần sau và không quay lại.

import { h, show, fill, meme, toast, jaText } from '../ui.js';
import { getFuriganaPref, setFuriganaPref } from '../furigana.js';
import { takePending, setLast } from '../exam-session.js';
import { toItem, makeEntry, formatDuration, spokenDuration } from '../exam.js';
import { addExam, recordLessonScore, save } from '../storage.js';
import { recordAnswer } from '../mistakes.js';
import { praise, miss } from '../insights.js';
import { KINDS } from '../questions.js';
import { lessonTitle } from '../deck.js';
import { speakScript, hasJapaneseVoice } from '../tts.js';

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function mount(root) {
  const cfg = takePending();
  if (!cfg) {
    toast('Phiên làm bài đã kết thúc. Hãy chọn một đề để bắt đầu lại.');
    location.replace('#/exams');
    return undefined;
  }

  const { questions, title } = cfg;
  const exam = cfg.mode === 'exam';
  const total = questions.length;
  const answers = Array(total).fill(null);
  const flags = Array(total).fill(false);
  const multi = Array.isArray(cfg.parts);
  const parts = multi ? cfg.parts : [{ name: null, from: 0, to: total - 1, limitSec: cfg.limitSec ?? null }];
  const totalLimit = parts.every(p => p.limitSec) ? parts.reduce((a, p) => a + p.limitSec, 0) : null;
  const partSeconds = [];
  const playsLeft = new Map();
  let partIdx = 0;
  let gate = multi; // đang ở màn giới thiệu của một phần thi
  let partStart = Date.now();
  let idx = parts[0].from;
  let finished = false;
  let timerId = null;
  let announced = new Set();
  let player = null;
  const part = () => parts[partIdx];
  const isLastPart = () => partIdx === parts.length - 1;
  const inPart = i => i >= part().from && i <= part().to;
  const partTotal = () => part().to - part().from + 1;

  // ---------- Khung cố định ----------
  const live = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
  const barFill = h('div', { class: 'progress-fill' });
  const counter = h('span', { class: 'muted' });
  const timerText = h('span', { class: 'timer-text' });
  const timerEl = parts.some(p => p.limitSec) ? h('div', { class: 'timer', role: 'timer', 'aria-label': 'Thời gian còn lại' }, timerText) : null;
  const card = h('div', { class: 'card exam-card' });
  // Thanh nghe của phần nghe: một file âm thanh cho cả もんだい, giữ nguyên khi chuyển câu để âm thanh không bị ngắt
  const sectionAudio = h('audio', { controls: true, preload: 'auto', 'aria-label': 'File nghe của もんだい này' });
  const audioLabel = h('p', { class: 'audio-bar-label' });
  const audioBar = h('div', { class: 'audio-bar', hidden: true }, audioLabel, sectionAudio);
  const prevBtn = h('button', { class: 'btn', type: 'button', onclick: () => go(idx - 1) }, '‹ Câu trước');
  const nextBtn = h('button', { class: 'btn', type: 'button', onclick: () => go(idx + 1) }, 'Câu sau ›');
  const headTitle = h('h1', null, title);
  const eyebrow = h('p', { class: 'eyebrow' }, exam ? 'Thi thử' : 'Luyện tập');
  const submitBtn = h('button', { class: 'btn primary', type: 'button', onclick: () => requestSubmit() }, exam ? 'Nộp bài' : 'Kết thúc và xem kết quả');
  const qnavPanel = h('section', { class: 'panel qnav-panel' });
  const actions = h('div', { class: 'exam-actions' }, prevBtn, nextBtn);
  const metaLine = h('div', { class: 'exam-meta' });
  const submitRow = h('div', { class: 'row exam-submit' }, submitBtn);
  const confirmBox = h('div', { class: 'confirm-box', role: 'alertdialog', 'aria-label': 'Xác nhận nộp bài', hidden: true });
  const navButtons = questions.map((_, i) => h('button', { class: 'qn', type: 'button', onclick: () => go(i) }, String(i + 1)));
  const navItems = navButtons.map(b => h('li', null, b));

  // ---------- Cập nhật ----------
  const partAnswered = () => answers.slice(part().from, part().to + 1).filter(a => a !== null).length;
  const answeredCount = () => answers.filter(a => a !== null).length;

  function refreshHeader() {
    barFill.style.width = `${(partAnswered() / partTotal()) * 100}%`;
    counter.textContent = `Đã trả lời ${partAnswered()}/${partTotal()}`;
  }

  function refreshNav() {
    navButtons.forEach((btn, i) => {
      const q = questions[i];
      btn.hidden = !inPart(i);
      navItems[i].hidden = !inPart(i);
      btn.textContent = String(i - part().from + 1);
      const answered = answers[i] !== null;
      const state = [];
      btn.className = 'qn';
      if (i === idx) btn.className += ' current';
      if (answered) btn.className += ' answered';
      if (flags[i]) btn.className += ' flagged';
      if (!exam && answered) btn.className += answers[i] === q.answer ? ' right' : ' wrong';
      state.push(answered ? 'đã trả lời' : 'chưa trả lời');
      if (!exam && answered) state.push(answers[i] === q.answer ? 'đúng' : 'sai');
      if (flags[i]) state.push('đã đánh dấu');
      btn.setAttribute('aria-label', `Câu ${i - part().from + 1}: ${state.join(', ')}`);
      if (i === idx) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
    prevBtn.disabled = idx === part().from;
    nextBtn.disabled = idx === part().to;
  }

  // ---------- Câu hỏi ----------
  // 【từ】 là phần gạch chân trong đề thi
  let furi = getFuriganaPref();
  const ja = (q, text) => jaText(text, { furi: furi && !q.plain });
  const paragraphs = (q, text) => text.split('\n').map(line => h('p', null, ...ja(q, line)));

  function stopAudio() {
    player?.stop();
    player = null;
  }

  // q.audioSrc: đặt file cho cả もんだい (chỉ đổi khi sang もんだい khác), không có thì ẩn thanh nghe
  function syncSectionAudio(q) {
    if (!q?.audioSrc) {
      pauseSectionAudio();
      return;
    }
    audioBar.hidden = false;
    audioLabel.textContent = `${q.mondai} · file nghe (bấm ▶, nghe lần lượt 1ばん, 2ばん...)`;
    if (sectionAudio.dataset.src !== q.audioSrc) {
      sectionAudio.pause();
      sectionAudio.dataset.src = q.audioSrc;
      sectionAudio.src = q.audioSrc;
    }
  }

  function pauseSectionAudio() {
    sectionAudio.pause();
    audioBar.hidden = true;
    delete sectionAudio.dataset.src;
    sectionAudio.removeAttribute('src');
    sectionAudio.load();
  }

  function audioBox(q) {
    const left = playsLeft.get(q.id) ?? q.plays ?? 1;
    const status = h('p', { class: 'muted', role: 'status', 'aria-live': 'polite' }, `Còn ${left} lần nghe.`);
    const btn = h('button', { class: 'btn', type: 'button', disabled: left <= 0 }, left > 0 ? '▶ Nghe' : 'Hết lượt nghe');
    btn.addEventListener('click', () => {
      const remaining = playsLeft.get(q.id) ?? q.plays ?? 1;
      if (remaining <= 0 || player) return;
      playsLeft.set(q.id, remaining - 1);
      btn.disabled = true;
      btn.textContent = '♪ Đang phát…';
      status.textContent = 'Đang phát, hãy lắng nghe.';
      player = speakScript(q.audio);
      player.done.then(() => {
        player = null;
        if (finished || questions[idx] !== q) return;
        const now = playsLeft.get(q.id);
        btn.disabled = now <= 0;
        btn.textContent = now > 0 ? '▶ Nghe lại' : 'Hết lượt nghe';
        status.textContent = now > 0 ? `Còn ${now} lần nghe.` : 'Đã hết lượt nghe.';
      });
    });
    return h('div', { class: 'audio-box' }, h('div', { class: 'row' }, btn), status);
  }

  function showGate() {
    stopAudio();
    pauseSectionAudio();
    const p = part();
    const start = h('button', { class: 'btn primary', type: 'button', onclick: startPart }, `Bắt đầu phần ${partIdx + 1}`);
    const noVoice = p.listening && !p.audioFiles && !hasJapaneseVoice();
    card.replaceChildren(
      ...[
        h('div', { class: 'card-top' }, h('span', { class: 'chip' }, `Phần ${partIdx + 1}/${parts.length}`), h('span', { class: 'chip' }, `${Math.round(p.limitSec / 60)} phút`)),
        h('h2', { lang: 'ja' }, p.name),
        h('p', null, h('strong', null, p.vi)),
        h('p', null, p.intro),
        h('p', { class: 'muted' }, 'Đồng hồ chỉ chạy khi bạn bấm bắt đầu. Nộp phần này rồi thì không quay lại được, giống đề thật.'),
        noVoice && h('p', { class: 'result ng' }, 'Trình duyệt chưa có giọng đọc tiếng Nhật nên phần nghe sẽ không phát được. Hãy cài giọng tiếng Nhật (Windows: Settings → Time & language → Language → thêm Japanese) rồi tải lại trang.'),
        start,
      ].filter(Boolean),
    );
    timerText.textContent = '⏱ --:--';
    timerEl?.classList.remove('low');
    live.textContent = `Phần ${partIdx + 1}: ${p.name}. ${p.vi}.`;
    refreshAll();
    start.focus();
  }

  function startPart() {
    gate = false;
    partStart = Date.now();
    announced = new Set();
    idx = part().from;
    refreshAll();
    showQuestion();
    if (part().limitSec) {
      tick();
      timerId = setInterval(tick, 1000);
    }
  }

  function refreshAll() {
    const p = part();
    eyebrow.textContent = multi ? `Thi thử · Phần ${partIdx + 1}/${parts.length} · ${p.name}` : exam ? 'Thi thử' : 'Luyện tập';
    submitBtn.textContent = !exam ? 'Kết thúc và xem kết quả' : multi && !isLastPart() ? 'Nộp phần này, sang phần tiếp' : 'Nộp bài';
    for (const el of [actions, qnavPanel, submitRow, metaLine]) el.hidden = gate;
    refreshHeader();
    refreshNav();
  }

  function showQuestion() {
    if (gate) return showGate();
    const q = questions[idx];
    syncSectionAudio(q);
    const locked = !exam && answers[idx] !== null;
    // bare: lựa chọn là hình hoặc chỉ nghe được, trên nút chỉ ghi số
    const buttons = q.choices.map((c, i) =>
      h('button', { type: 'button', class: `choice${q.bare ? ' bare' : ''}`, 'data-choice': c, onclick: () => choose(c) }, h('kbd', null, String(i + 1)), h('span', { lang: q.choiceLang }, q.bare ? `Đáp án ${c}` : q.choiceLang === 'ja' ? ja(q, c) : [c]), h('span', { class: 'mark', 'aria-hidden': 'true' })),
    );
    const feedback = h('div', { class: 'feedback', role: 'status', 'aria-live': 'polite' });
    const flagBtn = h('button', { class: 'btn small', type: 'button', 'aria-pressed': String(flags[idx]), onclick: toggleFlag }, flags[idx] ? '⚑ Đã đánh dấu' : '⚐ Đánh dấu xem lại');

    card.replaceChildren(
      ...[
      h('div', { class: 'card-top' }, h('span', { class: 'chip' }, `Câu ${idx - part().from + 1}/${partTotal()}`), h('span', { class: 'chip' }, q.mondai ? `${q.mondai} · ${q.tag.split(' · ')[1]}` : KINDS[q.kind].short), q.lesson && h('span', { class: 'chip' }, lessonTitle(q.lesson))),
      q.instr && h('p', { class: 'q-instr' }, h('span', { lang: 'ja' }, q.instr), h('small', { class: 'muted' }, q.instrVi)),
      q.passage && h('div', { class: 'passage', lang: 'ja' }, ...paragraphs(q, q.passage)),
      q.audio && audioBox(q),
      q.image && h('img', { class: 'q-image', src: q.image, alt: `Hình của câu ${q.prompt}` }),
      h('p', { class: `q-prompt${q.audio || q.prompt.length > 30 ? ' long' : ''}`, lang: q.promptLang }, ...(q.promptLang === 'ja' ? ja(q, q.prompt) : [q.prompt])),
      q.hint && h('p', { class: 'q-hint muted' }, q.hint),
      h('div', { class: 'choices', role: 'group', 'aria-label': 'Các đáp án' }, ...buttons),
      feedback,
      exam && flagBtn,
      ].filter(Boolean),
    );
    card.dataset.idx = String(idx);
    paintChoices(buttons, feedback, q, locked);
    live.textContent = `Câu ${idx - part().from + 1} trên ${partTotal()}. ${q.audio ? 'Câu nghe, bấm nút Nghe.' : q.audioSrc ? 'Câu nghe, dùng thanh nghe phía trên.' : q.prompt}. ${q.hint ?? ''}`;
  }

  function paintChoices(buttons, feedback, q, locked) {
    const chosen = answers[idx];
    buttons.forEach(b => {
      const c = b.dataset.choice;
      b.classList.remove('selected', 'correct', 'incorrect');
      b.querySelector('.mark').textContent = '';
      b.removeAttribute('aria-disabled');
      if (exam) {
        b.setAttribute('aria-pressed', String(chosen === c));
        if (chosen === c) b.classList.add('selected');
      } else if (locked) {
        b.setAttribute('aria-disabled', 'true');
        if (c === q.answer) {
          b.classList.add('correct');
          b.querySelector('.mark').textContent = '✓';
        } else if (c === chosen) {
          b.classList.add('incorrect');
          b.querySelector('.mark').textContent = '✗';
        }
      }
    });
    if (!exam && locked) {
      const ok = chosen === q.answer;
      feedback.replaceChildren(
        h('p', { class: `result ${ok ? 'ok' : 'ng'}` }, meme(ok ? praise(answeredCount() - 1) : miss(answeredCount() - 1)), ok ? '' : ` Đáp án: ${q.answer}`),
        h('p', null, q.explain),
        h('p', { class: 'muted' }, 'Xem giải thích đầy đủ và kiến thức liên quan trong phần kết quả sau khi nộp bài.'),
      );
    }
  }

  function choose(c) {
    if (finished) return;
    if (!exam && answers[idx] !== null) return;
    // Thi thử: bấm lại đáp án đang chọn thì bỏ chọn
    answers[idx] = exam && answers[idx] === c ? null : c;
    const keep = document.activeElement?.dataset?.choice;
    showQuestion();
    if (exam && keep) card.querySelector(`[data-choice="${CSS.escape(keep)}"]`)?.focus();
    else if (!exam) nextBtn.disabled ? card.querySelector('.choice')?.focus() : nextBtn.focus();
    refreshHeader();
    refreshNav();
  }

  function toggleFlag() {
    flags[idx] = !flags[idx];
    showQuestion();
    card.querySelector('[aria-pressed]:not(.choice)')?.focus();
    refreshNav();
  }

  function go(i) {
    if (finished || gate || !inPart(i)) return;
    stopAudio();
    idx = i;
    confirmBox.hidden = true;
    showQuestion();
    refreshNav();
  }

  // ---------- Nộp bài ----------
  function endPart(auto) {
    stopAudio();
    pauseSectionAudio();
    clearInterval(timerId);
    partSeconds.push(Math.min(Math.round((Date.now() - partStart) / 1000), part().limitSec ?? Infinity));
    if (!multi || isLastPart()) return finish(auto);
    partIdx += 1;
    gate = true;
    confirmBox.hidden = true;
    idx = part().from;
    showGate();
    if (auto) toast('Hết giờ, phần thi đã được nộp. Chuyển sang phần tiếp theo.');
    return undefined;
  }

  function requestSubmit() {
    if (gate) return;
    const p = part();
    const blank = partTotal() - partAnswered();
    const flagged = flags.slice(p.from, p.to + 1).filter(Boolean).length;
    const next = multi && !isLastPart();
    if (!blank && !flagged && !next) return endPart(false);
    const parts = [];
    if (blank) parts.push(`${blank} câu chưa trả lời`);
    if (flagged) parts.push(`${flagged} câu đã đánh dấu xem lại`);
    const back = h('button', { class: 'btn', type: 'button', onclick: () => { confirmBox.hidden = true; } }, 'Quay lại làm tiếp');
    fill(
      confirmBox,
      parts.length ? h('p', null, h('strong', null, 'Bạn còn '), parts.join(' và '), '. Câu chưa trả lời được tính là sai.') : h('p', null, 'Nộp phần này?'),
      next && h('p', { class: 'muted' }, 'Sau khi nộp sẽ không quay lại phần này được.'),
      h('div', { class: 'row' }, back, h('button', { class: 'btn primary', type: 'button', onclick: () => endPart(false) }, next ? 'Nộp phần này' : 'Nộp bài ngay')),
    );
    confirmBox.hidden = false;
    back.focus();
  }

  function finish(auto) {
    if (finished) return;
    finished = true;
    pauseSectionAudio();
    clearInterval(timerId);
    stopAudio();
    const seconds = partSeconds.reduce((a, b) => a + b, 0);
    const items = questions.map((q, i) => toItem(q, answers[i], flags[i]));

    // Câu đã trả lời đúng/sai đều đi vào Sổ lỗi sai: sai thì thêm vào, đúng hai lần liên tiếp thì gỡ ra
    questions.forEach((q, i) => {
      if (answers[i] !== null) recordAnswer(q, items[i].ok);
    });

    const entry = makeEntry({ id: newId(), title, mode: cfg.mode, items, seconds, limit: totalLimit, paper: cfg.paper });
    if (cfg.record) {
      try {
        addExam(entry);
        if (cfg.lessonScore) recordLessonScore(cfg.lessonScore, entry.percent);
        save();
      } catch (err) {
        toast(`Không lưu được kết quả: ${err.message}`);
      }
    }
    if (auto) toast('Hết giờ, bài đã được nộp tự động.');
    if (cfg.record) {
      location.hash = `#/exam/result/${entry.id}`;
    } else {
      setLast(entry);
      location.hash = '#/exam/result/last';
    }
  }

  // ---------- Đồng hồ ----------
  function tick() {
    const left = part().limitSec - Math.floor((Date.now() - partStart) / 1000);
    if (left <= 0) {
      timerText.textContent = '00:00';
      endPart(true);
      return;
    }
    timerText.textContent = `⏱ ${formatDuration(left)}`;
    timerEl.classList.toggle('low', left <= 60);
    // Thông báo cho trình đọc màn hình ở vài mốc quan trọng, không đọc từng giây
    for (const mark of [300, 60, 10]) {
      if (left <= mark && !announced.has(mark)) {
        announced.add(mark);
        if (left > mark - 5) live.textContent = `Còn ${spokenDuration(mark)}`;
      }
    }
  }

  // ---------- Bàn phím ----------
  function onKey(e) {
    if (finished || gate || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target instanceof Element && e.target.closest('input, select, textarea')) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 4 && questions[idx].choices[n - 1] !== undefined) {
      e.preventDefault();
      choose(questions[idx].choices[n - 1]);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(idx + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(idx - 1);
    } else if ((e.key === 'f' || e.key === 'F') && exam) {
      e.preventDefault();
      toggleFlag();
    }
  }

  // ---------- Dựng trang ----------
  show(
    root,
    h(
      'div',
      { class: 'exam-head' },
      h('div', null, eyebrow, headTitle),
      timerEl,
    ),
    h('div', { class: 'progress' }, barFill),
    metaLine,
    audioBar,
    card,
    actions,
    qnavPanel,
    confirmBox,
    submitRow,
    live,
  );
  const furiBox = h('input', { type: 'checkbox', id: 'furi-toggle', checked: furi, onchange: e => {
    furi = e.target.checked;
    setFuriganaPref(furi);
    if (!gate && !finished) showQuestion();
  } });
  metaLine.replaceChildren(counter, h('label', { class: 'check furi-toggle', for: 'furi-toggle' }, furiBox, h('span', null, 'Hiện furigana')), h('span', { class: 'muted' }, exam ? 'Có thể đổi đáp án và đánh dấu xem lại. Đáp án sẽ hiện sau khi nộp bài.' : 'Chọn đáp án để xem đúng sai và giải thích ngay.'));
  qnavPanel.replaceChildren(
    h('h2', null, 'Danh sách câu hỏi'),
    h('ol', { class: 'qnav' }, ...navItems),
    h('p', { class: 'muted' }, exam ? 'Ô viền đậm: câu hiện tại. Ô xanh đậm: đã trả lời. Dấu ⚑: đã đánh dấu xem lại.' : 'Ô xanh: đúng. Ô đỏ: sai. Dấu ⚑ đánh dấu xem lại chỉ có ở chế độ thi thử.'),
  );

  if (gate) showGate();
  else startPart();
  document.addEventListener('keydown', onKey);
  return () => {
    clearInterval(timerId);
    stopAudio();
    pauseSectionAudio();
    document.removeEventListener('keydown', onKey);
  };
}
