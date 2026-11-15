// Katakana thi: 59 từ katakana hay gặp trong đề N5. Danh sách (che nghĩa để tự kiểm tra), luyện tập chấm điểm và ôn lặp lại.
// Gõ romaji cho các từ này nằm ở Từ vựng → Gõ romaji → Katakana thi.

import { h, show, speakButton, setPressed, wordsTabs } from '../ui.js';
import { KATAKANA, KATAKANA_GROUPS } from '../../data/katakana-n5.js';
import { kataMeaningQuestion, kataWordQuestion, pickN } from '../questions.js';
import { startExam } from '../exam-session.js';
import { defaultMinutes } from '../exam.js';
import { buildSession, sessionQuestions, srsSummary } from '../katakana-study.js';
import { INTERVAL_DAYS } from '../srs.js';

const COUNTS = [10, 20, 30, 59];
const NEW_COUNTS = [0, 5, 10, 20];
const QUIZ_KINDS = {
  meaning: { label: 'Katakana → nghĩa', title: 'Luyện katakana → nghĩa', make: kataMeaningQuestion, about: 'Cho một từ katakana, chọn nghĩa tiếng Việt đúng. Đáp án nhiễu là các từ cùng nhóm hoặc giống chữ.' },
  word: { label: 'Nghĩa → katakana', title: 'Luyện nghĩa → katakana', make: kataWordQuestion, about: 'Cho nghĩa tiếng Việt, chọn đúng từ katakana trong các từ giống nhau (アパート / デパート, コップ / カップ, シャツ / ワイシャツ). Dạng này luyện nhận mặt chữ.' },
};
const inGroup = (group, k) => group === 'all' || k.group === group;

export function mount(root, params = []) {
  let tab = ['list', 'quiz', 'review'].includes(params[0]) ? params[0] : 'list';
  const state = { group: 'all', hide: false, count: 20, kind: 'meaning', newCount: 10 };
  const opened = new Set(); // từ đã bấm hiện nghĩa khi đang che

  const body = h('div');
  const tabBtns = [
    ['list', 'Danh sách'],
    ['quiz', 'Luyện tập'],
    ['review', 'Ôn hôm nay'],
  ].map(([id, label]) => h('button', { type: 'button', class: 'seg', dataset: { tab: id }, onclick: () => { tab = id; draw(); } }, label));

  show(
    root,
    wordsTabs('katakana'),
    h('h1', null, 'Katakana thi'),
    h('p', { class: 'muted' }, '59 từ katakana hay gặp trong đề N5, chia thành 6 nhóm để học gọn trước kỳ thi. Gõ romaji các từ này ở ', h('a', { href: '#/typing/kata' }, 'Gõ romaji → Katakana thi'), '.'),
    h('div', { class: 'segmented', role: 'group', 'aria-label': 'Chế độ' }, ...tabBtns),
    body,
  );

  const groupSelect = (value, onchange) =>
    h('select', { 'aria-label': 'Nhóm từ', onchange: e => onchange(e.target.value) }, h('option', { value: 'all', selected: value === 'all' }, 'Mọi nhóm'), ...KATAKANA_GROUPS.map(g => h('option', { value: g.id, selected: value === g.id }, g.label)));

  function list() {
    const shown = KATAKANA.filter(k => inGroup(state.group, k));
    const rows = shown.map(k => {
      const reveal = !state.hide || opened.has(k.kana);
      return h(
        'li',
        { class: 'kata-row' },
        speakButton(k.kana),
        h('span', { class: 'kata-word', lang: 'ja' }, k.kana),
        reveal
          ? h('span', { class: 'kata-meaning' }, h('span', null, k.vi), h('small', { class: 'muted' }, `${k.en}${k.note ? ` · ${k.note}` : ''}`))
          : h('button', { class: 'btn small', type: 'button', onclick: () => { opened.add(k.kana); draw(); } }, 'Hiện nghĩa'),
      );
    });
    return h(
      'div',
      null,
      h(
        'div',
        { class: 'toolbar' },
        groupSelect(state.group, v => { state.group = v; draw(); }),
        h('label', { class: 'check', for: 'kata-hide' }, h('input', { type: 'checkbox', id: 'kata-hide', checked: state.hide, onchange: e => { state.hide = e.target.checked; opened.clear(); draw(); } }), h('span', null, 'Che nghĩa để tự kiểm tra')),
      ),
      h('p', { class: 'muted' }, `${shown.length} từ. Bấm biểu tượng loa để nghe. Phần "từ gốc" là tiếng Anh (hoặc tiếng nước ngoài) mà từ này mượn: đoán nghĩa từ đó sẽ nhớ nhanh hơn.`),
      h('ul', { class: 'kata-list' }, ...rows),
    );
  }

  function startQuiz(mode) {
    const kind = QUIZ_KINDS[state.kind];
    const pool = KATAKANA.filter(k => inGroup(state.group, k));
    const questions = pickN(pool, Math.min(state.count, pool.length)).map(k => kind.make(k));
    startExam({ title: kind.title, questions, mode, limitSec: mode === 'exam' ? defaultMinutes(questions.length) * 60 : null, returnHash: '#/katakana/quiz' });
  }

  function quizSetup() {
    const kind = QUIZ_KINDS[state.kind];
    const poolSize = KATAKANA.filter(k => inGroup(state.group, k)).length;
    return h(
      'div',
      { class: 'panel' },
      h('h2', null, 'Luyện katakana'),
      h('div', { class: 'segmented', role: 'group', 'aria-label': 'Dạng luyện' }, ...Object.entries(QUIZ_KINDS).map(([id, k]) => h('button', { class: 'seg', type: 'button', 'aria-pressed': String(state.kind === id), onclick: () => { state.kind = id; draw(); } }, k.label))),
      h('p', { class: 'muted' }, kind.about),
      h(
        'div',
        { class: 'toolbar' },
        groupSelect(state.group, v => { state.group = v; draw(); }),
        h('select', { 'aria-label': 'Số câu', onchange: e => { state.count = Number(e.target.value); } }, ...COUNTS.map(n => h('option', { value: n, selected: state.count === n }, n === 59 ? 'Cả 59 từ' : `${n} câu`))),
      ),
      h('p', { class: 'muted' }, `Có ${poolSize} từ trong nhóm này. Luyện tập: chọn xong thấy đúng/sai và giải thích ngay.`),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', disabled: poolSize < 4, onclick: () => startQuiz('practice') }, 'Luyện tập'), h('button', { class: 'btn', type: 'button', disabled: poolSize < 4, onclick: () => startQuiz('exam') }, 'Thi thử (tính giờ)')),
    );
  }

  function reviewTab() {
    const s = srsSummary();
    const plan = () => buildSession({ newCount: state.newCount });
    const note = h('p', { role: 'status', 'aria-live': 'polite' });
    const startBtn = h('button', { class: 'btn primary', type: 'button', onclick: startReview }, 'Bắt đầu ôn');
    function refresh() {
      const p = plan();
      startBtn.disabled = p.keys.length === 0;
      startBtn.textContent = p.keys.length ? `Bắt đầu ôn (${p.keys.length} câu)` : 'Hôm nay hết rồi';
      note.textContent = p.keys.length ? `${p.due.length} từ đến hạn ôn và ${p.fresh.length} từ mới.` : 'Không còn từ nào đến hạn. Quay lại vào ngày mai, hoặc tăng số từ mới.';
    }
    function startReview() {
      const questions = sessionQuestions(plan().keys);
      if (questions.length) startExam({ title: 'Ôn katakana hôm nay', questions, mode: 'practice', returnHash: '#/katakana/review' });
    }
    const stat = (value, label, cls = '') => h('div', { class: `stat ${cls}` }, h('strong', null, String(value)), h('span', null, label));
    refresh();
    return h(
      'div',
      { class: 'panel' },
      h('h2', null, 'Ôn lặp lại'),
      h('p', { class: 'muted' }, 'Mỗi từ đúng thì được hỏi lại sau 1, 3, 7, 14 rồi 30 ngày; sai thì quay về hộp 1 và ôn ngay. Mỗi lượt trộn hai dạng: katakana → nghĩa và nghĩa → katakana. Gõ romaji ở Katakana thi cũng được tính vào lịch ôn. Gần ngày thi thì chọn ít từ mới mỗi lượt và ôn đều mỗi ngày.'),
      h('div', { class: 'stats' }, stat(s.due, 'Đến hạn ôn', s.due ? 'bad' : ''), stat(s.fresh, 'Chưa học'), stat(s.learned, 'Đã học'), stat(s.mastered, 'Thuộc kỹ (hộp 5)', 'good')),
      h('div', { class: 'toolbar' }, h('label', { for: 'kata-new' }, 'Từ mới mỗi lượt'), h('select', { id: 'kata-new', onchange: e => { state.newCount = Number(e.target.value); refresh(); } }, ...NEW_COUNTS.map(n => h('option', { value: n, selected: state.newCount === n }, String(n))))),
      note,
      h('div', { class: 'row' }, startBtn),
      h('h3', null, 'Các hộp'),
      h('ul', { class: 'srs-boxes' }, ...s.byBox.map((n, i) => h('li', null, h('span', null, `Hộp ${i + 1}: ôn lại sau ${INTERVAL_DAYS[i]} ngày`), h('strong', null, String(n))))),
    );
  }

  function draw() {
    for (const b of tabBtns) setPressed(b, b.dataset.tab === tab);
    body.replaceChildren(tab === 'list' ? list() : tab === 'quiz' ? quizSetup() : reviewTab());
  }

  draw();
}
