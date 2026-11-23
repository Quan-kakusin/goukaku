import test from 'node:test';
import assert from 'node:assert/strict';
import { KANJI } from '../data/kanji-n5.js';
import { KANJI_NOTES, CONFUSABLE } from '../data/kanji-notes.js';
import { kanjiHvQuestion, resolveQuestion, confusablesOf, KINDS, KANJI_WORDS } from '../js/questions.js';
import { KANJI_PICS } from '../data/kanji-pics.js';
import { picLine, picsOf, kanjiQuestion, kanjiPickQuestion } from '../js/questions.js';
import { normalize, defaults } from '../js/storage.js';
import { kanjiSet, kataSet, clampCount } from '../js/quiz-set.js';

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

test('hình gợi nhớ: đủ 80 chữ, không thừa, có hiện trong lời giải câu kanji', () => {
  const chars = KANJI.map(k => k.char);
  assert.deepEqual(chars.filter(c => !KANJI_PICS[c]), []);
  assert.deepEqual(Object.keys(KANJI_PICS).filter(c => !chars.includes(c)), []);
  assert.equal(picLine('日本'), ' Hình gợi nhớ: 日 ☀️, 本 📕.');
  assert.equal(picLine('ひと'), '');
  for (const k of KANJI) assert.ok(kanjiHvQuestion(k).explain.includes(KANJI_PICS[k.char]), k.char);
  for (const q of kanjiSet(80)) assert.ok(q.explain.includes('Hình gợi nhớ'), q.id);
});

test('hình gợi nhớ trong câu hỏi: nhìn kanji thì có hình từng chữ dưới đề, chọn chữ Hán thì mọi đáp án đều có hình (không lộ đáp án)', () => {
  assert.deepEqual(picsOf('先週'), [['先', '👨‍🏫'], ['週', '📅']]);
  for (const w of KANJI_WORDS) {
    const r = kanjiQuestion(w);
    assert.deepEqual(r.promptPics, picsOf(w.word), w.word);
    const p = kanjiPickQuestion(w);
    for (const c of p.choices) assert.ok(c in p.choicePics, c);
    // đáp án đúng không được đứng riêng là lựa chọn duy nhất có hình
    const withPic = p.choices.filter(c => p.choicePics[c]);
    assert.ok(withPic.length > 1 || !p.choicePics[p.answer], w.word);
  }
});
