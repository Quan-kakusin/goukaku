import { speak } from './tts.js';
import { annotate } from './furigana.js';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Icon SVG nét mảnh, màu theo chữ (currentColor) để hợp giao diện đơn sắc
export function icon(...paths) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  for (const d of paths) {
    const p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', d);
    svg.append(p);
  }
  return svg;
}

export const ICON = {
  speaker: ['M4 9v6h4l5 4V5L8 9z', 'M16.5 9a4 4 0 0 1 0 6'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  back: ['M15 5l-7 7 7 7'],
  chevron: ['M9 5l7 7-7 7'],
};

// Vòng tiến độ (fraction 0..1) có chữ ở giữa. Giá trị đặt ngay (luôn đúng); hiệu ứng "đầy dần" do CSS keyframes lo.
export function ring(fraction, { label, sub, description }) {
  const pct = Math.round(Math.min(1, Math.max(0, fraction)) * 100);
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 36 36');
  svg.setAttribute('aria-hidden', 'true');
  const circle = cls => {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('cx', '18');
    c.setAttribute('cy', '18');
    c.setAttribute('r', '16');
    c.setAttribute('pathLength', '100');
    c.setAttribute('class', cls);
    return c;
  };
  const value = circle('ring-value');
  value.style.strokeDasharray = `${pct} 100`;
  if (pct === 0) value.style.display = 'none'; // nét dài 0 với đầu bo tròn vẫn hiện thành một chấm
  svg.append(circle('ring-track'), value);
  return h(
    'div',
    { class: 'ring', role: 'img', 'aria-label': description ?? `${label} ${sub}` },
    svg,
    h('div', { class: 'ring-label', 'aria-hidden': 'true' }, h('strong', null, label), h('small', null, sub)),
  );
}

// Tạo phần tử DOM. Không dùng innerHTML nên nội dung người dùng nhập vào luôn an toàn.
export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null) continue;
    if (k === 'class') el.className = v || '';
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k in el && !k.includes('-')) el[k] = v;
    else el.setAttribute(k, v);
  }
  el.append(...kids.flat(Infinity).filter(c => c != null && c !== false));
  return el;
}

// Một ảnh meme (lấy từ praise/miss trong insights.js). Dấu ✓/✗ do CSS vẽ trước ảnh theo .result.ok / .result.ng
export const meme = ({ src, alt }) => h('span', { class: 'meme' }, h('img', { class: 'meme-img', src, alt }));

// Như el.replaceChildren(...kids) nhưng bỏ qua false/null/undefined: DOM thật sẽ in chữ "false"/"undefined" ra màn hình
// nên mọi chỗ viết `điều_kiện && h(...)` trong danh sách con phải đi qua hàm này.
export function fill(el, ...kids) {
  el.replaceChildren(...kids.flat(Infinity).filter(c => c != null && c !== false));
}

// Thay nội dung của root, bỏ qua false/null/undefined (replaceChildren của DOM sẽ in chữ "false" ra màn hình)
export function show(root, ...kids) {
  root.replaceChildren(...kids.flat(Infinity).filter(c => c != null && c !== false));
}

export function toast(msg) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}

const KANJI = /[㐀-鿿]/;

// Chữ Hán kèm furigana phía trên; từ toàn kana thì hiện nguyên.
export function furigana(word, kana) {
  return KANJI.test(word) && word !== kana ? h('ruby', null, word, h('rt', null, kana)) : h('span', null, word);
}

export function speakButton(text) {
  return h(
    'button',
    {
      class: 'icon-btn',
      type: 'button',
      title: 'Nghe phát âm',
      'aria-label': 'Nghe phát âm',
      onclick: e => {
        // Nút có thể nằm trong <summary> hay thẻ bấm được, nên chặn hành vi mặc định của chúng
        e.preventDefault();
        e.stopPropagation();
        if (!speak(text)) toast('Máy chưa có giọng đọc tiếng Nhật. Hãy cài gói ngôn ngữ Nhật trong Windows.');
      },
    },
    icon(...ICON.speaker),
  );
}

export function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Ô nhập kèm nhãn; phần tử thêm (vd thông báo lỗi) đặt ngay dưới ô nhập
export function field(label, input, ...extra) {
  return h('label', { class: 'field' }, h('span', null, label), input, ...extra);
}

// Hàng tab của từng mục lớn trên thanh điều hướng (như tab "Dành cho bạn / Đang theo dõi" của Threads)
//   Từ vựng: thẻ flash, gõ romaji, tra từ, bảng số đếm · Chữ viết: kana, kanji · Luyện thi: thi thử N5, sổ lỗi sai
function tabRow(label, items, active) {
  return h(
    'nav',
    { class: 'tabs', 'aria-label': label },
    ...items.map(([route, text]) => h('a', { href: `#/${route}`, 'aria-current': route === active ? 'page' : undefined }, text)),
  );
}

export const wordsTabs = active =>
  tabRow('Các phần của mục Từ vựng', [['flash', 'Thẻ flash'], ['typing', 'Gõ romaji'], ['vocab', 'Tra từ'], ['counting', 'Số đếm']], active);
export const writeTabs = active =>
  tabRow('Các phần của mục Chữ viết', [['kana', 'Kana'], ['kanji', 'Kanji']], active);
export const testTabs = active =>
  tabRow('Các phần của mục Luyện thi', [['exams', 'Thi thử N5'], ['notebook', 'Sổ lỗi sai']], active);

// Văn bản tiếng Nhật kèm furigana (chữ hiragana nhỏ phía trên chữ Hán) theo từ điển của app; on=false thì trả về chữ thường.
// 【...】 là phần gạch chân trong đề. Chữ Hán chưa biết cách đọc để nguyên.
export function jaText(text, { furi = true } = {}) {
  return text.split(/(【[^】]*】)/).flatMap(seg => {
    const underline = seg.startsWith('【');
    const body = underline ? seg.slice(1, -1) : seg;
    const nodes = (furi ? annotate(body) : [{ text: body }]).map(p => (p.ruby ? h('ruby', null, p.text, h('rp', null, '('), h('rt', null, p.ruby), h('rp', null, ')')) : p.text));
    return underline ? [h('u', null, ...nodes)] : nodes;
  });
}

// Nút bật/tắt: aria-pressed là nguồn sự thật cho cả trình đọc màn hình lẫn CSS
export function setPressed(btn, on) {
  btn.setAttribute('aria-pressed', String(on));
}
