// Chọn số câu: vài số gợi ý, nút "Tất cả" và ô gõ số bất kỳ (từ 1 tới tổng số).
import { h, setPressed } from '../ui.js';
import { clampCount } from '../quiz-set.js';

export function countPicker({ total, unit = 'câu', initial = 20, id = 'count' }) {
  let value = clampCount(initial, total);
  const presets = [...[10, 20, 40].filter(n => n < total), total];
  const input = h('input', { type: 'number', id, min: '1', max: String(total), inputmode: 'numeric', value: String(value), 'aria-label': `Số ${unit} muốn làm, tối đa ${total}` });
  const buttons = presets.map(n => h('button', { class: 'pick', type: 'button', onclick: () => set(n) }, n === total ? `Tất cả (${total})` : String(n)));

  function paint() {
    buttons.forEach((b, i) => setPressed(b, presets[i] === value));
    input.value = String(value);
  }
  function set(n) {
    value = clampCount(n, total, value);
    paint();
  }
  // Gõ dở (ô trống) thì giữ số cũ; gõ quá tổng thì kéo về tổng
  input.addEventListener('input', () => {
    if (input.value === '') return;
    value = clampCount(input.value, total, value);
    buttons.forEach((b, i) => setPressed(b, presets[i] === value));
    if (Number(input.value) !== value) input.value = String(value);
  });
  input.addEventListener('change', paint);
  paint();

  const el = h(
    'div',
    { class: 'count-picker' },
    h('p', { class: 'eyebrow', id: `${id}-label` }, `Số ${unit} muốn làm`),
    h('div', { class: 'picker wrap', role: 'group', 'aria-labelledby': `${id}-label` }, ...buttons, h('label', { class: 'row', for: id }, h('span', { class: 'muted' }, 'hoặc gõ số:'), input)),
  );
  return { el, get: () => value };
}
