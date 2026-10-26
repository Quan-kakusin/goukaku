import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { encouragement, praise, miss, PRAISE, MISS } from '../js/insights.js';

test('lời nhận xét theo điểm có 4 mức và lời khen xoay vòng', () => {
  assert.match(encouragement(1), /Xuất sắc/);
  assert.match(encouragement(0.7), /Đạt/);
  assert.match(encouragement(0.55), /Gần đạt/);
  assert.match(encouragement(0.2), /Đừng nản/);
  assert.notEqual(praise(0), praise(1));
  assert.equal(praise(0), praise(PRAISE.length));
  assert.notEqual(miss(0), miss(1));
  assert.equal(miss(0), miss(MISS.length));
  assert.equal(PRAISE.length + MISS.length, 10);
  for (const m of [...PRAISE, ...MISS]) {
    assert.ok(m.alt, 'mỗi meme cần alt');
    assert.ok(existsSync(new URL(`../public/${m.src}`, import.meta.url)), `thiếu file ${m.src}`);
  }
});
