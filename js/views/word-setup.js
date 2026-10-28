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

// extra: các phần tử form thêm riêng cho từng kiểu luyện. onStart(words, { label }).
// source: nguồn khác ngoài từ vựng, { size(lessons), pick(lessons, shuffle), unit } (vd các câu ví dụ). initial: số bài chọn sẵn (vd mở từ trang Bài tập).
export function wordSetup({ intro, extra = [], startLabel, onStart, source, initial }) {
  const selected = new Set(initial?.length ? initial : loadPick());
  const unit = source?.unit ?? 'từ';
  const sizeOf = lessons => (source ? source.size(lessons) : poolSize(getDeck(), lessons));

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
    savePick(selected);
    const n = selected.size ? sizeOf(lessons()) : 0;
    startBtn.disabled = n === 0;
    note.textContent = selected.size === 0 ? 'Hãy chọn ít nhất một bài.' : `${lessonsLabel(lessons())}: ${n} ${unit}.`;
  }
  function start() {
    const words = source ? source.pick(lessons(), mix.checked) : pickWords({ deck: getDeck(), lessons: lessons(), count: 'all', rng: Math.random, shuffle: mix.checked });
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
    h('label', { class: 'check', for: 'w-shuffle' }, mix, h('span', null, 'Trộn thứ tự (bỏ tích để luyện theo thứ tự trong sách)')),
    note,
    startBtn,
  );
  update();
  return section;
}
