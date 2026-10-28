// Kết quả một lần làm đề: điểm, thống kê theo phần/dạng/bài, và giải chi tiết từng câu.

import { h, show, meme, ring, speakButton, furigana, jaText } from '../ui.js';
import { getFuriganaPref, setFuriganaPref } from '../furigana.js';
import { getState } from '../storage.js';
import { getAllWords, lessonTitle } from '../deck.js';
import { getLast } from '../exam-session.js';
import { gradeItems, verdict, formatDuration, pct, PASS_PERCENT } from '../exam.js';
import { KINDS, SECTIONS, choiceNote, findPattern, resolveQuestion } from '../questions.js';
import { encouragement, praise, miss } from '../insights.js';
import { romajiOf } from '../romaji.js';
import { speakScript } from '../tts.js';
import { LESSONS } from '../../data/lessons.js';
import { KANJI } from '../../data/kanji-n5.js';
import { formulaBox, examplesList } from './parts.js';
import { launchFromIds, launchMock } from './launch.js';
import { scoreMock, findMockQuestion, PASS } from '../mock.js';

const STATUS = {
  right: { mark: '✓', label: 'Đúng' },
  wrong: { mark: '✗', label: 'Sai' },
  blank: { mark: '○', label: 'Bỏ trống' },
};
const FILTERS = [
  ['all', 'Tất cả'],
  ['wrong', 'Sai'],
  ['blank', 'Bỏ trống'],
  ['flagged', 'Đã đánh dấu'],
];

const statusOf = it => (it.chosen === null ? 'blank' : it.ok ? 'right' : 'wrong');

function bar(percent, label) {
  const fill = h('span', { class: percent >= PASS_PERCENT ? 'ok' : 'low' });
  fill.style.width = `${percent}%`;
  return h('div', { class: 'bar', role: 'img', 'aria-label': label }, fill);
}

// Kiến thức liên quan đến câu hỏi: mẫu ngữ pháp, từ vựng hoặc chữ Hán, kèm đường dẫn để học lại
function related(q, words) {
  if (q.ref?.patternId) {
    const p = findPattern(q.ref.patternId);
    if (!p) return null;
    const no = `${p.lesson}.${LESSONS[p.lesson - 1].grammar.indexOf(p) + 1}`;
    return h(
      'div',
      { class: 'related' },
      h('h3', null, 'Mẫu ngữ pháp liên quan'),
      h('p', null, h('span', { class: 'section-no' }, no), ' ', h('strong', { lang: 'ja' }, p.title), ` · ${p.meaning}`),
      formulaBox(p.formula),
      h('p', null, p.explain[0]),
      examplesList(p.examples.slice(0, 2)),
      h('a', { class: 'btn small', href: `#/lesson/${p.lesson}/grammar` }, `Xem đầy đủ mục ${no}`),
    );
  }
  if (q.ref?.wordId) {
    const w = words.find(x => x.id === q.ref.wordId);
    if (!w) return null;
    return h(
      'div',
      { class: 'related' },
      h('h3', null, 'Từ vựng liên quan'),
      h('div', { class: 'reading-row' }, h('span', { class: 'vword' }, furigana(w.word, w.kana)), speakButton(w.kana), h('span', { class: 'romaji' }, romajiOf(w))),
      h('p', null, h('strong', null, w.vi), w.lesson ? ` · ${lessonTitle(w.lesson)}` : ''),
      w.ex && h('div', { class: 'ex-jp', lang: 'ja' }, w.ex, speakButton(w.ex)),
      w.exVi && h('div', { class: 'ex-vi' }, w.exVi),
      w.lesson > 0 && h('a', { class: 'btn small', href: `#/lesson/${w.lesson}/vocab` }, `Xem từ vựng ${lessonTitle(w.lesson)}`),
    );
  }
  if (q.ref?.word) {
    const chars = [...new Set([...q.ref.word])].map(c => KANJI.find(k => k.char === c)).filter(Boolean);
    return h(
      'div',
      { class: 'related' },
      h('h3', null, 'Chữ Hán trong từ'),
      ...chars.map(k =>
        h('div', { class: 'kanji-mini' }, h('span', { class: 'k', lang: 'ja' }, k.char), h('div', null, h('strong', null, `${k.hv} · ${k.vi}`), h('div', { class: 'muted', lang: 'ja' }, `On: ${k.on}　Kun: ${k.kun}`))),
      ),
      h('a', { class: 'btn small', href: '#/kanji' }, 'Mở danh sách Kanji'),
    );
  }
  return null;
}

function reviewItem({ it, i, q }, words, furi) {
  const ja = text => jaText(text, { furi: furi && !q?.plain });
  const st = statusOf(it);
  const answer = q?.answer;
  const lang = q?.choiceLang;
  const choices = h(
    'ul',
    { class: 'review-choices' },
    ...it.choices.map(c => {
      const isAnswer = q ? c === answer : false;
      const isChosen = c === it.chosen;
      const note = q && !isAnswer ? choiceNote(q, c, words) : null;
      const cls = isAnswer ? 'correct' : isChosen ? 'incorrect' : '';
      return h(
        'li',
        { class: cls },
        h('span', { lang }, ...(lang === 'ja' ? ja(c) : [c])),
        isAnswer && h('span', { class: 'tag' }, '✓ Đáp án đúng'),
        isChosen && !isAnswer && h('span', { class: 'tag' }, '✗ Bạn đã chọn'),
        isChosen && isAnswer && h('span', { class: 'tag' }, '(bạn đã chọn đúng)'),
        note && h('small', { class: 'muted' }, note),
      );
    }),
  );

  return h(
    'details',
    { class: `review-item ${st}`, open: st !== 'right', id: `cau-${i + 1}` },
    h(
      'summary',
      null,
      h('span', { class: 'rv-no' }, `Câu ${i + 1}`),
      h('span', { class: `status ${st}` }, `${STATUS[st].mark} ${STATUS[st].label}`),
      h('span', { class: 'rv-prompt', lang: q?.promptLang }, q ? (q.audio ? `Câu nghe · ${q.tag}` : q.audioSrc ? `Câu nghe · ${q.tag} · ${q.prompt}` : q.prompt.replace(/[【】]/g, '')) : it.qid),
      it.flagged && h('span', { class: 'chip' }, '⚑ Đã đánh dấu'),
    ),
    h(
      'div',
      { class: 'rv-body' },
      h('div', { class: 'card-top' }, h('span', { class: 'chip' }, KINDS[it.kind]?.label ?? it.kind), q?.mondai && h('span', { class: 'chip' }, q.tag), it.lesson > 0 && h('span', { class: 'chip' }, lessonTitle(it.lesson))),
      q?.passage && h('div', { class: 'passage', lang: 'ja' }, ...q.passage.split('\n').map(line => h('p', null, ...ja(line)))),
      q?.passageVi && h('details', { class: 'translation' }, h('summary', null, 'Xem bản dịch'), h('p', null, q.passageVi)),
      q?.audioSrc && h('audio', { class: 'review-audio', controls: true, preload: 'none', src: q.audioSrc, 'aria-label': `File nghe ${q.mondai}` }),
      q?.image && h('img', { class: 'q-image', src: q.image, alt: `Hình của câu ${q.prompt}` }),
      q?.audio &&
        h(
          'div',
          { class: 'script' },
          h('h3', null, 'Lời thoại'),
          ...q.audio.map(([who, line]) => h('p', { lang: 'ja' }, h('strong', null, `${who}: `), line)),
          q.scriptVi && h('p', { class: 'muted' }, q.scriptVi),
          h('button', { class: 'btn small', type: 'button', onclick: () => speakScript(q.audio) }, '▶ Nghe lại'),
        ),
      q ? h('p', { class: 'q-prompt', lang: q.promptLang }, ...(q.promptLang === 'ja' ? ja(q.prompt) : [q.prompt])) : h('p', { class: 'muted' }, 'Câu hỏi này không còn trong dữ liệu (nội dung đã bị xóa hoặc đổi), nên không có giải thích.'),
      q?.hint && h('p', { class: 'muted' }, q.hint),
      choices,
      st === 'blank' && h('p', { class: 'muted' }, 'Bạn chưa chọn đáp án cho câu này.'),
      q && h('div', { class: 'explain' }, h('h3', null, 'Giải thích'), h('p', null, q.explain)),
      q && related(q, words),
    ),
  );
}

export function mount(root, params = []) {
  const id = params[0];
  const entry = id === 'last' ? getLast() : getState().exams.find(e => e.id === id);
  if (!entry) {
    show(root, h('h1', null, 'Không tìm thấy kết quả'), h('p', { class: 'muted' }, 'Kết quả này không còn trong lịch sử (hoặc là lần làm không được lưu và phiên đã kết thúc).'), h('a', { class: 'btn primary', href: '#/exams' }, 'Về Thi thử N5'));
    return undefined;
  }

  const words = getAllWords();
  const g = gradeItems(entry.items);
  const v = verdict(g.percent);
  const reviews = entry.items.map((it, i) => ({ it, i, q: resolveQuestion(it.qid, { deck: words }) }));
  const counts = { all: reviews.length, wrong: g.wrong, blank: g.blank, flagged: entry.items.filter(i => i.flagged).length };
  let furi = getFuriganaPref();
  let filter = g.wrong > 0 ? 'wrong' : g.blank > 0 ? 'blank' : 'all';

  const list = h('div', { class: 'review-list' });
  const filterBtns = FILTERS.map(([key, label]) =>
    h('button', { class: 'seg', type: 'button', 'aria-pressed': 'false', 'data-filter': key, onclick: () => setFilter(key) }, `${label} (${counts[key]})`),
  );
  const matches = ({ it }) => (filter === 'all' ? true : filter === 'flagged' ? it.flagged : statusOf(it) === filter);

  function drawList() {
    for (const b of filterBtns) b.setAttribute('aria-pressed', String(b.dataset.filter === filter));
    const shown = reviews.filter(matches);
    list.replaceChildren(...(shown.length ? shown.map(r => reviewItem(r, words, furi)) : [h('p', { class: 'muted' }, 'Không có câu nào trong mục này.')]));
  }
  function setFilter(key) {
    filter = key;
    drawList();
  }
  const toggleAll = open => list.querySelectorAll('details.review-item').forEach(d => (d.open = open));

  const sectionRows = Object.entries(g.bySection).map(([key, s]) => {
    const p = pct(s);
    return h('div', { class: 'break-row' }, h('span', null, SECTIONS[key] ?? key), bar(p, `${SECTIONS[key]}: ${p}%`), h('strong', null, `${p}%`), h('span', { class: 'muted' }, `${s.correct}/${s.total}`));
  });
  const kindRows = Object.entries(g.byKind).map(([key, s]) => h('li', null, h('span', null, KINDS[key]?.label ?? key), h('span', { class: 'muted' }, `${s.correct}/${s.total} (${pct(s)}%)`)));
  const lessonEntries = Object.entries(g.byLesson).sort(([a], [b]) => a - b);
  const wrongIds = entry.items.filter(i => !i.ok).map(i => i.qid);
  // Lượt luyện chỉ gồm câu của một bài: có nút về trang Bài tập của bài đó
  const lessonSet = new Set(entry.items.map(i => i.lesson));
  const [onlyLesson] = lessonSet;
  const backToLesson = !entry.paper && lessonSet.size === 1 && onlyLesson > 0 ? onlyLesson : 0;

  const mock = entry.paper ? scoreMock(entry.items) : null;
  const mockPanel = mock?.partial
    ? h(
        'section',
        { class: 'panel mock-score' },
        h('h2', null, 'Kết quả phần đã làm'),
        h('div', { class: 'stats' }, ...mock.partScores.map(p => h('div', { class: 'stat' }, h('strong', null, `${p.correct}/${p.total}`), h('span', { lang: 'ja' }, `${p.label} (${p.percent}%)`)))),
        h('p', { class: 'muted' }, 'Bạn mới làm một phần của đề. Làm đủ hai phần 文字・語彙 và 文法・読解 thì mới quy ra điểm theo thang JLPT và so với mức sàn.'),
      )
    : mock
    ? h(
        'section',
        { class: 'panel mock-score' },
        h('h2', null, 'Điểm theo thang JLPT N5 (ước tính)'),
        mock.total !== null
          ? h('p', { class: 'mock-total' }, h('strong', null, `${mock.total}/${mock.max}`), ' ', h('span', { class: `verdict ${mock.passed ? 'pass' : 'fail'}` }, mock.passed ? 'Đạt' : 'Chưa đạt'))
          : h('p', { class: 'muted' }, mock.written.pass ? 'Phần chữ・ngữ pháp・đọc hiểu đạt mức sàn của JLPT N5. Không có phần nghe nên chưa kết luận đậu/rớt cả kỳ thi được.' : 'Phần chữ・ngữ pháp・đọc hiểu chưa đạt mức sàn của JLPT N5. Không có phần nghe nên chưa tính tổng 180 điểm.'),
        h(
          'div',
          { class: 'stats' },
          h('div', { class: `stat ${mock.written.pass ? 'good' : 'bad'}` }, h('strong', null, `${mock.written.score}/${mock.written.max}`), h('span', null, `文字・語彙・文法・読解 (sàn ${PASS.written})`)),
          mock.listening.total > 0 && h('div', { class: `stat ${mock.listening.pass ? 'good' : 'bad'}` }, h('strong', null, `${mock.listening.score}/${mock.listening.max}`), h('span', null, `聴解 (sàn ${PASS.listening})`)),
        ),
        h('p', { class: 'muted' }, `Điều kiện đậu: tổng từ ${PASS.total}/180, phần chữ・ngữ pháp・đọc hiểu từ ${PASS.written}/120 và phần nghe từ ${PASS.listening}/60. Điểm này quy từ tỉ lệ câu đúng của đề thi thử, không phải điểm quy đổi chính thức của JLPT.`),
      )
    : null;

  const date = new Date(entry.at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  const stat = (value, label, cls = '') => h('div', { class: `stat ${cls}` }, h('strong', null, value), h('span', null, label));

  show(
    root,
    h('a', { class: 'back-link', href: '#/exams' }, 'Thi thử N5'),
    h(
      'section',
      { class: 'result-hero' },
      ring(g.percent / 100, { label: `${g.percent}%`, sub: v.label, description: `Điểm ${g.percent} phần trăm, xếp loại ${v.label}` }),
      h(
        'div',
        null,
        h('p', { class: 'eyebrow' }, entry.mode === 'exam' ? 'Thi thử' : 'Luyện tập'),
        h('h1', null, entry.title),
        h('p', null, h('span', { class: `verdict ${v.key}` }, v.label), ` ${g.correct}/${g.total} câu đúng`),
        h('p', { class: 'muted' }, encouragement(g.percent / 100)),
        h('p', { class: 'muted' }, date),
      ),
      meme(['excellent', 'pass'].includes(v.key) ? praise(g.correct) : miss(g.correct)),
    ),
    h(
      'div',
      { class: 'stats' },
      stat(String(g.correct), 'Đúng', 'good'),
      stat(String(g.wrong), 'Sai', 'bad'),
      stat(String(g.blank), 'Bỏ trống'),
      stat(formatDuration(entry.seconds), entry.limit ? `Thời gian (tối đa ${formatDuration(entry.limit)})` : 'Thời gian làm'),
    ),
    mockPanel,
    h(
      'section',
      { class: 'panel' },
      h('h2', null, 'Điểm theo phần'),
      ...sectionRows,
      !entry.paper && Object.keys(g.byKind).length > 1 && h('ul', { class: 'kind-list' }, ...kindRows),
      lessonEntries.length > 1 &&
        h(
          'div',
          { class: 'lesson-chips' },
          h('p', { class: 'muted' }, 'Theo bài (bài dưới 70% nên ôn lại):'),
          ...lessonEntries.map(([n, s]) =>
            h('a', { class: `chip${pct(s) < PASS_PERCENT ? ' weak' : ''}`, href: `#/lesson/${n}` }, `Bài ${n}: ${pct(s)}% (${s.correct}/${s.total})`),
          ),
        ),
    ),
    h(
      'div',
      { class: 'row result-actions' },
      h('button', { class: 'btn primary', type: 'button', onclick: () => (entry.paper ? launchMock({ paperId: entry.paper, includeListening: entry.items.some(i => i.section === 'choukai'), partKeys: [...new Set(entry.items.map(i => findMockQuestion(i.qid)?.partKey).filter(Boolean))] }) : launchFromIds({ ids: entry.items.map(i => i.qid), title: entry.title, mode: entry.mode, minutes: entry.limit ? entry.limit / 60 : undefined })) }, 'Làm lại đề này'),
      h('button', { class: 'btn', type: 'button', disabled: wrongIds.length === 0, onclick: () => launchFromIds({ ids: wrongIds, title: `Luyện lại câu sai: ${entry.title}`, mode: 'practice' }) }, `Luyện lại câu sai (${wrongIds.length})`),
      h('a', { class: 'btn', href: '#/notebook' }, 'Sổ lỗi sai'),
      backToLesson && h('a', { class: 'btn', href: `#/lesson/${backToLesson}/exercise` }, `Bài tập Bài ${backToLesson}`),
    ),
    h(
      'section',
      { class: 'review' },
      h('h2', null, 'Xem lại và giải chi tiết'),
      h('div', { class: 'segmented', role: 'group', 'aria-label': 'Lọc câu hỏi' }, ...filterBtns),
      h(
        'div',
        { class: 'row' },
        h('button', { class: 'btn small', type: 'button', onclick: () => toggleAll(true) }, 'Mở tất cả'),
        h('button', { class: 'btn small', type: 'button', onclick: () => toggleAll(false) }, 'Thu gọn tất cả'),
        h('label', { class: 'check furi-toggle', for: 'rv-furi' }, h('input', { type: 'checkbox', id: 'rv-furi', checked: furi, onchange: e => { furi = e.target.checked; setFuriganaPref(furi); drawList(); } }), h('span', null, 'Hiện furigana')),
      ),
      list,
    ),
  );
  drawList();
  return undefined;
}
