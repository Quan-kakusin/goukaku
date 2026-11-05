import { h, furigana, speakButton, setPressed, show, writeTabs } from '../ui.js';
import { KANJI } from '../../data/kanji-n5.js';
import { KANJI_WORDS, kanjiQuestion, kanjiPickQuestion, kanjiHvQuestion, confusablesOf, KANJI_BY_CHAR, pickN } from '../questions.js';
import { KANJI_NOTES } from '../../data/kanji-notes.js';
import { buildSession, sessionQuestions, srsSummary } from '../kanji-study.js';
import { INTERVAL_DAYS } from '../srs.js';
import { startExam } from '../exam-session.js';
import { mainReading } from '../furigana.js';
import { defaultMinutes } from '../exam.js';

const GROUPS = [...new Set(KANJI.map(k => k.group))];
const COUNTS = [10, 20, 30];
const NEW_COUNTS = [0, 3, 5, 10];
const inGroup = (group, k) => group === 'all' || k.group === group;
// Bốn dạng luyện. pool(nhóm) trả về các mục để ra đề, make(mục) dựng câu hỏi.
//   read/pick: mục là từ kanji (nhìn kanji chọn cách đọc, và ngược lại chọn chữ Hán). hv/confuse: mục là một chữ Hán.
const QUIZ_KINDS = {
  read: { label: 'Chọn cách đọc', title: 'Luyện đọc kanji', unit: 'từ', pool: g => KANJI_WORDS.filter(w => g === 'all' || w.group === g), make: kanjiQuestion,
    about: 'Giống phần 文字・語彙 trong đề thi: cho một từ viết bằng kanji, chọn cách đọc đúng. Không hiện furigana vì đó chính là đáp án.' },
  pick: { label: 'Chọn chữ Hán', title: 'Luyện nhận mặt chữ kanji', unit: 'từ', pool: g => KANJI_WORDS.filter(w => g === 'all' || w.group === g), make: kanjiPickQuestion,
    about: 'Cho cách đọc và nghĩa, chọn từ viết bằng kanji đúng trong các từ có chữ giống nhau (日曜日 / 月曜日 / 火曜日). Dạng này luyện nhận mặt chữ, điều mà gõ romaji không luyện được.' },
  hv: { label: 'Hán Việt → chữ', title: 'Luyện Hán Việt → chữ Hán', unit: 'chữ', pool: g => KANJI.filter(k => inGroup(g, k)), make: kanjiHvQuestion,
    about: 'Cho nghĩa và âm Hán Việt (ví dụ "trái · TẢ"), chọn đúng chữ Hán. Người Việt biết sẵn Hán Việt nên đây là đường tắt để nhớ nghĩa và hình chữ. Giải thích có mẹo nhớ cấu tạo chữ.' },
  confuse: { label: 'Chữ dễ nhầm', title: 'Luyện chữ kanji dễ nhầm', unit: 'chữ', pool: g => KANJI.filter(k => inGroup(g, k) && confusablesOf(k.char).length > 0), make: kanjiHvQuestion,
    about: 'Như dạng Hán Việt → chữ nhưng chỉ ra các chữ hay bị nhầm (日/目/月, 人/入, 木/本/東, 左/右...) và các đáp án nhiễu là chính những chữ giống nó. Giải thích nêu rõ khác nhau ở đâu.' },
};

export function mount(root, params = []) {
  let tab = ['list', 'quiz', 'review'].includes(params[0]) ? params[0] : 'list';
  let group = 'all';
  let selected = null;
  const setup = { group: 'all', count: 10, kind: 'read', newCount: 5 };

  const body = h('div');
  const tabBtns = [
    ['list', 'Danh sách'],
    ['quiz', 'Luyện tập'],
    ['review', 'Ôn hôm nay'],
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
    const kind = QUIZ_KINDS[setup.kind];
    const questions = pickN(kind.pool(setup.group), setup.count).map(item => kind.make(item));
    startExam({
      title: kind.title,
      questions,
      mode,
      limitSec: mode === 'exam' ? defaultMinutes(questions.length) * 60 : null,
    });
  }

  function quizSetup() {
    const kind = QUIZ_KINDS[setup.kind];
    const poolSize = kind.pool(setup.group).length;
    return h(
      'div',
      { class: 'panel' },
      h('h2', null, 'Luyện kanji'),
      h('div', { class: 'segmented', role: 'group', 'aria-label': 'Dạng luyện' }, ...Object.entries(QUIZ_KINDS).map(([id, k]) => h('button', { class: 'seg', type: 'button', 'aria-pressed': String(setup.kind === id), onclick: () => { setup.kind = id; draw(); } }, k.label))),
      h('p', { class: 'muted' }, kind.about),
      h('p', { class: 'muted' }, 'Có chấm điểm và giải chi tiết. Muốn gõ cách đọc, sang ', h('a', { href: '#/typing/kanji' }, 'Gõ romaji → Đọc kanji'), '.'),
      h(
        'div',
        { class: 'toolbar' },
        groupSelect(setup.group, v => { setup.group = v; draw(); }, 'Nhóm kanji'),
        h('select', { 'aria-label': 'Số câu', onchange: e => { setup.count = Number(e.target.value); } }, ...COUNTS.map(n => h('option', { value: n, selected: setup.count === n }, `${n} câu`))),
      ),
      h('p', { class: 'muted' }, `Có ${poolSize} ${kind.unit} trong nhóm này.`),
      h(
        'div',
        { class: 'row' },
        h('button', { class: 'btn primary', type: 'button', disabled: poolSize < 4, onclick: () => startQuiz('practice') }, 'Luyện tập'),
        h('button', { class: 'btn', type: 'button', disabled: poolSize < 4, onclick: () => startQuiz('exam') }, 'Thi thử (tính giờ)'),
      ),
    );
  }

  // Ôn hôm nay: các mục đến hạn (từ và chữ) cộng vài mục mới, theo lịch ôn lặp lại (js/srs.js)
  function reviewTab() {
    const s = srsSummary();
    const plan = () => buildSession({ newCount: setup.newCount });
    const sizeNote = h('p', { role: 'status', 'aria-live': 'polite' });
    const startBtn = h('button', { class: 'btn primary', type: 'button', onclick: startReview }, 'Bắt đầu ôn');
    function refresh() {
      const n = plan().keys.length;
      startBtn.disabled = n === 0;
      startBtn.textContent = n ? `Bắt đầu ôn (${n} câu)` : 'Hôm nay hết rồi';
      const p = plan();
      sizeNote.textContent = n ? `${p.due.length} mục đến hạn ôn và ${p.fresh.length} mục mới.` : 'Không còn mục nào đến hạn. Quay lại vào ngày mai, hoặc tăng số chữ mới.';
    }
    function startReview() {
      const questions = sessionQuestions(plan().keys);
      if (!questions.length) return;
      startExam({ title: 'Ôn kanji hôm nay', questions, mode: 'practice', returnHash: '#/kanji/review' });
    }
    const stat = (value, label, cls = '') => h('div', { class: `stat ${cls}` }, h('strong', null, String(value)), h('span', null, label));
    const boxRows = s.byBox.map((n, i) =>
      h('li', null, h('span', null, `Hộp ${i + 1}: ôn lại sau ${INTERVAL_DAYS[i]} ngày`), h('strong', null, String(n))),
    );
    refresh();
    return h(
      'div',
      { class: 'panel' },
      h('h2', null, 'Ôn lặp lại'),
      h('p', { class: 'muted' }, 'Mỗi từ hoặc chữ đúng thì được hỏi lại sau 1, 3, 7, 14 rồi 30 ngày; sai thì quay về hộp 1 và ôn ngay. Cách này nhớ lâu hơn nhiều so với học dồn. Mỗi lượt trộn các dạng: chọn cách đọc, chọn chữ Hán và Hán Việt → chữ. Gõ romaji ở mục Đọc kanji cũng được tính vào lịch ôn.'),
      h('div', { class: 'stats' }, stat(s.due, 'Đến hạn ôn', s.due ? 'bad' : ''), stat(s.fresh, 'Chưa học'), stat(s.learned, 'Đã học'), stat(s.mastered, 'Thuộc kỹ (hộp 5)', 'good')),
      h(
        'div',
        { class: 'toolbar' },
        h('label', { for: 'srs-new' }, 'Mục mới mỗi lượt'),
        h('select', { id: 'srs-new', onchange: e => { setup.newCount = Number(e.target.value); refresh(); } }, ...NEW_COUNTS.map(n => h('option', { value: n, selected: setup.newCount === n }, String(n)))),
      ),
      sizeNote,
      h('div', { class: 'row' }, startBtn),
      h('h3', null, 'Các hộp'),
      h('ul', { class: 'srs-boxes' }, ...boxRows),
    );
  }

  function draw() {
    for (const b of tabBtns) setPressed(b, b.dataset.tab === tab);
    body.replaceChildren(tab === 'list' ? list() : tab === 'quiz' ? quizSetup() : reviewTab());
  }

  draw();
}
