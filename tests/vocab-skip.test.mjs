// Gõ romaji "chỉ từ vựng chính": bỏ câu dài, trợ từ, từ cảm thán và hậu tố đếm; giữ động từ, danh từ, tính từ, từ để hỏi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { VOCAB, LESSON_COUNT } from '../data/lessons.js';
import { isMainWord, isSentence, FUNCTION_WORDS, SUFFIX_WORDS } from '../data/vocab-skip.js';
import { pickWords, poolSize } from '../js/words.js';

const lessons = Array.from({ length: LESSON_COUNT }, (_, i) => i + 1);
const kanaOf = list => new Set(list.map(w => w.kana));

test('bỏ các câu và cụm câu dài, trợ từ, từ cảm thán, hậu tố đếm', () => {
  for (const k of ['どうぞよろしくおねがいします', 'それはおもしろいですね', 'しんごうをみぎへまがってください', 'わかりました', 'でものみませんか', 'いってらっしゃい']) assert.ok(isSentence(k), k);
  for (const k of ['が', 'から', 'まで', 'と', 'だけ', 'はい', 'えっ', 'さん', 'じん', 'がつ', 'にん']) assert.ok(FUNCTION_WORDS.has(k) || SUFFIX_WORDS.has(k), k);
  const main = kanaOf(pickWords({ deck: VOCAB, lessons, count: 'all', rng: () => 0, scope: 'main' }));
  for (const k of ['どうぞよろしくおねがいします', 'こちらはさんです', 'が', 'から', 'さん', 'ふん', 'はい']) assert.ok(!main.has(k), `${k} lẽ ra bị bỏ`);
});

test('giữ từ vựng chính: động từ (kể cả します dài), danh từ, tính từ, trạng từ, từ để hỏi, từ mượn', () => {
  const main = kanaOf(pickWords({ deck: VOCAB, lessons, count: 'all', rng: () => 0, scope: 'main' }));
  for (const k of ['たべます', 'べんきょうします', 'しゅっちょうします', 'ほん', 'いぬ', 'ねこ', 'おいしい', 'しずか', 'もう', 'まだ', 'なに', 'どこ', 'いつ', 'これ', 'ここ', 'エレベーター', 'コーヒー', 'けんきゅうしゃ']) assert.ok(main.has(k), `${k} lẽ ra được giữ`);
});

test('số từ: bỏ khoảng 110 mục, vẫn còn trên 850 từ; không bỏ thì giữ nguyên như cũ', () => {
  const all = pickWords({ deck: VOCAB, lessons, count: 'all', rng: () => 0 });
  const main = pickWords({ deck: VOCAB, lessons, count: 'all', rng: () => 0, scope: 'main' });
  assert.equal(poolSize(VOCAB, lessons), all.length);
  assert.equal(poolSize(VOCAB, lessons, true), main.length);
  const removed = all.length - main.length;
  assert.ok(removed >= 100 && removed <= 130, `bỏ ${removed} mục`);
  assert.ok(main.length > 850);
  assert.ok(main.every(isMainWord));
});

test('mỗi bài vẫn còn từ để luyện sau khi lọc', () => {
  for (const n of lessons) assert.ok(poolSize(VOCAB, [n], true) >= 5, `bài ${n}`);
});

test('từ riêng của người dùng (chưa xếp bài) luôn được giữ', () => {
  assert.ok(isMainWord({ lesson: 0, kana: 'から' }));
  assert.ok(!isMainWord({ lesson: 4, kana: 'から' }));
});
