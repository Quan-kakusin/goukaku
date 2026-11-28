// Kanji hay thi: 81 từ chữ Hán nên thuộc trước kỳ thi. Trên cùng là bài trắc nghiệm (chọn số câu tuỳ ý), bên dưới là danh sách (che cách đọc để tự kiểm tra).

import { h, show, speakButton, kanjiTabs } from '../ui.js';
import { KANJI_THI, KANJI_THI_GROUPS } from '../../data/kanji-thi.js';
import { thiSet } from '../quiz-set.js';
import { startExam } from '../exam-session.js';
import { countPicker } from './count-picker.js';

const STARS = KANJI_THI.filter(w => w.star).length;

export function mount(root) {
  const state = { group: 'all', hide: false };
  const opened = new Set(); // từ đã bấm hiện cách đọc khi đang che
  const picker = countPicker({ total: KANJI_THI.length, unit: 'câu', initial: 20, id: 'thi-count' });
  const listBox = h('div');

  function startQuiz() {
    startExam({ title: 'Trắc nghiệm kanji hay thi', questions: thiSet(picker.get()), mode: 'practice', returnHash: '#/kanjithi' });
  }

  const quiz = h(
    'section',
    { class: 'panel' },
    h('h2', null, 'Trắc nghiệm'),
    h('p', { class: 'muted' }, `Mỗi câu 4 đáp án, chọn xong thấy đúng sai và giải thích ngay. Hai dạng trộn lẫn: nhìn kanji chọn cách đọc (hiragana), hoặc nhìn cách đọc chọn kanji. Mỗi từ trong ${KANJI_THI.length} từ ra tối đa một câu.`),
    picker.el,
    h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', onclick: startQuiz }, 'Bắt đầu')),
  );

  show(
    root,
    kanjiTabs('kanjithi'),
    h('h1', null, 'Kanji hay thi'),
    h('p', { class: 'muted' }, `${KANJI_THI.length} từ chữ Hán gặp nhiều trong các đề N5 lấy từ ngoài, thêm đủ bộ từ chỉ phương hướng. Dấu ⭐ (${STARS} từ) là từ đề hay bắt đọc hoặc viết: học trước.`),
    quiz,
    h('h2', null, `${KANJI_THI.length} từ`),
    listBox,
  );

  const inGroup = w => state.group === 'all' || (state.group === 'star' ? w.star : w.group === state.group);

  function list() {
    const shown = KANJI_THI.filter(inGroup);
    const rows = shown.map(w => {
      const reveal = !state.hide || opened.has(w.word);
      return h(
        'li',
        { class: 'kata-row' },
        speakButton(w.kana),
        h('span', { class: 'kata-word-cell' }, h('span', { class: 'kata-word', lang: 'ja' }, w.word), w.star && h('small', { class: 'muted', title: 'Hay bị hỏi trong đề' }, '⭐')),
        reveal
          ? h('span', { class: 'kata-meaning' }, h('span', { lang: 'ja' }, w.kana), h('small', { class: 'muted' }, w.vi))
          : h('button', { class: 'btn small', type: 'button', onclick: () => { opened.add(w.word); draw(); } }, 'Hiện cách đọc'),
      );
    });
    return h(
      'div',
      null,
      h(
        'div',
        { class: 'toolbar' },
        h(
          'select',
          { 'aria-label': 'Nhóm từ', onchange: e => { state.group = e.target.value; draw(); } },
          h('option', { value: 'all', selected: state.group === 'all' }, 'Mọi nhóm'),
          h('option', { value: 'star', selected: state.group === 'star' }, '⭐ Hay bị hỏi'),
          ...KANJI_THI_GROUPS.map(g => h('option', { value: g, selected: state.group === g }, g)),
        ),
        h('label', { class: 'check', for: 'thi-hide' }, h('input', { type: 'checkbox', id: 'thi-hide', checked: state.hide, onchange: e => { state.hide = e.target.checked; opened.clear(); draw(); } }), h('span', null, 'Che cách đọc để tự kiểm tra')),
      ),
      h('p', { class: 'muted' }, `${shown.length} từ. Bấm biểu tượng loa để nghe.`),
      h('ul', { class: 'kata-list' }, ...rows),
    );
  }

  function draw() {
    listBox.replaceChildren(list());
  }

  draw();
}
