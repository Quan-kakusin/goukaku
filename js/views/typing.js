// Gõ từ vựng: đề là nghĩa tiếng Việt, người học tự nhớ từ tiếng Nhật rồi gõ romaji; ô nhập tự đổi sang hiragana như bàn phím tiếng Nhật. Đúng thì hiện đáp án một lát rồi tự sang từ kế; sai thì gõ lại, xem đáp án thì đáp án chỉ hiện vài giây rồi ẩn đi và phải gõ lại; có nút bỏ qua; chấm điểm cuối lượt.

import { h, show, meme, ring, speakButton, wordsTabs, toast } from '../ui.js';
import { COUNTING_GROUPS } from '../../data/counting.js';
import { sentenceCount, pickSentences } from '../sentences.js';
import { romajiOf } from '../romaji.js';
import { convertInput, finalizeKana, scriptOf } from '../ime.js';
import { isCorrect, scoreTyping } from '../words.js';
import { verdict } from '../exam.js';
import { praise, miss } from '../insights.js';
import { shuffle } from '../questions.js';
import { wordSetup } from './word-setup.js';

// Đường dẫn: #/typing (chọn bộ), #/typing/vocab/<bài>, #/typing/sentence/<bài> (câu ví dụ của bài), #/typing/count (số đếm, ngày, tháng).
export function mount(root, params = []) {
  // Thời gian hiện đáp án (mili giây) trước khi tự sang từ kế, và trước khi ẩn đáp án để gõ lại
  const SHOW_CORRECT_MS = 1800;
  const SHOW_RETYPE_MS = 1500;
  const SHOW_REVEAL_MS = 3500;

  let onKey = null;
  let timer = null;
  const clearTimer = () => {
    clearTimeout(timer);
    timer = null;
  };
  const stopKeys = () => {
    clearTimer();
    if (onKey) document.removeEventListener('keydown', onKey);
    onKey = null;
  };

  // ---------- Chọn bộ từ ----------
  // Ba nguồn: từ vựng theo bài · câu ví dụ theo bài · số đếm, ngày, tháng, năm, trợ số từ
  const MODES = [
    ['vocab', 'Từ vựng'],
    ['sentence', 'Câu ví dụ'],
    ['count', 'Số đếm・ngày tháng'],
  ];
  let mode = MODES.some(([id]) => id === params[0]) ? params[0] : 'vocab';
  const initialLesson = Number(params[1]);
  let initial = Number.isInteger(initialLesson) && initialLesson >= 1 ? [initialLesson] : undefined;

  function countSetup() {
    const chosen = new Set(COUNTING_GROUPS.map(g => g.id));
    const mix = h('input', { type: 'checkbox', id: 'cnt-shuffle', checked: true });
    const note = h('p', { class: 'muted', role: 'status', 'aria-live': 'polite' });
    const startBtn = h('button', { class: 'btn primary', type: 'button', onclick: begin }, 'Bắt đầu gõ');
    const boxes = COUNTING_GROUPS.map(g =>
      h('label', { class: 'check', for: `cnt-${g.id}` }, h('input', { type: 'checkbox', id: `cnt-${g.id}`, checked: true, onchange: e => { if (e.target.checked) chosen.add(g.id); else chosen.delete(g.id); update(); } }), h('span', null, `${g.label} · ${g.words.length}`)),
    );
    const words = () => COUNTING_GROUPS.filter(g => chosen.has(g.id)).flatMap(g => g.words);
    function update() {
      const n = words().length;
      startBtn.disabled = n === 0;
      note.textContent = n ? `Đã chọn ${n} mục.` : 'Hãy chọn ít nhất một nhóm.';
    }
    function begin() {
      const list = words();
      if (!list.length) return toast('Hãy chọn ít nhất một nhóm.');
      return session(mix.checked ? shuffle(list) : list, { label: 'Số đếm・ngày tháng', shuffle: mix.checked });
    }
    const setAll = on => () => {
      for (const b of boxes) b.querySelector('input').checked = on;
      chosen.clear();
      if (on) COUNTING_GROUPS.forEach(g => chosen.add(g.id));
      update();
    };
    update();
    return h(
      'section',
      { class: 'panel' },
      h('p', { class: 'muted' }, 'Xem nghĩa (số, ngày, tháng, năm, giờ, số lượng) rồi gõ cách đọc bằng romaji, ví dụ "ngày 4" → よっか, "3 người" → さんにん, "2 tờ" → にまい. Những số có hai cách đọc (4 = よん/し, 7 = なな/しち) gõ cách nào cũng đúng. Cần xem lại cách đọc thì mở ', h('a', { href: '#/counting' }, 'bảng tra số đếm'), '.'),
      h('p', { class: 'eyebrow' }, 'Chọn nhóm cần luyện'),
      h('div', { class: 'count-groups' }, ...boxes),
      h('div', { class: 'row' }, h('button', { class: 'btn small', type: 'button', onclick: setAll(true) }, 'Chọn tất cả'), h('button', { class: 'btn small', type: 'button', onclick: setAll(false) }, 'Bỏ chọn')),
      h('label', { class: 'check', for: 'cnt-shuffle' }, mix, h('span', null, 'Trộn thứ tự (bỏ tích để luyện theo thứ tự)')),
      note,
      startBtn,
    );
  }

  function setup() {
    stopKeys();
    const switcher = h(
      'div',
      { class: 'segmented', role: 'group', 'aria-label': 'Chọn bộ để gõ' },
      ...MODES.map(([id, label]) =>
        h('button', { class: 'seg', type: 'button', 'aria-pressed': String(id === mode), onclick: () => { mode = id; initial = undefined; setup(); } }, label),
      ),
    );
    const form =
      mode === 'count'
        ? countSetup()
        : mode === 'sentence'
          ? wordSetup({
              intro: 'Xem nghĩa tiếng Việt của một câu ví dụ trong bài rồi gõ cả câu bằng romaji (bỏ qua dấu cách và dấu câu). Gõ câu giúp nhớ công thức và trật tự từ. Trợ từ は, へ, を gõ theo chữ viết (ha, he, wo) hay theo cách đọc (wa, e, o) đều được.',
              startLabel: 'Bắt đầu gõ câu',
              source: { unit: 'câu', size: sentenceCount, pick: pickSentences },
              initial,
              onStart: (words, info) => session(words, info),
            })
          : wordSetup({
              intro: 'Xem nghĩa tiếng Việt rồi gõ từ tiếng Nhật tương ứng bằng bàn phím romaji, ô nhập tự đổi sang chữ Nhật (hoteru → ほてる, "-" → ー, gõ đôi phụ âm → っ). Gõ sai thì gõ lại, không nhớ thì bỏ qua hoặc xem đáp án. Cuối lượt có chấm điểm.',
              startLabel: 'Bắt đầu gõ',
              initial,
              onStart: (words, info) => session(words, info),
            });
    show(root, wordsTabs('typing'), h('h1', null, 'Gõ romaji'), switcher, form);
  }

  // ---------- Một lượt ----------
  function session(words, opts) {
    const results = [];
    let idx = 0;
    let tries = 0; // số lần gõ sai ở từ hiện tại
    let state = 'typing'; // typing | done (đã gõ đúng, chờ tự sang từ kế) | revealing (đang hiện đáp án)
    let recorded = false; // mỗi từ chỉ ghi kết quả một lần (gõ lại sau khi xem đáp án không đổi điểm)
    stopKeys();
    const actions = {}; // hành động của từ hiện tại, gắn lại mỗi lần vẽ từ mới
    onKey = e => {
      if (e.repeat || e.isComposing || e.metaKey || e.altKey) return;
      if (state === 'done' && e.key === 'Enter' && !e.ctrlKey) {
        e.preventDefault();
        next(); // Enter: sang từ kế ngay, không chờ
      } else if (state === 'revealing' && e.key === 'Enter') {
        e.preventDefault();
        actions.endReveal?.(); // Enter: ẩn đáp án ngay để gõ lại
      } else if (state === 'typing' && e.key === 'Escape') {
        e.preventDefault();
        actions.skip?.();
      } else if (state === 'typing' && e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        actions.reveal?.();
      }
    };
    document.addEventListener('keydown', onKey);

    const live = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
    const barFill = h('div', { class: 'progress-fill' });
    const card = h('div', { class: 'card typing-card' });
    // Chưa trả lời từ nào thì nút này là "chọn lại bộ từ"; đã có kết quả thì là "dừng và xem kết quả"
    const footBtn = h('button', { class: 'btn small', type: 'button', onclick: () => (results.length ? result(results, opts, words) : setup()) }, 'Chọn lại bộ từ');

    function record(outcome) {
      if (recorded) return;
      recorded = true;
      results.push({ word: words[idx], outcome, tries });
    }

    function next() {
      clearTimer();
      idx += 1;
      tries = 0;
      recorded = false;
      state = 'typing';
      if (idx >= words.length) return result(results, opts, words);
      return draw();
    }

    function draw() {
      const w = words[idx];
      barFill.style.width = `${(idx / words.length) * 100}%`;
      footBtn.textContent = results.length ? 'Dừng và xem kết quả' : 'Chọn lại bộ từ';
      const input = h('input', { type: 'text', id: 'ty-input', class: 'typing-input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-describedby': 'ty-feedback', 'aria-label': 'Gõ từ tiếng Nhật của nghĩa này bằng romaji, ô tự đổi sang chữ kana', placeholder: { kata: 'gõ romaji, tự đổi thành カタカナ…', mixed: 'gõ romaji, tự đổi thành ひらがな・カタカナ…', hira: 'gõ romaji, tự đổi thành ひらがな…' }[scriptOf(w.kana)], lang: 'ja' });
      // Tự đổi romaji sang hiragana khi gõ, trừ lúc đang dùng bộ gõ tiếng Nhật của hệ điều hành (composition)
      let composing = false;
      input.addEventListener('compositionstart', () => {
        composing = true;
      });
      input.addEventListener('compositionend', () => {
        composing = false;
        hold();
      });
      let frozen = null; // khi khác null: ô nhập bị khóa ở chữ này (đã đúng / đang xem đáp án)
      const hold = () => {
        if (frozen === null) return false;
        if (input.value !== frozen) input.value = frozen;
        return true;
      };
      let shown = { raw: '', text: '' }; // romaji đã gõ và chữ đang hiện: để "n" cuối (hiện là ん) còn ghép được với chữ gõ tiếp
      input.addEventListener('input', () => {
        if (hold() || composing) return;
        shown = convertInput(input.value, shown, { target: w.kana });
        if (shown.text !== input.value) {
          input.value = shown.text;
          input.setSelectionRange(shown.text.length, shown.text.length);
        }
      });
      const feedback = h('div', { class: 'feedback', id: 'ty-feedback', role: 'status', 'aria-live': 'polite' });
      const check = h('button', { class: 'btn primary', type: 'submit' }, h('kbd', null, 'Enter'), 'Kiểm tra');
      const skipWord = () => {
        record('skipped');
        next();
      };
      const skip = h('button', { class: 'btn', type: 'button', onclick: skipWord }, h('kbd', null, 'Esc'), 'Bỏ qua từ');
      const reveal = h('button', { class: 'btn', type: 'button', onclick: revealAnswer }, h('kbd', null, 'Ctrl+Enter'), 'Xem đáp án');

      // Điện thoại không có phím Enter để sang nhanh: có nút bấm riêng (và Enter trên bàn phím ảo cũng dùng được)
      const goNext = h('button', { class: 'btn primary', type: 'button', onclick: () => next() }, h('kbd', null, 'Enter'), 'Từ kế ›');
      const again = h('button', { class: 'btn primary', type: 'button', onclick: () => endReveal() }, h('kbd', null, 'Enter'), 'Gõ lại');
      goNext.hidden = again.hidden = true;

      actions.skip = skipWord;
      actions.reveal = () => revealAnswer();
      actions.endReveal = () => endReveal();

      // Xem đáp án: hiện vài giây rồi ẩn đi, phải gõ lại từ đó (không có nút sang từ kế)
      function revealAnswer() {
        record('revealed');
        state = 'revealing';
        clearTimer();
        frozen = input.value;
        input.classList.add('wrong');
        check.hidden = skip.hidden = reveal.hidden = true;
        again.hidden = false;
        feedback.replaceChildren(
          h('p', { class: 'result ng', lang: 'ja' }, w.sentence ? `Đáp án: ${w.word}` : `Đáp án: ${w.kana} (${romajiOf(w)})`),
          h('p', { class: 'muted' }, 'Ghi nhớ nhé, đáp án sẽ ẩn đi rồi bạn gõ lại từ này. Bấm "Gõ lại" để ẩn ngay.'),
        );
        timer = setTimeout(endReveal, SHOW_REVEAL_MS);
      }

      function endReveal() {
        clearTimer();
        state = 'typing';
        frozen = null;
        input.value = '';
        shown = { raw: '', text: '' };
        input.classList.remove('wrong');
        check.hidden = skip.hidden = reveal.hidden = false;
        again.hidden = true;
        feedback.replaceChildren(h('p', { class: 'muted' }, 'Gõ lại từ vừa xem. Đáp án đã được ẩn.'));
        input.focus();
      }

      // Gõ đúng: hiện đáp án một lát rồi tự sang từ kế
      function done(message, ms) {
        state = 'done';
        frozen = input.value;
        input.classList.remove('wrong');
        input.classList.add('right');
        check.hidden = skip.hidden = reveal.hidden = true;
        goNext.hidden = false;
        // Meme bên trái, đáp án bên phải: gọn chiều cao để cả màn hình vừa một khung nhìn
        feedback.replaceChildren(
          h(
            'div',
            { class: 'feedback-row' },
            h('p', { class: 'result ok' }, message),
            h('div', { class: 'feedback-text' }, h('p', { class: 'answer-line', lang: 'ja' }, `${w.word} · ${w.vi}`), h('p', { class: 'muted' }, 'Tự sang từ kế sau vài giây…')),
          ),
        );
        clearTimer();
        timer = setTimeout(next, ms);
      }

      const form = h(
        'form',
        {
          class: 'typing-form',
          onsubmit: e => {
            e.preventDefault();
            if (state === 'done') return next();
            if (state === 'revealing') return endReveal();
            const value = finalizeKana(input.value).trim();
            if (!value) {
              feedback.replaceChildren(h('p', { class: 'muted' }, 'Hãy gõ từ này, hoặc bấm "Bỏ qua từ".'));
              input.focus();
              return;
            }
            // Chỉ có nghĩa tiếng Việt để đoán nên nhận cả từ khác cùng nghĩa trong bộ đang luyện
            if (isCorrect(value, w) || words.some(x => x !== w && x.vi === w.vi && isCorrect(value, x))) {
              record(tries === 0 ? 'first' : 'retry');
              done(meme(praise(idx)), tries === 0 ? SHOW_CORRECT_MS : SHOW_RETYPE_MS);
              return;
            }
            tries += 1;
            input.value = '';
            input.setAttribute('aria-invalid', 'true');
            feedback.replaceChildren(h('div', { class: 'feedback-row' }, h('p', { class: 'result ng' }, meme(miss(tries)))));
            input.focus();
          },
        },
        input,
        h('div', { class: 'row' }, check, skip, reveal, goNext, again),
        feedback,
      );

      card.replaceChildren(
        h('div', { class: 'card-top' }, h('span', { class: 'chip' }, `Từ ${idx + 1}/${words.length}`), h('span', { class: 'chip' }, `${opts.label}`)),
        h('div', { class: 'fc-meaning' }, w.vi),
        form,
      );
      input.focus();
      live.textContent = `Từ ${idx + 1} trên ${words.length}. Nghĩa: ${w.vi}.`;
    }

    show(
      root,
      wordsTabs('typing'),
      h('div', { class: 'exam-head' }, h('div', null, h('p', { class: 'eyebrow' }, `Gõ romaji · ${opts.label}`), h('h1', null, 'Gõ romaji'))),
      h('div', { class: 'progress' }, barFill),
      card,
      h('div', { class: 'row session-foot' }, footBtn),
      live,
    );
    draw();
  }

  // ---------- Kết quả ----------
  function result(results, opts, words) {
    stopKeys();
    const g = scoreTyping(results);
    const v = verdict(g.percent);
    const missed = results.filter(r => r.outcome !== 'first');
    const stat = (value, label, cls = '') => h('div', { class: `stat ${cls}` }, h('strong', null, String(value)), h('span', null, label));
    show(
      root,
      wordsTabs('typing'),
      h(
        'section',
        { class: 'result-hero' },
        ring(g.percent / 100, { label: `${g.percent}%`, sub: v.label, description: `Điểm ${g.percent} phần trăm, xếp loại ${v.label}` }),
        h('div', null, h('p', { class: 'eyebrow' }, `Gõ romaji · ${opts.label}`), h('h1', null, `${g.points % 1 === 0 ? g.points : g.points.toFixed(1)}/${g.total} điểm`), h('p', null, h('span', { class: `verdict ${v.key}` }, v.label)), h('p', { class: 'muted' }, 'Đúng ngay được 1 điểm, đúng sau khi gõ lại được nửa điểm, bỏ qua hoặc xem đáp án không có điểm.')),
        meme(['excellent', 'pass'].includes(v.key) ? praise(g.first) : miss(g.first)),
      ),
      h('div', { class: 'stats' }, stat(g.first, 'Đúng ngay', 'good'), stat(g.retry, 'Đúng sau khi gõ lại'), stat(g.skipped, 'Bỏ qua', 'bad'), stat(g.revealed, 'Xem đáp án', 'bad')),
      h(
        'div',
        { class: 'row result-actions' },
        h('button', { class: 'btn primary', type: 'button', disabled: missed.length === 0, onclick: () => session(missed.map(r => r.word), { ...opts, label: `${opts.label} · từ cần luyện lại` }) }, `Luyện lại từ chưa đúng ngay (${missed.length})`),
        h('button', { class: 'btn', type: 'button', onclick: () => session(opts.shuffle ? shuffle(words) : words, opts) }, 'Làm lại cả bộ'),
        h('button', { class: 'btn', type: 'button', onclick: setup }, 'Chọn bộ từ khác'),
      ),
      missed.length > 0 &&
        h(
          'section',
          { class: 'panel' },
          h('h2', null, 'Từ cần luyện thêm'),
          h('ul', { class: 'word-miss' }, ...missed.map(r => h('li', null, speakButton(r.word.kana), h('span', { class: 'vword', lang: 'ja' }, r.word.word), r.word.sentence ? null : h('span', { class: 'romaji' }, romajiOf(r.word)), h('span', { class: 'muted' }, r.word.vi)))),
        ),
    );
  }

  setup();
  return stopKeys;
}
