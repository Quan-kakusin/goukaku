import { h, toast, setPressed, writeTabs, meme } from '../ui.js';
import { praise, miss } from '../insights.js';
import { speak } from '../tts.js';
import { getState, save } from '../storage.js';
import { KANA_GROUPS, buildKanaSet, toKatakana, ROMAJI } from '../kana-data.js';
import { matchesRomaji } from '../romaji.js';

const SCRIPT_LABEL = { hira: 'Hiragana', kata: 'Katakana' };

// Ký tự nào hay sai thì được hỏi nhiều hơn; ký tự chưa gặp cũng ưu tiên cao
function weight(stat) {
  if (!stat) return 3;
  return 1 + (4 * stat.ng) / (stat.ok + stat.ng || 1);
}

export function mount(root) {
  let tab = 'chart';
  let script = 'hira';
  const sel = { scripts: new Set(['hira']), groups: new Set(['basic']) };
  let quiz = null; // { pool, current, answer, score: { ok, ng } }

  const body = h('div');
  const tabBtns = [
    ['chart', 'Bảng chữ'],
    ['practice', 'Luyện tập'],
  ].map(([id, label]) => h('button', { type: 'button', class: 'seg', dataset: { tab: id }, onclick: () => setTab(id) }, label));

  root.append(writeTabs('kana'), h('h1', null, 'Kana'), h('div', { class: 'segmented', role: 'group', 'aria-label': 'Chế độ' }, ...tabBtns), body);

  function setTab(id) {
    tab = id;
    draw();
  }

  function chart() {
    const conv = c => (script === 'kata' ? toKatakana(c) : c);
    const cell = c =>
      h(
        'button',
        {
          type: 'button',
          class: 'kana-cell',
          onclick: () => {
            if (!speak(c)) toast('Máy chưa có giọng đọc tiếng Nhật.');
          },
        },
        h('span', { class: 'k' }, conv(c)),
        h('small', null, ROMAJI[c]),
      );

    return h(
      'div',
      null,
      h(
        'div',
        { class: 'segmented', role: 'group', 'aria-label': 'Loại chữ' },
        ...Object.entries(SCRIPT_LABEL).map(([id, label]) =>
          h(
            'button',
            {
              type: 'button',
              class: 'seg',
              'aria-pressed': String(script === id),
              onclick: () => {
                script = id;
                draw();
              },
            },
            label,
          ),
        ),
      ),
      h('p', { class: 'muted' }, 'Bấm vào một ô để nghe phát âm.'),
      ...Object.values(KANA_GROUPS).map(g =>
        h(
          'section',
          { class: 'kana-section' },
          h('h2', null, g.label),
          h('div', { class: `kana-grid cols-${g.cols}` }, ...g.rows.flat().map(c => (c ? cell(c) : h('span', { class: 'kana-gap' })))),
        ),
      ),
    );
  }

  function toggle(set, value, label) {
    return h(
      'label',
      { class: 'check' },
      h('input', {
        type: 'checkbox',
        checked: set.has(value),
        onchange: e => {
          if (e.target.checked) set.add(value);
          else set.delete(value);
          draw();
        },
      }),
      label,
    );
  }

  function setup() {
    const ready = sel.scripts.size > 0 && sel.groups.size > 0;
    return h(
      'div',
      { class: 'panel' },
      h('h2', null, 'Chọn nội dung luyện'),
      h('div', { class: 'checks' }, ...Object.entries(SCRIPT_LABEL).map(([id, l]) => toggle(sel.scripts, id, l))),
      h('div', { class: 'checks' }, ...Object.entries(KANA_GROUPS).map(([id, g]) => toggle(sel.groups, id, g.label))),
      h(
        'button',
        {
          class: 'btn primary',
          type: 'button',
          disabled: !ready,
          onclick: () => {
            quiz = { pool: buildKanaSet([...sel.scripts], [...sel.groups]), current: null, answer: null, score: { ok: 0, ng: 0 } };
            next();
          },
        },
        'Bắt đầu',
      ),
    );
  }

  function next() {
    const stats = getState().kana;
    const weights = quiz.pool.map(k => (quiz.pool.length > 1 && k.char === quiz.current?.char ? 0 : weight(stats[k.char])));
    let r = Math.random() * weights.reduce((a, b) => a + b, 0);
    quiz.current = quiz.pool.find((_, i) => (r -= weights[i]) < 0) ?? quiz.pool[0];
    quiz.answer = null;
    draw();
  }

  function check(value) {
    const k = quiz.current;
    if (!value.trim()) return;
    const ok = matchesRomaji(value, k.romaji, { alts: k.alts });
    const st = (getState().kana[k.char] ??= { ok: 0, ng: 0 });
    st[ok ? 'ok' : 'ng'] += 1;
    save();
    quiz.score[ok ? 'ok' : 'ng'] += 1;
    quiz.answer = { ok, value: value.trim() };
    draw();
  }

  function quizView() {
    const k = quiz.current;
    const { ok, ng } = quiz.score;
    const input = h('input', {
      type: 'text',
      class: 'answer-input',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: false,
      placeholder: 'Gõ romaji rồi nhấn Enter',
    });
    const nextBtn = h('button', { class: 'btn primary', type: 'button', onclick: next }, 'Tiếp tục ', h('kbd', null, 'Enter'));

    queueMicrotask(() => (quiz.answer ? nextBtn : input).focus());

    return h(
      'div',
      { class: 'card' },
      h('div', { class: 'card-top' }, h('span', { class: 'chip' }, `Đúng ${ok}`), h('span', { class: 'chip' }, `Sai ${ng}`)),
      h('div', { class: 'jp-giant' }, k.char),
      quiz.answer
        ? h(
            'div',
            null,
            h(
              'div',
              { class: `result ${quiz.answer.ok ? 'ok' : 'ng'}` },
              meme(quiz.answer.ok ? praise(ok + ng) : miss(ok + ng)),
              quiz.answer.ok ? ` ${k.romaji}` : ` Đáp án: ${k.romaji}`,
            ),
            nextBtn,
          )
        : h(
            'form',
            {
              class: 'answer-form',
              onsubmit: e => {
                e.preventDefault();
                check(input.value);
              },
            },
            input,
            h('button', { class: 'btn primary', type: 'submit' }, 'Kiểm tra'),
          ),
      h(
        'button',
        {
          class: 'btn small',
          type: 'button',
          onclick: () => {
            quiz = null;
            draw();
          },
        },
        'Kết thúc',
      ),
    );
  }

  function draw() {
    for (const b of tabBtns) setPressed(b, b.dataset.tab === tab);
    body.replaceChildren(tab === 'chart' ? chart() : quiz ? quizView() : setup());
  }

  draw();
}
