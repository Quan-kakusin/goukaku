import { h, furigana, speakButton, setPressed, show, writeTabs } from '../ui.js';
import { KANJI } from '../../data/kanji-n5.js';
import { KANJI_WORDS, kanjiQuestion, pickN } from '../questions.js';
import { startExam } from '../exam-session.js';
import { mainReading } from '../furigana.js';
import { defaultMinutes } from '../exam.js';

const GROUPS = [...new Set(KANJI.map(k => k.group))];
const COUNTS = [10, 20, 30];

export function mount(root) {
  let tab = 'list';
  let group = 'all';
  let selected = null;
  const setup = { group: 'all', count: 10 };

  const body = h('div');
  const tabBtns = [
    ['list', 'Danh sách'],
    ['quiz', 'Luyện đọc'],
  ].map(([id, label]) => h('button', { type: 'button', class: 'seg', dataset: { tab: id }, onclick: () => setTab(id) }, label));

  show(root, writeTabs('kanji'), h('h1', null, 'Kanji N5'), h('p', { class: 'muted' }, 'Bài học và bài tập của app chỉ dùng kana. Chữ Hán học riêng ở đây: 80 chữ cần thiết nhất cho N5.'), h('div', { class: 'segmented', role: 'group', 'aria-label': 'Chế độ' }, ...tabBtns), body);

  function setTab(id) {
    tab = id;
    draw();
  }

  const groupSelect = (value, onchange, label) =>
    h(
      'select',
      { 'aria-label': label, onchange: e => onchange(e.target.value) },
      h('option', { value: 'all', selected: value === 'all' }, 'Mọi nhóm'),
      ...GROUPS.map(g => h('option', { value: g, selected: value === g }, g)),
    );

  function detail(k) {
    return h(
      'div',
      { class: 'panel kanji-detail' },
      h('div', { class: 'k-big', lang: 'ja' }, h('ruby', null, k.char, h('rp', null, '('), h('rt', null, mainReading(k)), h('rp', null, ')'))),
      h(
        'dl',
        null,
        h('dt', null, 'Hán Việt · nghĩa'),
        h('dd', null, `${k.hv} · ${k.vi}`),
        h('dt', null, 'Âm On (音読み)'),
        h('dd', { lang: 'ja' }, k.on),
        h('dt', null, 'Âm Kun (訓読み)'),
        h('dd', { lang: 'ja' }, k.kun),
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
      detailBox.replaceChildren(...(selected ? [detail(KANJI.find(k => k.char === selected))] : []));
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
          h('small', null, k.hv),
        ),
      );
    }
    if (selected && !cells.has(selected)) selected = null;

    const wrap = h(
      'div',
      null,
      h('div', { class: 'toolbar' }, groupSelect(group, v => { group = v; draw(); }, 'Lọc theo nhóm')),
      h('p', { class: 'muted' }, `${shown.length} chữ. Chữ hiragana nhỏ phía trên là cách đọc chính. Bấm vào một chữ để xem Hán Việt, mọi âm đọc và từ ví dụ.`),
      detailBox,
      h('div', { class: 'kanji-grid' }, ...cells.values()),
    );
    paint();
    return wrap;
  }

  function startQuiz(mode) {
    const pool = KANJI_WORDS.filter(w => setup.group === 'all' || w.group === setup.group);
    const questions = pickN(pool, setup.count).map(w => kanjiQuestion(w));
    startExam({
      title: 'Luyện đọc kanji',
      questions,
      mode,
      limitSec: mode === 'exam' ? defaultMinutes(questions.length) * 60 : null,
    });
  }

  function quizSetup() {
    const poolSize = KANJI_WORDS.filter(w => setup.group === 'all' || w.group === setup.group).length;
    return h(
      'div',
      { class: 'panel' },
      h('h2', null, 'Chọn cách đọc đúng của từ'),
      h('p', { class: 'muted' }, 'Giống phần 文字・語彙 trong đề thi: cho một từ viết bằng kanji, chọn cách đọc đúng. Có chấm điểm và giải chi tiết. Phần luyện đọc không hiện furigana vì đó chính là đáp án. Muốn thi thử đủ các phần, vào mục Thi thử N5.'),
      h(
        'div',
        { class: 'toolbar' },
        groupSelect(setup.group, v => { setup.group = v; draw(); }, 'Nhóm kanji'),
        h('select', { 'aria-label': 'Số câu', onchange: e => { setup.count = Number(e.target.value); } }, ...COUNTS.map(n => h('option', { value: n, selected: setup.count === n }, `${n} câu`))),
      ),
      h('p', { class: 'muted' }, `Có ${poolSize} từ trong nhóm này.`),
      h(
        'div',
        { class: 'row' },
        h('button', { class: 'btn primary', type: 'button', disabled: poolSize < 4, onclick: () => startQuiz('practice') }, 'Luyện tập'),
        h('button', { class: 'btn', type: 'button', disabled: poolSize < 4, onclick: () => startQuiz('exam') }, 'Thi thử (tính giờ)'),
      ),
    );
  }

  function draw() {
    for (const b of tabBtns) setPressed(b, b.dataset.tab === tab);
    body.replaceChildren(tab === 'list' ? list() : quizSetup());
  }

  draw();
}
