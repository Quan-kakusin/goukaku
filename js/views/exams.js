// Trang Thi thử N5: đề thi thử đầy đủ, thống kê và lịch sử các lần làm. Luyện tập theo bài nằm trong trang từng bài.

import { h, show, toast, testTabs } from '../ui.js';
import { getState, save, clearExams } from '../storage.js';
import { SECTIONS } from '../questions.js';
import { historyStats, verdict, formatDuration, PASS_PERCENT } from '../exam.js';
import { launchExam, launchMock } from './launch.js';
import { PAPERS, buildPaper, scoreMock, PASS } from '../mock.js';
import { hasJapaneseVoice } from '../tts.js';

export function mount(root, params) {
  const s = getState();

  // ---------- Thống kê + lịch sử ----------
  const exams = s.exams;
  const stats = historyStats(exams);
  const statsPanel =
    exams.length === 0
      ? h('section', { class: 'panel' }, h('h2', null, 'Kết quả của bạn'), h('p', { class: 'muted' }, 'Chưa có lần làm đề nào. Làm một đề để xem điểm, thống kê và lịch sử ở đây.'))
      : h(
          'section',
          { class: 'panel' },
          h('h2', null, 'Kết quả của bạn'),
          h(
            'div',
            { class: 'stats' },
            h('div', { class: 'stat' }, h('strong', null, String(stats.count)), h('span', null, 'Lần làm đề')),
            h('div', { class: 'stat' }, h('strong', null, `${stats.average}%`), h('span', null, 'Điểm trung bình')),
            h('div', { class: 'stat' }, h('strong', null, `${stats.best}%`), h('span', null, 'Cao nhất')),
            h('div', { class: 'stat' }, h('strong', null, String(stats.questions)), h('span', null, 'Câu đã làm')),
          ),
          ...Object.entries(stats.bySection).map(([k, p]) => {
            const fill = h('span', { class: p >= PASS_PERCENT ? 'ok' : 'low' });
            fill.style.width = `${p}%`;
            return h('div', { class: 'break-row' }, h('span', null, SECTIONS[k]), h('div', { class: 'bar', role: 'img', 'aria-label': `${SECTIONS[k]}: ${p}%` }, fill), h('strong', null, `${p}%`));
          }),
          stats.weakLessons.length > 0 &&
            h(
              'div',
              { class: 'weak' },
              h('h3', null, 'Bài nên ôn lại'),
              ...stats.weakLessons.map(w =>
                h(
                  'div',
                  { class: 'weak-row' },
                  h('span', null, h('strong', null, `Bài ${w.lesson}`), ` · đúng ${w.percent}% (${w.total} câu)`),
                  h('a', { class: 'btn small', href: `#/lesson/${w.lesson}` }, 'Xem bài'),
                  h('button', { class: 'btn small', type: 'button', onclick: () => launchExam({ scope: String(w.lesson), count: 10, mode: 'practice' }) }, 'Luyện lại'),
                ),
              ),
            ),
        );

  const history =
    exams.length === 0
      ? null
      : h(
          'section',
          { class: 'panel' },
          h('h2', null, 'Lịch sử'),
          h(
            'ul',
            { class: 'history' },
            ...exams.map(e => {
              const v = verdict(e.percent);
              return h(
                'li',
                null,
                h(
                  'a',
                  { class: 'history-row', href: `#/exam/result/${e.id}`, 'aria-label': `${e.title}, ${e.percent} phần trăm, ${v.label}. Xem kết quả chi tiết` },
                  h('span', { class: 'hr-main' }, h('strong', null, e.title), h('small', { class: 'muted' }, `${e.mode === 'exam' ? 'Thi thử' : 'Luyện tập'} · ${e.items.length} câu · ${formatDuration(e.seconds)} · ${new Date(e.at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}`)),
                  h('span', { class: `verdict ${v.key}` }, `${e.percent}% ${v.label}`),
                ),
              );
            }),
          ),
          h(
            'button',
            {
              class: 'btn danger small',
              type: 'button',
              onclick: () => {
                if (!confirm('Xóa toàn bộ lịch sử làm đề? Sổ lỗi sai và điểm của từng bài vẫn giữ nguyên.')) return;
                clearExams();
                save();
                toast('Đã xóa lịch sử làm đề.');
                mount(root, params);
              },
            },
            'Xóa lịch sử',
          ),
        );

  // ---------- Thi thử N5 đầy đủ: mỗi đề một thẻ ----------
  const paintVoiceFns = [];
  if ('speechSynthesis' in window) speechSynthesis.addEventListener('voiceschanged', () => paintVoiceFns.forEach(f => f()), { once: true });

  function paperCard(paper, index) {
    const full = buildPaper(paper);
    const hasListening = paper.parts.some(p => p.listening);
    // Phần nghe có file âm thanh thì không cần giọng đọc của trình duyệt; chỉ phần nghe đọc bằng giọng máy mới cần
    const needsVoice = paper.parts.some(p => p.listening && !p.sections.some(s => s.audioSrc));
    const listenBox = h('input', { type: 'checkbox', id: `f-listen-${index}`, checked: true });
    const voiceNote = h('p', { class: 'muted', role: 'status', 'aria-live': 'polite' });
    const paintVoice = () => {
      voiceNote.textContent = !needsVoice
        ? ''
        : hasJapaneseVoice()
        ? 'Đã tìm thấy giọng đọc tiếng Nhật trên máy.'
        : 'Chưa phát hiện giọng đọc tiếng Nhật (Windows: Settings → Time & language → Language → thêm Japanese). Không có giọng thì bỏ tích để thi các phần còn lại.';
    };
    paintVoice();
    paintVoiceFns.push(paintVoice);
    const attempts = s.exams.filter(e => e.paper === paper.id);
    const lastTry = attempts[0] ? scoreMock(attempts[0].items) : null;
    const lastLine = !lastTry
      ? null
      : lastTry.partial
        ? h('p', null, h('strong', null, 'Lần gần nhất: '), `${lastTry.partScores.map(p => `${p.label} ${p.correct}/${p.total} câu`).join(' · ')} (làm một phần) `, h('a', { href: `#/exam/result/${attempts[0].id}` }, 'Xem lại'))
        : lastTry.total !== null
        ? h('p', null, h('strong', null, 'Lần gần nhất: '), `${lastTry.total}/${lastTry.max} điểm · `, h('span', { class: `verdict ${lastTry.passed ? 'pass' : 'fail'}` }, lastTry.passed ? 'Đạt' : 'Chưa đạt'), ' ', h('a', { href: `#/exam/result/${attempts[0].id}` }, 'Xem lại'))
        : h('p', null, h('strong', null, 'Lần gần nhất: '), `${lastTry.written.score}/${lastTry.written.max} điểm (phần chữ・ngữ pháp・đọc hiểu) · `, h('span', { class: `verdict ${lastTry.written.pass ? 'pass' : 'fail'}` }, lastTry.written.pass ? 'Đạt mức sàn' : 'Dưới mức sàn'), ' ', h('a', { href: `#/exam/result/${attempts[0].id}` }, 'Xem lại'));
    // partKeys: null là làm cả đề, ngược lại chỉ làm các phần có key này
    function start(partKeys) {
      const chosen = full.parts.filter(p => !partKeys || partKeys.includes(p.key));
      // Bấm riêng phần nghe thì luôn làm phần nghe, bất kể ô tích ở dưới
      let includeListening = hasListening && chosen.some(p => p.listening) && (partKeys ? true : listenBox.checked);
      const voiceNeeded = includeListening && chosen.some(p => p.listening && !p.audioFiles);
      if (voiceNeeded && !hasJapaneseVoice() && !confirm('Chưa phát hiện giọng đọc tiếng Nhật nên phần nghe sẽ không phát được. Bỏ phần nghe và thi các phần còn lại?')) return;
      if (voiceNeeded && !hasJapaneseVoice()) includeListening = false;
      launchMock({ paperId: paper.id, includeListening, partKeys });
    }
    return h(
      'section',
      { class: 'panel mock-card' },
      h('p', { class: 'eyebrow' }, 'Như thi thật'),
      h('h2', null, paper.title),
      h('p', { class: 'muted' }, `${full.questions.length} câu, ${full.parts.length} phần thi nối tiếp, mỗi phần có giờ riêng. Bạn có thể làm cả đề hoặc chỉ từng phần. Nộp phần nào rồi thì không quay lại được. ${paper.desc ?? ''}`),
      h(
        'ul',
        { class: 'mock-parts' },
        ...full.parts.map(p => h('li', null, h('strong', { lang: 'ja' }, p.name), ` · ${p.vi} · ${p.to - p.from + 1} câu · ${Math.round(p.limitSec / 60)} phút`)),
      ),
      h('p', { class: 'muted' }, hasListening
        ? `Chấm theo thang 180 điểm của JLPT N5: đậu khi tổng từ ${PASS.total}/180, phần chữ・ngữ pháp・đọc hiểu từ ${PASS.written}/120 và phần nghe từ ${PASS.listening}/60. Điểm là ước tính theo tỉ lệ câu đúng, không phải điểm quy đổi chính thức.`
        : `Đề này chưa có phần nghe 聴解. Chấm phần chữ・ngữ pháp・đọc hiểu theo thang 120 điểm, mức sàn của JLPT N5 là ${PASS.written}/120. Điểm là ước tính theo tỉ lệ câu đúng, không phải điểm quy đổi chính thức.`),
      hasListening && h('label', { class: 'check', for: `f-listen-${index}` }, listenBox, h('span', null, needsVoice ? 'Có phần nghe 聴解 (dùng giọng đọc của trình duyệt)' : 'Có phần nghe 聴解 (file âm thanh của đề)')),
      needsVoice && voiceNote,
      lastLine,
      h(
        'div',
        { class: 'row mock-start' },
        h('button', { class: 'btn primary', type: 'button', onclick: () => start(null) }, full.parts.length > 1 ? 'Làm cả đề' : `Bắt đầu ${paper.title}`),
        full.parts.length > 1 && full.parts.map((p, i) => h('button', { class: 'btn', type: 'button', onclick: () => start([p.key]) }, `Chỉ phần ${i + 1}: `, h('span', { lang: 'ja' }, p.name))),
      ),
    );
  }

  show(root, testTabs('exams'), h('h1', null, 'Thi thử N5'), ...PAPERS.map(paperCard), statsPanel, history);
  return undefined;
}
