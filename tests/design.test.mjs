// Kiểm tra bộ thiết kế: token khớp spec, tương phản đạt WCAG AA, CSS không dùng giá trị thô, đủ trạng thái.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = f => readFileSync(new URL(`../css/${f}`, import.meta.url), 'utf8');
const tokensCss = read('tokens.css');
const styleCss = read('style.css');

function vars(block) {
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].replace(/\/\*.*?\*\//g, '').trim()]));
}
function blockOf(css, selector) {
  const start = css.indexOf(`${selector} {`);
  assert.ok(start >= 0, `không thấy khối ${selector}`);
  return css.slice(start, css.indexOf('\n}', start));
}

const tokens = vars(blockOf(tokensCss, ':root'));

// ---- Tương phản WCAG ----
const lin = c => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = 4.5; // WCAG 1.4.3
const UI = 3; // WCAG 1.4.11
const SURFACES = ['surface-base', 'surface-raised', 'surface-inset'];
const PAIRS = [
  ...SURFACES.flatMap(s => [
    ['text-primary', s, TEXT],
    ['text-secondary', s, TEXT],
    ['text-tertiary', s, TEXT],
    ['accent', s, TEXT],
    ['brand', s, TEXT], // màu nhấn thương hiệu, cũng dùng làm chữ (số chuỗi ngày...)
    ['success', s, TEXT],
    ['danger', s, TEXT],
    ['warning', s, TEXT],
    ['border-strong', s, UI],
    ['focus-ring', s, UI],
  ]),
  ['text-primary', 'surface-hover', TEXT],
  ['text-tertiary', 'surface-hover', TEXT],
  ['on-action', 'action', TEXT], // nút chính
  ['on-brand', 'brand', TEXT], // dấu tích trên ngày đã học, số bước hướng dẫn
  ['on-accent', 'accent', TEXT], // đáp án đang chọn, câu đã trả lời trong đề thi
  ['on-danger', 'danger', TEXT], // huy hiệu số lỗi
  ['text-primary', 'surface-inset', TEXT],
];

test('tương phản đạt AA', () => {
  const failures = [];
  for (const [fg, bg, min] of PAIRS) {
    const ratio = contrast(tokens[`color-${fg}`], tokens[`color-${bg}`]);
    if (ratio < min) failures.push(`${fg} trên ${bg}: ${ratio.toFixed(2)} < ${min}`);
  }
  assert.deepEqual(failures, []);
});

// ---- Token khớp spec ----
test('token nền tảng (cỡ chữ, khoảng cách, bo góc) khớp spec', () => {
  const expected = {
    'font-size-xs': '12px', 'font-size-sm': '15px', 'font-size-md': '20px',
    'font-weight-base': '400', 'line-height-base': '21px',
    'space-1': '4px', 'space-2': '8px', 'space-3': '12px', 'space-4': '16px', 'space-5': '36px',
    'radius-xs': '8px', 'radius-sm': '10px', 'radius-md': '16px', 'radius-lg': '18px',
    'radius-xl': '50px', 'radius-2xl': '1000px', 'radius-step7': '9999px',
    'shadow-1': 'rgba(0, 0, 0, 0.08) 0px 6px 8px 0px', 'shadow-2': 'rgba(0, 0, 0, 0.04) 0px 0px 12px 0px',
    'motion-duration-instant': '100ms', 'motion-duration-fast': '200ms',
  };
  for (const [k, v] of Object.entries(expected)) assert.equal(tokens[k], v, `--${k}`);
  assert.match(tokens['font-family-primary'], /^system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial/);
});

test('chỉ có một giao diện sáng, không còn chế độ tối', () => {
  assert.match(tokensCss, /color-scheme: light/);
  assert.doesNotMatch(tokensCss, /data-theme|prefers-color-scheme/);
});

// ---- style.css chỉ dùng token ----
const declarations = styleCss
  .split('\n')
  .map((line, i) => ({ line: i + 1, m: line.match(/^\s*([a-z-]+):\s*(.+?);\s*$/) }))
  .filter(d => d.m)
  .map(d => ({ line: d.line, prop: d.m[1], value: d.m[2] }));

test('style.css không chứa màu thô (hex, rgb, hsl)', () => {
  const bad = declarations.filter(d => /#[0-9a-f]{3,8}\b|\b(rgb|hsl)a?\(/i.test(d.value));
  assert.deepEqual(bad.map(d => `dòng ${d.line}: ${d.prop}: ${d.value}`), []);
});

test('style.css không dùng px/rem/em thô cho cỡ chữ, khoảng cách, bo góc', () => {
  const RAW = /(^|[\s(,])-?\d*\.?\d+(px|rem|em)\b/;
  const props = /^(font-size|padding(-[a-z]+)?|margin(-[a-z]+)?|gap|row-gap|column-gap|border-radius)$/;
  const bad = declarations.filter(d => props.test(d.prop) && RAW.test(d.value.replace(/var\([^)]*\)/g, '')));
  assert.deepEqual(bad.map(d => `dòng ${d.line}: ${d.prop}: ${d.value}`), []);
});

test('mọi var(--token) dùng trong style.css đều được định nghĩa trong tokens.css', () => {
  const defined = new Set(Object.keys(tokens));
  const used = new Set([...styleCss.matchAll(/var\(--([\w-]+)/g)].map(m => m[1]));
  assert.deepEqual([...used].filter(u => !defined.has(u)), []);
});

// ---- Trạng thái bắt buộc ----
test('điều khiển có đủ trạng thái: hover, focus-visible, active, disabled, loading, error', () => {
  const required = [
    '.btn:hover', '.btn:active', '.btn:disabled', '.btn[aria-busy="true"]', '.btn[data-state="error"]',
    ':focus-visible', 'input[aria-invalid="true"]', 'input:disabled', 'input:hover',
    '.choice:hover', '.choice:active', '.choice[aria-disabled="true"]', '.choice.correct', '.choice.incorrect',
    '.seg:hover', '.seg:active', '.seg[aria-pressed="true"]', '.qn:hover', '.qn:active', '.pick:hover', '.pick:active', '.history-row:hover', '.history-row:active',
    '.kanji-cell[aria-pressed="true"]', '.icon-btn:hover', '.icon-btn:active',
    '.rail nav a[aria-current="page"]', '.rail nav a:hover', '.rail nav a:active',
    '.tabs a[aria-current="page"]', '.tabs a:hover', '.tabs a:active',
    '.lesson-row:hover', '.lesson-row:active', '.back-link:hover', 'textarea:hover', 'textarea[aria-invalid="true"]',
  ];
  const missing = required.filter(sel => !styleCss.includes(sel));
  assert.deepEqual(missing, []);
});

test('gợi ý phím tắt (kbd) chỉ hiện trên thiết bị có chuột/bàn phím', () => {
  const base = styleCss.match(/\nkbd \{[^}]*\}/)?.[0] ?? '';
  assert.match(base, /display: none/, 'kbd phải ẩn mặc định để màn hình cảm ứng không thấy');
  assert.match(styleCss, /@media \(hover: hover\) and \(pointer: fine\) \{\s*kbd \{\s*display: inline-block/);
});

test('vòng tiến độ và hiệu ứng tôn trọng giảm chuyển động (dùng token thời lượng)', () => {
  assert.match(styleCss, /\.ring-value \{[^}]*animation: ring-fill var\(--motion-duration-slow\)/);
  assert.match(tokensCss, /--motion-duration-slow: 0ms/, 'phải về 0 khi prefers-reduced-motion');
  assert.doesNotMatch(styleCss, /animation: (?!spin)[a-z]+ \d+m?s/, 'animation phải dùng token thời lượng (trừ spinner vòng quay vô tận)');
});

test('tôn trọng prefers-reduced-motion và vùng bấm tối thiểu', () => {
  assert.match(tokensCss, /prefers-reduced-motion: reduce/);
  assert.match(styleCss, /prefers-reduced-motion: reduce/);
  assert.ok(parseInt(tokens['size-target'], 10) >= 44);
  assert.ok(parseInt(tokens['size-nav'], 10) >= 44, 'ô icon trên thanh điều hướng phải đủ 44px');
  assert.ok(parseInt(tokens['size-bar'], 10) >= 44, 'thanh tab dưới phải đủ 44px');
  for (const sel of ['.btn {', '.icon-btn {', '.seg {', 'input[type="text"],']) {
    const i = styleCss.indexOf(sel);
    assert.ok(i >= 0, sel);
    assert.match(styleCss.slice(i, styleCss.indexOf('}', i)), /min-height: var\(--size-target\)/, `${sel} thiếu min-height target`);
  }
});
