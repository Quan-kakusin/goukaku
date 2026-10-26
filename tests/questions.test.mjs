import test from 'node:test';
import assert from 'node:assert/strict';
import {
  shuffle, pickN, KINDS, grammarQuestion, KANJI_WORDS, kanjiQuestion, vocabQuestion, wordQuestion,
  resolveQuestion, choiceNote, findPattern,
} from '../js/questions.js';
import { VOCAB, GRAMMAR } from '../data/lessons.js';

// rng có hạt giống để kết quả lặp lại được
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

const assertWellFormed = q => {
  assert.ok(q, 'không dựng được câu hỏi');
  assert.equal(q.choices.length, 4, `${q.id}: cần 4 lựa chọn`);
  assert.equal(new Set(q.choices).size, 4, `${q.id}: lựa chọn trùng: ${q.choices}`);
  assert.ok(q.choices.includes(q.answer), `${q.id}: đáp án không nằm trong lựa chọn`);
  assert.ok(q.prompt && q.explain && q.tag && q.kind in KINDS, `${q.id}: thiếu trường`);
  assert.equal(q.type, KINDS[q.kind].section, `${q.id}: type phải là phần của dạng ${q.kind}`);
};

test('shuffle giữ nguyên phần tử, không sửa mảng gốc, lặp lại được với cùng hạt giống', () => {
  const src = [1, 2, 3, 4, 5, 6, 7, 8];
  const a = shuffle(src, seeded(1));
  assert.deepEqual([...a].sort(), src);
  assert.deepEqual(src, [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(a, shuffle(src, seeded(1)));
  assert.notDeepEqual(a, shuffle(src, seeded(2)));
  assert.equal(pickN(src, 3, seeded(3)).length, 3);
});

test('mọi câu ngữ pháp dựng được, hợp lệ và có tham chiếu tới mẫu câu', () => {
  const ids = GRAMMAR.flatMap(p => p.quiz.map(q => q.id));
  assert.ok(ids.length >= 200);
  for (const id of ids) {
    const q = grammarQuestion(id, seeded(7));
    assertWellFormed(q);
    assert.ok(findPattern(q.ref.patternId), `${id}: mẫu câu liên quan không tồn tại`);
    assert.ok(q.lesson >= 1 && q.lesson <= 25);
  }
  assert.equal(grammarQuestion('khong-co', seeded(1)), null);
});

test('mọi từ kanji dựng được câu hỏi cách đọc hợp lệ, với nhiều hạt giống', () => {
  assert.ok(KANJI_WORDS.length >= 120);
  const words = KANJI_WORDS.map(w => w.word);
  assert.equal(new Set(words).size, words.length, 'KANJI_WORDS phải khử trùng theo từ');
  for (const [i, kw] of KANJI_WORDS.entries()) {
    for (const seed of [i, i + 1000]) assertWellFormed(kanjiQuestion(kw, seeded(seed)));
  }
});

// Từ đồng âm (はし: đũa / cầu) không hỏi được "chọn nghĩa" vì chỉ có kana, nhưng vẫn hỏi được "chọn từ" theo nghĩa
const homophone = w => VOCAB.some(x => x.id !== w.id && x.kana === w.kana);

test('mọi từ vựng dựng được câu hỏi chọn nghĩa (trừ từ đồng âm) và chọn từ hợp lệ', () => {
  let skipped = 0;
  for (const [i, w] of VOCAB.entries()) {
    if (homophone(w)) {
      assert.equal(vocabQuestion(w, VOCAB, seeded(i)), null, `${w.kana} đồng âm với từ khác`);
      skipped += 1;
    } else assertWellFormed(vocabQuestion(w, VOCAB, seeded(i)));
    assertWellFormed(wordQuestion(w, VOCAB, seeded(i)));
  }
  assert.ok(skipped > 0 && skipped < 200, `${skipped} từ đồng âm`);
});

test('bài học toàn kana: prompt và lựa chọn của câu hỏi từ vựng không chứa chữ Hán', () => {
  for (const [i, w] of VOCAB.entries()) {
    for (const q of [vocabQuestion(w, VOCAB, seeded(i)), wordQuestion(w, VOCAB, seeded(i))].filter(Boolean)) {
      assert.ok(![q.prompt, q.hint, q.explain, ...q.choices].some(t => /[㐀-鿿]/.test(t)), q.id);
    }
  }
});

test('đáp án nhiễu của từ vựng ưu tiên cùng bài và không trùng nghĩa với đáp án', () => {
  const w = VOCAB.find(x => x.lesson === 8);
  const sameLesson = new Set(VOCAB.filter(x => x.lesson === 8 && x.id !== w.id).map(x => x.vi));
  const q = vocabQuestion(w, VOCAB, seeded(11));
  assert.ok(q.choices.filter(c => c !== q.answer).every(c => sameLesson.has(c)));
  assert.equal(q.lesson, 8);
});

test('lựa chọn sai của kanji ưu tiên cách đọc có độ dài gần đáp án', () => {
  const kw = KANJI_WORDS.find(w => w.word === '日曜日');
  const q = kanjiQuestion(kw, seeded(5));
  const n = [...kw.kana].length;
  assert.ok(q.choices.filter(c => c !== q.answer).every(c => Math.abs([...c].length - n) <= 1));
});

test('resolveQuestion dựng lại đúng câu từ id của mọi dạng; id lạ hoặc nguồn đã mất trả về null', () => {
  const deck = VOCAB;
  const first = GRAMMAR[0].quiz[0];
  const g = resolveQuestion(`g:${first.id}`, { deck, rng: seeded(1) });
  assert.equal(g.answer, first.answer);
  assert.equal(resolveQuestion('k:学校', { deck, rng: seeded(1) }).answer, 'がっこう');

  const w = VOCAB.find(x => x.kanji === '学校');
  assert.equal(w.id, 'n5:学校', 'id cũ vẫn dùng chữ gốc');
  assert.equal(resolveQuestion(`v:${w.id}`, { deck, rng: seeded(1) }).answer, w.vi);
  assert.equal(resolveQuestion(`w:${w.id}`, { deck, rng: seeded(1) }).answer, 'がっこう');

  assert.equal(resolveQuestion('v:c:123', { deck }), null, 'từ riêng đã xóa');
  assert.equal(resolveQuestion(`r:${w.id}`, { deck }), null, 'dạng câu hỏi cách đọc cũ không còn');
  assert.equal(resolveQuestion('k:không-có', { deck }), null);
  assert.equal(resolveQuestion('x:abc', { deck }), null);
  assert.equal(resolveQuestion('khong-co-dau-hai-cham', { deck }), null);
});

test('id câu hỏi dựng lại được dù id từ chứa dấu hai chấm', () => {
  const q = vocabQuestion(VOCAB[3], VOCAB, seeded(2));
  assert.equal(q.id, `v:${VOCAB[3].id}`);
  assert.equal(resolveQuestion(q.id, { deck: VOCAB, rng: seeded(2) }).answer, VOCAB[3].vi);
});

test('choiceNote: cho biết đáp án nhiễu thực ra là của từ nào', () => {
  const eki = VOCAB.find(w => w.kanji === '駅');
  const gakkou = VOCAB.find(w => w.kanji === '学校');
  const meaning = vocabQuestion(gakkou, VOCAB, seeded(1));
  assert.match(choiceNote(meaning, eki.vi, VOCAB), /えき/);
  const word = wordQuestion(gakkou, VOCAB, seeded(1));
  assert.match(choiceNote(word, 'えき', VOCAB), /nhà ga/i);
  const kanji = kanjiQuestion(KANJI_WORDS.find(w => w.word === '日本人'), seeded(1));
  assert.match(choiceNote(kanji, 'がっこう', VOCAB), /学校/, 'ghi chú của mục Kanji vẫn dùng chữ Hán');
  assert.equal(choiceNote(meaning, 'không có từ nào nghĩa thế này', VOCAB), null);
  const grammar = grammarQuestion(GRAMMAR[0].quiz[0].id, seeded(1));
  assert.equal(choiceNote(grammar, 'が', VOCAB), null, 'ngữ pháp không có ghi chú theo đáp án');
});
