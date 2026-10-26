// Lỗi hay gặp: viết `cond && h(...)` trong replaceChildren() của DOM thì khi cond sai, chữ "false" (hoặc "undefined") bị in ra màn hình.
// Chỗ nào có điều kiện kiểu đó phải dùng fill() hoặc show() trong js/ui.js, hoặc .filter(Boolean).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const jsDir = fileURLToPath(new URL('../js/', import.meta.url));
const files = [...readdirSync(jsDir).filter(f => f.endsWith('.js')).map(f => join(jsDir, f)), ...readdirSync(join(jsDir, 'views')).map(f => join(jsDir, 'views', f))];

// Lấy phần trong ngoặc của mỗi lời gọi `.replaceChildren(`
function calls(src) {
  const out = [];
  let from = 0;
  for (;;) {
    const i = src.indexOf('.replaceChildren(', from);
    if (i < 0) return out;
    let depth = 0;
    let j = i + '.replaceChildren'.length;
    for (; j < src.length; j += 1) {
      if (src[j] === '(') depth += 1;
      else if (src[j] === ')' && --depth === 0) break;
    }
    out.push({ at: src.slice(0, i).split('\n').length, text: src.slice(i, j + 1) });
    from = j;
  }
}

test('replaceChildren không nhận phần tử con kiểu `điều_kiện && h(...)` (sẽ in "false" ra màn hình)', () => {
  const bad = [];
  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    for (const c of calls(src)) {
      if (/\.filter\(Boolean\)/.test(c.text)) continue;
      if (/(^|\n)\s*[\w.!?()[\] ]+&&\s*(h|meme|speakButton)\(/.test(c.text)) bad.push(`${file.replace(jsDir, 'js/')}:${c.at}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('bộ kiểm tra tự nó bắt được kiểu lỗi cũ (mẫu của flash.js và hộp xác nhận nộp bài)', () => {
  const sample = `card.replaceChildren(\n  h('div', null, 'a'),\n  flipped && h('div', null, 'b'),\n);`;
  const found = calls(sample);
  assert.equal(found.length, 1);
  assert.match(found[0].text, /(^|\n)\s*[\w.!?()[\] ]+&&\s*(h|meme|speakButton)\(/);
  const sample2 = `x.replaceChildren(\n  next && h('p', null, 'b'),\n);`;
  assert.match(calls(sample2)[0].text, /(^|\n)\s*[\w.!?()[\] ]+&&\s*(h|meme|speakButton)\(/);
});
