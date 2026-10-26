import test from 'node:test';
import assert from 'node:assert/strict';
import { pickWords, poolSize, scoreFlash, scoreTyping, isCorrect, lessonsLabel, POINTS } from '../js/words.js';
import { VOCAB } from '../data/lessons.js';

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test('pickWords: đúng phạm vi bài, đủ số từ, không trùng cách đọc, lặp lại được với cùng hạt giống', () => {
  const a = pickWords({ deck: VOCAB, lessons: [3], count: 10, rng: seeded(1) });
  assert.equal(a.length, 10);
  assert.ok(a.every(w => w.lesson === 3));
  assert.equal(new Set(a.map(w => w.kana)).size, 10);
  assert.deepEqual(a.map(w => w.id), pickWords({ deck: VOCAB, lessons: [3], count: 10, rng: seeded(1) }).map(w => w.id));
  assert.notDeepEqual(a.map(w => w.id), pickWords({ deck: VOCAB, lessons: [3], count: 10, rng: seeded(2) }).map(w => w.id));
});

test('pickWords: "all" lấy hết, ít từ hơn số yêu cầu thì lấy hết những gì có', () => {
  const all = pickWords({ deck: VOCAB, lessons: [20], count: 'all', rng: seeded(1) });
  assert.equal(all.length, poolSize(VOCAB, [20]));
  assert.equal(pickWords({ deck: VOCAB, lessons: [20], count: 500, rng: seeded(1) }).length, all.length);
  assert.deepEqual(pickWords({ deck: VOCAB, lessons: [0], count: 10, rng: seeded(1) }), []);
});

test('scoreFlash: đếm thẻ nhớ và phần trăm', () => {
  assert.deepEqual(scoreFlash([{ known: true }, { known: false }, { known: true }, { known: true }]), { total: 4, known: 3, unknown: 1, percent: 75 });
  assert.equal(scoreFlash([]).percent, 0);
});

test('scoreTyping: đúng ngay 1 điểm, đúng sau khi gõ lại nửa điểm, bỏ qua và xem đáp án 0 điểm', () => {
  const r = scoreTyping([{ outcome: 'first' }, { outcome: 'retry' }, { outcome: 'skipped' }, { outcome: 'revealed' }]);
  assert.equal(r.points, POINTS.first + POINTS.retry);
  assert.equal(r.percent, 38);
  assert.deepEqual([r.first, r.retry, r.skipped, r.revealed, r.total], [1, 1, 1, 1, 4]);
  assert.equal(scoreTyping([]).percent, 0);
  assert.equal(scoreTyping([{ outcome: 'first' }, { outcome: 'first' }]).percent, 100);
});

test('isCorrect: nhận romaji (kể cả ou/o), kana; sai thì không nhận', () => {
  const w = { word: 'がっこう', kana: 'がっこう' };
  assert.ok(isCorrect('gakkou', w));
  assert.ok(isCorrect('gakko', w), 'kéo dài nguyên âm được châm chước');
  assert.ok(isCorrect(' GAKKOU ', w));
  assert.ok(isCorrect('がっこう', w));
  assert.equal(isCorrect('gakkoo', { word: 'x', kana: 'ねこ' }), false);
  assert.equal(isCorrect('', w), false);
  assert.ok(isCorrect('konnichiwa', { word: 'こんにちは', kana: 'こんにちは', romaji: 'konnichiwa' }));
});

test('lessonsLabel: gộp dãy bài liền nhau cho gọn', () => {
  assert.equal(lessonsLabel([5]), 'Bài 5');
  assert.equal(lessonsLabel([1, 2]), 'Bài 1, 2');
  assert.equal(lessonsLabel([3, 1, 2, 5]), 'Bài 1–3, 5');
  assert.equal(lessonsLabel([1, 2, 3, 7, 8, 9, 12]), 'Bài 1–3, 7–9, 12');
  assert.equal(lessonsLabel(Array.from({ length: 25 }, (_, i) => i + 1)), 'Tất cả 25 bài');
  assert.equal(lessonsLabel([]), 'Chưa chọn bài');
});

test('pickWords: chọn nhiều bài lấy từ của tất cả các bài đó', () => {
  const words = pickWords({ deck: VOCAB, lessons: [2, 7], count: 'all', rng: seeded(1) });
  assert.ok(words.some(w => w.lesson === 2) && words.some(w => w.lesson === 7));
  assert.ok(words.every(w => [2, 7].includes(w.lesson)));
});

test('pickWords: tắt trộn thì giữ thứ tự trong sách (theo bài tăng dần), bật trộn thì đổi thứ tự', () => {
  const ordered = pickWords({ deck: VOCAB, lessons: [3, 1, 2], count: 'all', rng: seeded(1), shuffle: false });
  const lessons = ordered.map(w => w.lesson);
  assert.deepEqual(lessons, [...lessons].sort((a, b) => a - b), 'theo thứ tự bài');
  assert.deepEqual(ordered.map(w => w.id), pickWords({ deck: VOCAB, lessons: [3, 1, 2], count: 'all', rng: seeded(99), shuffle: false }).map(w => w.id), 'không phụ thuộc hạt giống');
  const mixed = pickWords({ deck: VOCAB, lessons: [3, 1, 2], count: 'all', rng: seeded(1) });
  assert.equal(mixed.length, ordered.length);
  assert.notDeepEqual(mixed.map(w => w.id), ordered.map(w => w.id));
  assert.deepEqual(pickWords({ deck: VOCAB, lessons: [1], count: 5, rng: seeded(1), shuffle: false }).map(w => w.id), ordered.filter(w => w.lesson === 1).slice(0, 5).map(w => w.id), 'lấy từ đầu bài');
});
