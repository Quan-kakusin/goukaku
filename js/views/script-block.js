import { h } from '../ui.js';

// Lời thoại của một câu nghe, mỗi dòng tiếng Nhật kèm bản dịch (q.scriptVi cùng thứ tự với lời thoại).
// q.audio: đọc bằng giọng trình duyệt. q.script: bản chép lời của file âm thanh thật.
export function scriptBlock(q, { replay } = {}) {
  const lines = q.script ?? q.audio;
  if (!lines) return null;
  return h(
    'div',
    { class: 'script' },
    h('h3', null, 'Lời thoại'),
    h(
      'ol',
      { class: 'script-lines' },
      ...lines.map(([who, line], i) => h('li', null, h('p', { lang: 'ja' }, h('strong', null, `${who}: `), line), q.scriptVi?.[i] && h('p', { class: 'muted' }, q.scriptVi[i]))),
    ),
    q.audio && replay && h('button', { class: 'btn small', type: 'button', onclick: () => replay(q.audio) }, '▶ Nghe lại'),
  );
}
