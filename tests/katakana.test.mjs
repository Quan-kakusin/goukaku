// 59 từ katakana hay gặp trong đề N5: dữ liệu, câu hỏi, gõ romaji.
import test from 'node:test';
import assert from 'node:assert/strict';
import { KATAKANA, KATAKANA_GROUPS } from '../data/katakana-n5.js';
import { kataMeaningQuestion, kataWordQuestion, resolveQuestion, KINDS, KATA_BY_KANA } from '../js/questions.js';
import { convertInput, finalizeKana } from '../js/ime.js';
import { isCorrect } from '../js/words.js';
import { romajiOf } from '../js/romaji.js';

const ONLY_KATA = /^[ァ-ヺー]+$/;

test('dữ liệu: đủ 59 từ katakana, không trùng, đủ nghĩa và từ gốc, thuộc 6 nhóm', () => {
  assert.equal(KATAKANA.length, 59);
  assert.equal(new Set(KATAKANA.map(k => k.kana)).size, 59);
  const groups = new Set(KATAKANA_GROUPS.map(g => g.id));
  assert.equal(groups.size, 6);
  for (const k of KATAKANA) {
    assert.match(k.kana, ONLY_KATA, k.kana);
    assert.ok(k.vi && k.en && groups.has(k.group), k.kana);
    for (const a of k.alts ?? []) assert.match(a, ONLY_KATA);
  }
  for (const g of KATAKANA_GROUPS) assert.ok(KATAKANA.some(k => k.group === g.id), g.id);
});

test('câu hỏi katakana: 4 lựa chọn không trùng, đáp án đúng, dựng lại được từ id, không hiện furigana', () => {
  assert.ok(KINDS.katameaning && KINDS.kataword);
  for (const k of KATAKANA) {
    for (const make of [kataMeaningQuestion, kataWordQuestion]) {
      const q = make(k);
      assert.equal(q.choices.length, 4, q.id);
      assert.equal(new Set(q.choices).size, 4, q.id);
      assert.ok(q.choices.includes(q.answer));
      assert.equal(q.plain, true);
      assert.equal(resolveQuestion(q.id).answer, q.answer);
    }
    // đáp án nhiễu của nghĩa → katakana không được cũng đúng (cùng nghĩa với đáp án)
    const w = kataWordQuestion(k);
    for (const c of w.choices.filter(x => x !== k.kana)) assert.notEqual(KATA_BY_KANA.get(c).vi, k.vi);
  }
});

test('đáp án nhiễu ưu tiên từ giống nhau (アパート / デパート, コップ / カップ, シャツ / ワイシャツ)', () => {
  for (const [a, b] of [['アパート', 'デパート'], ['コップ', 'カップ'], ['シャツ', 'ワイシャツ']]) {
    for (let i = 0; i < 5; i += 1) assert.ok(kataWordQuestion(KATA_BY_KANA.get(a)).choices.includes(b), `${a} thiếu ${b}`);
  }
});

test('gõ romaji: mọi từ gõ ra đúng katakana và được chấm đúng, kể cả cách viết khác (キロ)', () => {
  for (const k of KATAKANA) {
    const w = { word: k.kana, kana: k.kana, vi: k.vi, alts: k.alts };
    let prev = { raw: '', text: '' };
    for (const c of romajiOf(w)) prev = convertInput(prev.text + c, prev, { target: k.kana });
    assert.ok(isCorrect(finalizeKana(prev.text), w), `${k.kana}: gõ ${romajiOf(w)} ra ${prev.text}`);
    assert.ok(isCorrect(k.kana, w), k.kana);
    // chữ hiện trong ô là katakana của từ (ー ở đúng chỗ) khi từ không có ティ/ディ
    if (!/[ティディ]/.test(k.kana)) assert.equal(prev.text, k.kana, `${k.kana}: ô hiện ${prev.text}`);
  }
  assert.ok(isCorrect('キロ', { word: 'キログラム', kana: 'キログラム', alts: ['キロ'] }));
});
