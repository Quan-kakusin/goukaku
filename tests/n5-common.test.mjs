// Bộ "từ hay gặp trong đề N5" (490 từ) cho Gõ romaji: chọn từ danh sách N5 trên mạng và đề thật, không lẫn từ ngoài bộ từ vựng 25 bài.
import test from 'node:test';
import assert from 'node:assert/strict';
import { VOCAB, LESSON_COUNT } from '../data/lessons.js';
import { N5_COMMON } from '../data/n5-common.js';
import { isMainWord } from '../data/vocab-skip.js';
import { pickWords, poolSize, WORD_SCOPES } from '../js/words.js';
import de02 from '../data/jlpt/de-02.js';

const lessons = Array.from({ length: LESSON_COUNT }, (_, i) => i + 1);
const kana = new Set(VOCAB.map(w => w.kana));

test('mọi từ trong bộ đều có trong từ vựng 25 bài và là từ vựng chính; quy mô khoảng 490 từ', () => {
  for (const k of N5_COMMON) {
    assert.ok(kana.has(k), `${k} không có trong từ vựng 25 bài`);
    assert.ok(isMainWord(VOCAB.find(w => w.kana === k)), `${k} không phải từ vựng chính`);
  }
  assert.ok(N5_COMMON.size >= 450 && N5_COMMON.size <= 520, `có ${N5_COMMON.size} từ`);
});

test('ba mức chọn: hay gặp (ít nhất) ⊂ từ vựng chính ⊂ tất cả', () => {
  assert.deepEqual(WORD_SCOPES, ['common', 'main', 'all']);
  const size = s => pickWords({ deck: VOCAB, lessons, count: 'all', rng: () => 0, scope: s });
  const common = size('common');
  const main = size('main');
  const all = size('all');
  assert.equal(poolSize(VOCAB, lessons, 'common'), common.length);
  assert.ok(common.length < main.length && main.length < all.length, `${common.length} < ${main.length} < ${all.length}`);
  const mainSet = new Set(main.map(w => w.kana));
  assert.ok(common.every(w => mainSet.has(w.kana)));
  assert.equal(common.length, N5_COMMON.size, 'mỗi từ trong bộ ra đúng một mục (đã bỏ trùng cách đọc)');
});

test('mỗi bài vẫn còn ít nhất 3 từ ở mức "hay gặp trong đề N5"', () => {
  for (const n of lessons) assert.ok(poolSize(VOCAB, [n], 'common') >= 3, `bài ${n}`);
});

test('từ chính của bài đầu như từ để hỏi, đại từ chỉ định, động từ thường ngày được giữ; câu chào và địa danh bị loại', () => {
  for (const k of ['わたし', 'これ', 'どこ', 'たべます', 'のみます', 'いきます', 'ほん', 'えき', 'テレビ', 'おいしい']) assert.ok(N5_COMMON.has(k), `${k} lẽ ra được giữ`);
  for (const k of ['どうぞよろしくおねがいします', 'ふじさん', 'かぐやひめ', 'ジャカルタ', 'アインシュタイン']) assert.ok(!N5_COMMON.has(k), `${k} lẽ ra bị loại`);
});

test('các từ xuất hiện trong đề thật (đề số 2) mà hai danh sách N5 thiếu được giữ lại', () => {
  for (const k of ['もう', 'とても', 'そして', 'あとで', 'いっしょに', 'どんな']) assert.ok(N5_COMMON.has(k), k);
  assert.ok(de02.parts.length > 0);
});

test('từ riêng của người dùng luôn được giữ ở mọi mức', () => {
  const custom = { id: 'c:1', word: 'ねこ', kana: 'ねこまんま', vi: 'cơm mèo', lesson: 0 };
  for (const s of WORD_SCOPES) assert.equal(pickWords({ deck: [custom], lessons: [0], count: 'all', rng: () => 0, scope: s }).length, 1, s);
});
