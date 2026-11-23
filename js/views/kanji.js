import { h, furigana, speakButton, setPressed, show, kanjiTabs } from '../ui.js';
import { KANJI } from '../../data/kanji-n5.js';
import { confusablesOf, KANJI_BY_CHAR } from '../questions.js';
import { KANJI_NOTES } from '../../data/kanji-notes.js';
import { KANJI_PICS } from '../../data/kanji-pics.js';
import { kanjiSet } from '../quiz-set.js';
import { startExam } from '../exam-session.js';
import { mainReading } from '../furigana.js';
import { countPicker } from './count-picker.js';

// Kanji N5: đúng 80 chữ. Trên cùng là bài trắc nghiệm (chọn số câu tuỳ ý), bên dưới là danh sách để xem từng chữ.
const GROUPS = [...new Set(KANJI.map(k => k.group))];

export function mount(root) {
  let group = 'all';
  let selected = null;

  const picker = countPicker({ total: KANJI.length, unit: 'câu', initial: 20, id: 'kanji-count' });
  const listBox = h('div');

  function startQuiz() {
    const questions = kanjiSet(picker.get());
    startExam({ title: 'Trắc nghiệm kanji', questions, mode: 'practice', returnHash: '#/kanji' });
  }

  const quiz = h(
    'section',
    { class: 'panel' },
    h('h2', null, 'Trắc nghiệm'),
    h('p', { class: 'muted' }, 'Mỗi câu 4 đáp án, chọn xong thấy đúng sai và giải thích ngay. Hai dạng trộn lẫn: nhìn kanji chọn cách đọc (hiragana), hoặc nhìn cách đọc chọn kanji. Mỗi chữ trong 80 chữ ra tối đa một câu.'),
    picker.el,
    h('div', { class: 'row' }, h('button', { class: 'btn primary', type: 'button', onclick: startQuiz }, 'Bắt đầu')),
    h('p', { class: 'muted' }, 'Muốn gõ cách đọc bằng bàn phím, sang ', h('a', { href: '#/typing/kanji' }, 'Gõ romaji → Đọc kanji'), '.'),
  );

  show(root, kanjiTabs('kanji'), h('h1', null, 'Kanji N5'), h('p', { class: 'muted' }, 'Bài học và bài tập của app chỉ dùng kana. Chữ Hán học riêng ở đây: 80 chữ cần thiết nhất cho N5.'), quiz, h('h2', null, '80 chữ kanji'), listBox);

  // Cấu tạo, mẹo nhớ và các chữ dễ nhầm của một chữ (data/kanji-notes.js)
  function memoryRows(k) {
    const [parts, tip] = KANJI_NOTES[k.char] ?? ['', ''];
    const mates = confusablesOf(k.char).map(c => KANJI_BY_CHAR.get(c));
    return [
      parts && h('dt', null, 'Cấu tạo'),
      parts && h('dd', { lang: 'ja' }, parts),
      tip && h('dt', null, 'Mẹo nhớ'),
      tip && h('dd', null, tip),
      mates.length > 0 && h('dt', null, 'Dễ nhầm với'),
      mates.length > 0 && h('dd', null, h('ul', { class: 'words' }, ...mates.map(m => h('li', null, h('span', { lang: 'ja' }, m.char), h('span', { class: 'muted' }, `${m.hv} · ${m.vi}`))))),
    ];
  }

  function detail(k) {
    return h(
      'div',
      { class: 'panel kanji-detail' },
      h('div', { class: 'k-side' }, h('div', { class: 'k-big', lang: 'ja' }, h('ruby', null, k.char, h('rp', null, '('), h('rt', null, mainReading(k)), h('rp', null, ')'))), h('div', { class: 'k-pic-big', role: 'img', 'aria-label': `Hình gợi nhớ: ${k.vi}` }, KANJI_PICS[k.char])),
      h(
        'dl',
        null,
        h('dt', null, 'Hán Việt · nghĩa'),
        h('dd', null, `${k.hv} · ${k.vi}`),
        h('dt', null, 'Âm On (音読み)'),
        h('dd', { lang: 'ja' }, k.on),
        h('dt', null, 'Âm Kun (訓読み)'),
        h('dd', { lang: 'ja' }, k.kun),
        ...memoryRows(k),
        h('dt', null, 'Từ ví dụ'),
        h('dd', null, h('ul', { class: 'words' }, ...k.words.map(w => h('li', null, speakButton(w.kana), h('span', { lang: 'ja' }, furigana(w.word, w.kana)), h('span', { class: 'muted' }, w.vi))))),
      ),
    );
  }

  // Giữ nguyên các ô khi chọn để tiêu điểm bàn phím không bị mất
  function list() {
    const detailBox = h('div', { 'aria-live': 'polite' });
    const cells = new Map();

    function paint() {
      for (const [c, btn] of cells) setPressed(btn, c === selected);
      detailBox.replaceChildren(...(selected ? [detail(KANJI_BY_CHAR.get(selected))] : []));
    }

    const shown = KANJI.filter(k => group === 'all' || k.group === group);
    for (const k of shown) {
      cells.set(
        k.char,
        h(
          'button',
          {
            type: 'button',
            class: 'kanji-cell',
            'aria-pressed': 'false',
            'aria-label': `${k.char}, đọc là ${mainReading(k)}, ${k.hv}, ${k.vi}`,
            onclick: () => {
              selected = selected === k.char ? null : k.char;
              paint();
            },
          },
          h('ruby', { class: 'k', lang: 'ja' }, k.char, h('rp', null, '('), h('rt', null, mainReading(k)), h('rp', null, ')')),
          h('span', { class: 'k-pic', 'aria-hidden': 'true' }, KANJI_PICS[k.char]),
          h('small', null, k.hv),
        ),
      );
    }
    if (selected && !cells.has(selected)) selected = null;

    const select = h(
      'select',
      { 'aria-label': 'Lọc theo nhóm', onchange: e => { group = e.target.value; draw(); } },
      h('option', { value: 'all', selected: group === 'all' }, 'Mọi nhóm'),
      ...GROUPS.map(g => h('option', { value: g, selected: group === g }, g)),
    );
    const wrap = h(
      'div',
      null,
      h('div', { class: 'toolbar' }, select),
      h('p', { class: 'muted' }, `${shown.length} chữ. Chữ hiragana nhỏ phía trên là cách đọc chính. Hình emoji dưới mỗi chữ là hình gợi nhớ nghĩa. Bấm vào một chữ để xem Hán Việt, mọi âm đọc, mẹo nhớ và từ ví dụ.`),
      detailBox,
      h('div', { class: 'kanji-grid' }, ...cells.values()),
    );
    paint();
    return wrap;
  }

  function draw() {
    listBox.replaceChildren(list());
  }

  draw();
}
