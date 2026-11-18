// Form chọn bộ từ cho các kiểu luyện từ vựng (thẻ flash, gõ romaji): bấm số bài để chọn, chọn được nhiều bài.
// Luyện toàn bộ từ của các bài đã chọn, thứ tự xáo trộn.

import { h, toast } from '../ui.js';
import { LESSON_COUNT } from '../../data/lessons.js';
import { getDeck } from '../deck.js';
import { pickWords, poolSize, lessonsLabel } from '../words.js';

// Các bài đã chọn lần trước được nhớ lại cho lần mở sau. Đây là thói quen dùng giao diện chứ không phải tiến độ học nên lưu riêng, không vào dữ liệu học.
const PICK_KEY = 'nihongo-n5:word-lessons';
const loadPick = () => {
  try {
    const list = JSON.parse(localStorage.getItem(PICK_KEY));
    const ok = Array.isArray(list) ? list.filter(n => Number.isInteger(n) && n >= 1 && n <= LESSON_COUNT) : [];
    return ok.length ? ok : [1];
  } catch {
    return [1];
  }
};
const savePick = set => {
  try {
    localStorage.setItem(PICK_KEY, JSON.stringify([...set]));
  } catch {
    // không lưu được thì lần sau chọn lại, không sao
  }
};

const SCOPE_KEY = 'nihongo-n5:word-scope';
const SCOPES = {
  common: ['Hay gặp trong đề N5', 'Từ hay gặp trong đề N5: gọn nhất, nên học trước kỳ thi.'],
  main: ['Từ vựng chính', 'Mọi từ vựng chính của bài: bỏ câu dài, trợ từ, từ cảm thán và hậu tố đếm.'],
  all: ['Tất cả', 'Toàn bộ từ vựng của bài, kể cả câu dài, trợ từ và hậu tố.'],
};
const loadScope = () => {
  try {
    const v = localStorage.getItem(SCOPE_KEY);
    return v in SCOPES ? v : 'common';
  } catch {
    return 'common';
  }
};
const saveScope = v => {
  try {
    localStorage.setItem(SCOPE_KEY, v);
  } catch {
    // không lưu được thì lần sau về mặc định, không sao
  }
};

// extra: các phần tử form thêm riêng cho từng kiểu luyện. onStart(words, { label }).
// mainFilter: hiện mục "Bộ từ" (hay gặp trong đề N5 / từ vựng chính / tất cả), mặc định "hay gặp trong đề N5".
// source: nguồn khác ngoài từ vựng, { size(lessons), pick(lessons, shuffle), unit } (vd các câu ví dụ). initial: số bài chọn sẵn (vd mở từ trang Bài tập).
export function wordSetup({ intro, extra = [], startLabel, onStart, source, initial, mainFilter = false }) {
  const selected = new Set(initial?.length ? initial : loadPick());
  const unit = source?.unit ?? 'từ';
  let scope = loadScope();
  const scopeBtns = Object.entries(SCOPES).map(([id, [label]]) => h('button', { class: 'seg', type: 'button', dataset: { scope: id }, onclick: () => { scope = id; saveScope(id); update(); } }, label));
  const scopeNote = h('p', { class: 'muted' });
  const mainOnly = () => (mainFilter && !source ? scope : 'all');
  const sizeOf = lessons => (source ? source.size(lessons) : poolSize(getDeck(), lessons, mainOnly()));

  const chips = Array.from({ length: LESSON_COUNT }, (_, i) => {
    const n = i + 1;
    return h('button', {
      class: 'pick',
      type: 'button',
      'aria-label': `Bài ${n}`,
      'aria-pressed': String(selected.has(n)),
      onclick: () => {
        if (selected.has(n)) selected.delete(n);
        else selected.add(n);
        update();
      },
    }, String(n));
  });

  const set = nums => () => {
    selected.clear();
    nums.forEach(n => selected.add(n));
    update();
  };
  const mix = h('input', { type: 'checkbox', id: 'w-shuffle', checked: true });
  const note = h('p', { class: 'muted', role: 'status', 'aria-live': 'polite' });
  const startBtn = h('button', { class: 'btn primary', type: 'button', onclick: start }, startLabel);

  // Từ riêng chưa xếp bài (lesson 0) chỉ vào bộ khi chọn đủ 25 bài
  const lessons = () => {
    const l = [...selected].sort((a, b) => a - b);
    return l.length === LESSON_COUNT ? [0, ...l] : l;
  };
  function update() {
    chips.forEach((c, i) => c.setAttribute('aria-pressed', String(selected.has(i + 1))));
    scopeBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scope === scope)));
    scopeNote.textContent = SCOPES[scope][1];
    savePick(selected);
    const n = selected.size ? sizeOf(lessons()) : 0;
    startBtn.disabled = n === 0;
    note.textContent = selected.size === 0 ? 'Hãy chọn ít nhất một bài.' : `${lessonsLabel(lessons())}: ${n} ${unit}.`;
  }
  function start() {
    const words = source ? source.pick(lessons(), mix.checked) : pickWords({ deck: getDeck(), lessons: lessons(), count: 'all', rng: Math.random, shuffle: mix.checked, scope: mainOnly() });
    if (!words.length) return toast(`Các bài đã chọn chưa có ${unit} nào để luyện.`);
    return onStart(words, { label: lessonsLabel(lessons()), shuffle: mix.checked });
  }

  const section = h(
    'section',
    { class: 'panel' },
    h('p', { class: 'muted' }, intro),
    h('p', { class: 'eyebrow', id: 'w-pick-label' }, 'Chọn bài (bấm nhiều số để luyện nhiều bài)'),
    h('div', { class: 'picker wrap', role: 'group', 'aria-labelledby': 'w-pick-label' }, ...chips),
    h(
      'div',
      { class: 'row' },
      h('button', { class: 'btn small', type: 'button', onclick: set(Array.from({ length: LESSON_COUNT }, (_, i) => i + 1)) }, 'Tất cả'),
      h('button', { class: 'btn small', type: 'button', onclick: set([]) }, 'Bỏ chọn'),
    ),
    ...extra,
    mainFilter && !source && h('p', { class: 'eyebrow', id: 'w-scope-label' }, 'Bộ từ'),
    mainFilter && !source && h('div', { class: 'segmented', role: 'group', 'aria-labelledby': 'w-scope-label' }, ...scopeBtns),
    mainFilter && !source && scopeNote,
    h('label', { class: 'check', for: 'w-shuffle' }, mix, h('span', null, 'Trộn thứ tự (bỏ tích để luyện theo thứ tự trong sách)')),
    note,
    startBtn,
  );
  update();
  return section;
}
