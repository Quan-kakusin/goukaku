// 59 từ katakana hay gặp trong đề N5: dữ liệu, câu hỏi, ôn lặp lại, gõ romaji.
import test from 'node:test';
import assert from 'node:assert/strict';
import { KATAKANA, KATAKANA_GROUPS } from '../data/katakana-n5.js';
import { kataMeaningQuestion, kataWordQuestion, resolveQuestion, KINDS, KATA_BY_KANA } from '../js/questions.js';
import { ALL_KEYS, buildSession, questionOfKey, sessionQuestions } from '../js/katakana-study.js';
import { keyOfQuestion } from '../js/kanji-study.js';
import { convertInput, finalizeKana } from '../js/ime.js';
import { isCorrect } from '../js/words.js';
import { romajiOf } from '../js/romaji.js';
import { normalize } from '../js/storage.js';

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
      assert.equal(keyOfQuestion(q.id), `kk:${k.kana}`);
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

test('ôn lặp lại: 59 mục, lượt ôn lấy mục mới theo thứ tự, câu hỏi dựng được', () => {
  assert.equal(ALL_KEYS.length, 59);
  assert.ok(ALL_KEYS.every(k => k.startsWith('kk:') && questionOfKey(k)));
  const s = buildSession({ book: {}, newCount: 7, now: 5 });
  assert.equal(s.fresh.length, 7);
  assert.equal(s.due.length, 0);
  assert.equal(sessionQuestions(s.keys).length, 7);
  const due = buildSession({ book: { 'kk:ノート': { box: 1, due: 1, ok: 1, ng: 0 }, 'kc:日': { box: 1, due: 1, ok: 1, ng: 0 } }, newCount: 0, now: 10 });
  assert.deepEqual(due.due, ['kk:ノート'], 'chỉ lấy mục katakana');
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

test('lưu trữ: mục ôn katakana (kk:) qua được normalize', () => {
  const out = normalize({ custom: [], srs: { 'kk:ノート': { box: 2, due: 5, ok: 1, ng: 0 }, 'zz:x': { box: 1, due: 1 } } });
  assert.deepEqual(Object.keys(out.srs), ['kk:ノート']);
});
