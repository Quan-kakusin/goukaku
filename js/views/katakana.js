// Katakana thi: 59 từ katakana hay gặp trong đề N5. Trên cùng là bài trắc nghiệm (chọn số câu tuỳ ý), bên dưới là danh sách (che nghĩa để tự kiểm tra).
// Gõ romaji cho các từ này nằm ở Gõ romaji → Katakana thi.

import { h, show, speakButton, kanjiTabs } from '../ui.js';
import { KATAKANA, KATAKANA_GROUPS } from '../../data/katakana-n5.js';
import { kataSet } from '../quiz-set.js';
import { startExam } from '../exam-session.js';
import { toRomaji } from '../romaji.js';
import { countPicker } from './count-picker.js';

export function mount(root) {
  const state = { group: 'all', hide: false };
  const opened = new Set(); // từ đã bấm hiện nghĩa khi đang che
  const picker = countPicker({ total: KATAKANA.length, unit: 'câu', initial: 20, id: 'kata-count' });
  const listBox = h('div');

  function startQuiz() {
    startExam({ title: 'Trắc nghiệm katakana', questions: kataSet(picker.get()), mode: 'practice', returnHash: '#/katakana' });
  }

  const quiz = h(
    'section',
    { class: 'panel' },
    h('h2', null, 'Trắc nghiệm'),
    h('p', { class: 'muted' }, 'Mỗi câu 4 đáp án, chọn xong thấy đúng sai, cách đọc romaji và giải thích ngay. Hai dạng trộn lẫn: nhìn katakana chọn nghĩa, hoặc nhìn nghĩa chọn katakana. Mỗi từ trong 59 từ ra tối đa một câu.'),
    picker.el,
    h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', onclick: startQuiz }, 'Bắt đầu')),
  );

  show(
    root,
    kanjiTabs('katakana'),
    h('h1', null, 'Katakana thi'),
    h('p', { class: 'muted' }, '59 từ katakana hay gặp trong đề N5, chia thành 6 nhóm để học gọn trước kỳ thi. Gõ romaji các từ này ở ', h('a', { href: '#/typing/kata' }, 'Gõ romaji → Katakana thi'), '.'),
    quiz,
    h('h2', null, '59 từ katakana'),
    listBox,
  );

  function list() {
    const shown = KATAKANA.filter(k => state.group === 'all' || k.group === state.group);
    const rows = shown.map(k => {
      const reveal = !state.hide || opened.has(k.kana);
      return h(
        'li',
        { class: 'kata-row' },
        speakButton(k.kana),
        h('span', { class: 'kata-word-cell' }, h('span', { class: 'kata-word', lang: 'ja' }, k.kana), h('small', { class: 'kata-romaji muted' }, toRomaji(k.kana))),
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
        h('select', { 'aria-label': 'Nhóm từ', onchange: e => { state.group = e.target.value; draw(); } }, h('option', { value: 'all', selected: state.group === 'all' }, 'Mọi nhóm'), ...KATAKANA_GROUPS.map(g => h('option', { value: g.id, selected: state.group === g.id }, g.label))),
        h('label', { class: 'check', for: 'kata-hide' }, h('input', { type: 'checkbox', id: 'kata-hide', checked: state.hide, onchange: e => { state.hide = e.target.checked; opened.clear(); draw(); } }), h('span', null, 'Che nghĩa để tự kiểm tra')),
      ),
      h('p', { class: 'muted' }, `${shown.length} từ. Dưới mỗi từ là cách đọc bằng romaji (ー đọc kéo dài: koohii = コーヒー). Bấm biểu tượng loa để nghe. Phần "từ gốc" là tiếng Anh (hoặc tiếng nước ngoài) mà từ này mượn: đoán nghĩa từ đó sẽ nhớ nhanh hơn.`),
      h('ul', { class: 'kata-list' }, ...rows),
    );
  }

  function draw() {
    listBox.replaceChildren(list());
  }

  draw();
}
