// Thành phần giao diện dùng chung giữa trang chi tiết bài, trang chủ và trang Tra từ.

import { h, furigana, speakButton } from '../ui.js';
import { getState, save } from '../storage.js';
import { romajiOf } from '../romaji.js';
import { lessonTitle } from '../deck.js';
import { LESSON_COUNT } from '../../data/lessons.js';

// Một hàng từ vựng bấm để xem ví dụ. Từ do người dùng thêm (id c:...) có nút xóa.
export function vocabRow(w, { onChange, showLesson = false } = {}) {
  const isCustom = w.id.startsWith('c:');
  return h(
    'details',
    { class: 'vrow' },
    h('summary', null, speakButton(w.kana), h('span', { class: 'vword' }, furigana(w.word, w.kana)), h('span', { class: 'vmean' }, w.vi), showLesson && h('span', { class: 'chip' }, lessonTitle(w.lesson))),
    h(
      'div',
      { class: 'vdetail' },
      h('div', { class: 'romaji' }, romajiOf(w)),
      w.ex && h('div', { class: 'ex-jp' }, w.ex, speakButton(w.ex)),
      w.exVi && h('div', { class: 'ex-vi' }, w.exVi),
      isCustom &&
        h(
          'button',
          {
            class: 'btn danger small',
            type: 'button',
            onclick: () => {
              if (!confirm(`Xóa từ "${w.word}"?`)) return;
              const s = getState();
              s.custom = s.custom.filter(c => c.id !== w.id);
              save();
              onChange?.();
            },
          },
          'Xóa từ này',
        ),
    ),
  );
}

// Một mục ngữ pháp theo mẫu tài liệu: Công thức, giải thích, Ví dụ, Lưu ý. number dạng "12.3".
// Một mục ngữ pháp, trình bày theo thứ tự học: công thức → ý chính → dùng khi nào → cách tạo câu → bóc tách câu → ví dụ → lỗi hay gặp → so sánh → mẹo nhớ → lưu ý của sách.
// Các trường mới (when, steps, table, breakdown, mistakes, compare, tip) là tùy chọn: thiếu thì bỏ qua khối đó.
const block = (title, ...kids) => h('section', { class: 'gblock' }, h('h3', null, title), ...kids);

function stepsList(steps) {
  return h('ol', { class: 'steps-list' }, ...steps.map(t => h('li', null, t)));
}

function grammarTable(t) {
  return h(
    'div',
    { class: 'gtable-wrap' },
    t.title && h('p', { class: 'gtable-title' }, t.title),
    h('div', { class: 'gtable-scroll' }, h('table', { class: 'gtable' }, h('thead', null, h('tr', null, ...t.head.map(c => h('th', { scope: 'col', lang: 'ja' }, c)))), h('tbody', null, ...t.rows.map(r => h('tr', null, ...r.map((c, i) => (i === 0 ? h('th', { scope: 'row', lang: 'ja' }, c) : h('td', { lang: 'ja' }, c)))))))),
  );
}

// Câu mẫu tách thành từng phần, mỗi phần kèm vai trò, để thấy câu được ghép từ gì
function breakdownBox(b) {
  return h(
    'div',
    { class: 'breakdown' },
    h('p', { class: 'bd-sentence', lang: 'ja' }, b.jp, speakButton(b.jp)),
    h('ul', { class: 'bd-parts' }, ...b.parts.map(([jp, role]) => h('li', null, h('span', { class: 'bd-jp', lang: 'ja' }, jp), h('span', { class: 'bd-role' }, role)))),
    h('p', { class: 'ex-vi' }, b.vi),
  );
}

function mistakeList(items) {
  return h(
    'ul',
    { class: 'mistakes' },
    ...items.map(m =>
      h(
        'li',
        null,
        h('div', { class: 'mk-wrong', lang: 'ja' }, h('span', { class: 'mk-mark', 'aria-label': 'Sai' }, '✗'), h('span', { class: 'mk-text' }, m.wrong)),
        h('div', { class: 'mk-right', lang: 'ja' }, h('span', { class: 'mk-mark', 'aria-label': 'Đúng' }, '✓'), h('span', { class: 'mk-text' }, m.right)),
        h('p', { class: 'mk-why' }, m.why),
      ),
    ),
  );
}

export function patternCard(p, number, { onPractice, open = false } = {}) {
  return h(
    'details',
    { class: 'pattern', open },
    h('summary', null, h('span', { class: 'section-no' }, number), h('span', { class: 'pat-title', lang: 'ja' }, p.title), h('span', { class: 'pat-meaning' }, p.meaning)),
    h(
      'div',
      { class: 'pat-body' },
      formulaBox(p.formula),
      ...p.explain.map((t, i) => h('p', { class: i === 0 ? 'pat-lead' : undefined }, t)),
      p.when?.length > 0 && block('Dùng khi nào', h('ul', { class: 'when-list' }, ...p.when.map(t => h('li', null, t)))),
      (p.steps?.length > 0 || p.table) && block('Cách tạo câu', p.steps?.length > 0 && stepsList(p.steps), p.table && grammarTable(p.table)),
      p.breakdown && block('Bóc tách một câu ví dụ', breakdownBox(p.breakdown)),
      block('Ví dụ', examplesList(p.examples)),
      p.mistakes?.length > 0 && block('Lỗi hay gặp', mistakeList(p.mistakes)),
      p.compare?.length > 0 && block('Dễ nhầm với', h('ul', { class: 'compare-list' }, ...p.compare.map(c => h('li', null, h('strong', { lang: 'ja' }, c.with), h('span', null, c.diff))))),
      p.tip && h('p', { class: 'tip-box' }, h('strong', null, 'Mẹo nhớ: '), p.tip),
      p.notes.length > 0 && noteBox(p.notes),
      onPractice && h('button', { class: 'btn primary small', type: 'button', onclick: onPractice }, `Làm bài tập (${p.quiz.length} câu)`),
    ),
  );
}

export const formulaBox = formula => h('div', { class: 'formula' }, h('small', null, 'CÔNG THỨC'), h('div', { lang: 'ja' }, formula));

export const examplesList = examples =>
  h('ul', { class: 'examples' }, ...examples.map(e => h('li', null, h('div', { class: 'ex-jp', lang: 'ja' }, e.jp, speakButton(e.jp)), h('div', { class: 'ex-vi' }, e.vi))));

export const noteBox = notes => h('div', { class: 'note-box' }, h('strong', null, 'Lưu ý trong sách'), h('ul', null, ...notes.map(t => h('li', null, t))));

// Thanh chọn bài 1–25 cuộn ngang. Có hrefFor thì mỗi bài là liên kết, không thì là nút gọi onPick(n).
// Bài đang chọn được làm nổi bật.
export function lessonPicker({ selected, hrefFor, onPick, label = 'Chọn bài', compact = false }) {
  const asLink = Boolean(hrefFor);
  const items = Array.from({ length: LESSON_COUNT }, (_, i) => {
    const n = i + 1;
    const props = {
      class: 'pick',
      'aria-label': `Bài ${n}`,
    };
    return asLink
      ? h('a', { ...props, href: hrefFor(n), 'aria-current': n === selected ? 'page' : undefined }, String(n))
      : h('button', { ...props, type: 'button', 'aria-pressed': String(n === selected), onclick: () => onPick(n) }, String(n));
  });
  const box = h(asLink ? 'nav' : 'div', { class: `picker${compact ? ' scroll' : ''}`, 'aria-label': label, role: asLink ? undefined : 'group' }, ...items);
  // Cuộn để bài đang chọn nằm giữa thanh (sau khi thanh đã được gắn vào trang)
  requestAnimationFrame(() => {
    const el = items[selected - 1];
    if (el && box.isConnected) box.scrollLeft = Math.max(0, el.offsetLeft - (box.clientWidth - el.clientWidth) / 2);
  });
  return box;
}
