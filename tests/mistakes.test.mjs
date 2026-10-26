import test from 'node:test';
import assert from 'node:assert/strict';
import { applyAnswer, pickForReview, RESOLVE_AFTER } from '../js/mistakes.js';
import { normalize, defaults } from '../js/storage.js';

const Q = { id: 'g:wo-1', type: 'grammar' };

test('trả lời sai thì vào sổ, sai nữa thì đếm thêm và reset chuỗi đúng', () => {
  let book = applyAnswer({}, Q, false, 100);
  assert.deepEqual(book[Q.id], { type: 'grammar', wrong: 1, streak: 0, last: 100 });

  book = applyAnswer(book, Q, true, 200);
  assert.equal(book[Q.id].streak, 1);

  book = applyAnswer(book, Q, false, 300);
  assert.deepEqual(book[Q.id], { type: 'grammar', wrong: 2, streak: 0, last: 300 });
});

test(`đúng ${RESOLVE_AFTER} lần liên tiếp thì rời sổ`, () => {
  let book = applyAnswer({}, Q, false, 1);
  for (let i = 0; i < RESOLVE_AFTER; i += 1) book = applyAnswer(book, Q, true, 2 + i);
  assert.equal(Q.id in book, false);
});

test('trả lời đúng một câu chưa từng sai thì không thêm gì vào sổ', () => {
  assert.deepEqual(applyAnswer({}, Q, true), {});
});

test('applyAnswer không sửa sổ gốc', () => {
  const orig = applyAnswer({}, Q, false, 1);
  const snapshot = JSON.stringify(orig);
  applyAnswer(orig, Q, true, 2);
  applyAnswer(orig, Q, false, 3);
  assert.equal(JSON.stringify(orig), snapshot);
});

test('thứ tự ôn: sai nhiều nhất trước, bằng nhau thì sai lâu hơn trước', () => {
  const book = {
    a: { type: 'vocab', wrong: 1, streak: 0, last: 300 },
    b: { type: 'vocab', wrong: 3, streak: 0, last: 500 },
    c: { type: 'kanji', wrong: 1, streak: 0, last: 100 },
  };
  assert.deepEqual(pickForReview(book, 10), ['b', 'c', 'a']);
  assert.deepEqual(pickForReview(book, 2), ['b', 'c']);
  assert.deepEqual(pickForReview({}, 5), []);
});

test('sổ lỗi được lưu/nhập qua normalize và bỏ mục hỏng', () => {
  const state = defaults();
  state.mistakes = {
    'g:wo-1': { type: 'grammar', wrong: 2, streak: 1, last: 5 },
    'k:学校': { type: 'không-hợp-lệ', wrong: 1, streak: 0, last: 1 },
    'v:x': { type: 'vocab', wrong: 'nhiều', streak: 0, last: 1 },
  };
  const out = normalize(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(Object.keys(out.mistakes), ['g:wo-1']);
  assert.deepEqual(out.mistakes['g:wo-1'], { type: 'grammar', wrong: 2, streak: 1, last: 5 });
});

test('dữ liệu cũ chưa có sổ lỗi vẫn nhập được', () => {
  const old = defaults();
  delete old.mistakes;
  assert.deepEqual(normalize(old).mistakes, {});
});
