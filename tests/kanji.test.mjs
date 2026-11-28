import test from 'node:test';
import assert from 'node:assert/strict';
import { KANJI } from '../data/kanji-n5.js';
import { KANJI_NOTES, CONFUSABLE } from '../data/kanji-notes.js';
import { kanjiHvQuestion, resolveQuestion, confusablesOf, KINDS, KANJI_WORDS } from '../js/questions.js';
import { kanjiQuestion, kanjiPickQuestion } from '../js/questions.js';
import { normalize, defaults } from '../js/storage.js';
import { kanjiSet, kataSet, thiSet, clampCount } from '../js/quiz-set.js';
import { KANJI_THI } from '../data/kanji-thi.js';
import { choiceNote } from '../js/questions.js';

test('mẹo nhớ: đủ 80 chữ, mỗi chữ có mẹo, nhóm dễ nhầm chỉ gồm chữ N5', () => {
  const chars = KANJI.map(k => k.char);
  assert.deepEqual(chars.filter(c => !KANJI_NOTES[c]?.[1]), []);
  assert.deepEqual(Object.keys(KANJI_NOTES).filter(c => !chars.includes(c)), []);
  for (const g of CONFUSABLE) {
    assert.ok(g.length >= 2 && g.every(c => chars.includes(c)), g.join(''));
    assert.equal(new Set(g).size, g.length);
  }
});

test('Hán Việt → chữ: 80 câu hợp lệ, đáp án nhiễu ưu tiên chữ dễ nhầm, dựng lại được từ id', () => {
  const prompts = new Set();
  for (const k of KANJI) {
    const q = kanjiHvQuestion(k);
    assert.equal(q.choices.length, 4);
    assert.equal(new Set(q.choices).size, 4, k.char);
    assert.ok(q.choices.includes(k.char) && q.answer === k.char);
    assert.equal(q.plain, true);
    prompts.add(q.prompt);
    const mates = confusablesOf(k.char);
    const take = Math.min(3, mates.length);
    assert.ok(mates.slice(0, take).every(m => q.choices.includes(m) || mates.length > 3), `${k.char}: thiếu chữ dễ nhầm`);
    assert.equal(resolveQuestion(q.id).answer, k.char);
  }
  assert.equal(prompts.size, KANJI.length, 'mỗi đề phải chỉ có một đáp án (Hán Việt + nghĩa không trùng)');
  assert.ok(KINDS.kanjihv);
});


test('clampCount: số nguyên từ 1 tới tổng, giá trị rác lấy mặc định', () => {
  assert.equal(clampCount(500, 80), 80);
  assert.equal(clampCount(0, 80), 1);
  assert.equal(clampCount('25', 80), 25);
  assert.equal(clampCount(7.9, 80), 7);
  assert.equal(clampCount('abc', 80, 20), 20);
  assert.equal(clampCount('', 59, 20), 20);
});

test('kanjiSet: đủ số câu theo yêu cầu, không trùng câu, mỗi chữ một từ, hai chiều đều có, 4 đáp án', () => {
  for (const n of [1, 10, 37, 80, 999]) {
    const qs = kanjiSet(n);
    assert.equal(qs.length, Math.min(n, 80));
    assert.equal(new Set(qs.map(q => q.id)).size, qs.length, 'trùng câu');
  }
  const kinds = new Set();
  for (let i = 0; i < 20; i += 1) {
    const qs = kanjiSet(80);
    assert.equal(qs.length, 80, 'đủ 80 chữ, mỗi chữ một câu khác nhau');
    for (const q of qs) {
      kinds.add(q.kind);
      assert.equal(q.choices.length, 4);
      assert.equal(new Set(q.choices).size, 4, q.id);
      assert.ok(q.choices.includes(q.answer));
      assert.equal(resolveQuestion(q.id).answer, q.answer);
    }
    // cả 80 chữ đều xuất hiện trong từ được hỏi
    const text = qs.map(q => q.id.slice(2)).join('');
    for (const k of KANJI) assert.ok(text.includes(k.char), 'thiếu ' + k.char);
  }
  assert.deepEqual([...kinds].sort(), ['kanji', 'kanjipick']);
});

test('kataSet: đủ số câu, không trùng, hai chiều trộn lẫn', () => {
  for (const n of [1, 20, 59, 200]) {
    const qs = kataSet(n);
    assert.equal(qs.length, Math.min(n, 59));
    assert.equal(new Set(qs.map(q => q.id)).size, qs.length);
  }
  const kinds = new Set();
  for (let i = 0; i < 10; i += 1) for (const q of kataSet(59)) kinds.add(q.kind);
  assert.deepEqual([...kinds].sort(), ['katameaning', 'kataword']);
});

test('lưu trữ: dữ liệu cũ còn khoá srs vẫn nhập được, khoá đó bị bỏ', () => {
  assert.equal('srs' in defaults(), false);
  assert.equal('srs' in normalize({ custom: [], srs: { 'kw:日': { box: 1, due: 1 } } }), false);
});

test('kanji hay thi: 81 từ không trùng, cách đọc toàn kana, 31 từ hay bị hỏi', () => {
  assert.equal(KANJI_THI.length, 81);
  assert.equal(KANJI_THI.filter(w => w.star).length, 31);
  for (const key of ['word', 'kana', 'vi']) assert.equal(new Set(KANJI_THI.map(w => w[key])).size, 81, `trùng ${key}`);
  for (const w of KANJI_THI) {
    assert.match(w.word, /\p{Script=Han}/u, w.word);
    assert.match(w.kana, /^[ぁ-ん]+$/, w.word);
  }
  for (const w of ['上', '下', '左', '右', '前', '後ろ', '東', '西', '南', '北', '入口', '出口']) assert.ok(KANJI_THI.some(x => x.word === w), `thiếu ${w}`);
});

test('thiSet: đủ số câu, hai chiều, 4 đáp án, dựng lại được từ id, giải thích đáp án nhiễu đúng bộ từ', () => {
  for (const n of [1, 20, 81, 500]) {
    const qs = thiSet(n);
    assert.equal(qs.length, Math.min(n, 81));
    assert.equal(new Set(qs.map(q => q.id)).size, qs.length);
  }
  const kinds = new Set();
  for (let i = 0; i < 20; i += 1) {
    for (const q of thiSet(81)) {
      kinds.add(q.kind);
      assert.equal(new Set(q.choices).size, 4, q.id);
      assert.ok(q.choices.includes(q.answer));
      assert.equal(q.plain, true);
      assert.equal(resolveQuestion(q.id).answer, q.answer);
      for (const c of q.choices.filter(c => c !== q.answer)) assert.ok(choiceNote(q, c, []), `${q.id}: ${c}`);
    }
  }
  assert.deepEqual([...kinds].sort(), ['kanji', 'kanjipick']);
});

test('kanji hay thi: đáp án nhiễu cùng chữ kana cuối khi bộ từ đủ, không đoán được qua đuôi', () => {
  for (const id of ['tk:見る', 'tp:見る', 'tk:高い', 'tp:高い']) {
    const q = resolveQuestion(id);
    assert.ok(q.choices.every(c => c.endsWith(id.at(-1))), `${id}: ${q.choices.join()}`);
  }
  const q = resolveQuestion('tk:書く');
  assert.equal(q.choices.filter(c => c.endsWith('く')).length, 3, q.choices.join()); // bộ từ chỉ có 書く, 行く, 近く
});
