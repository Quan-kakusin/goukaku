// Kiểm tra dữ liệu nội dung. Khi bạn thêm từ/kanji/ngữ pháp, các test này bắt lỗi nhập liệu phổ biến.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, GRAMMAR, VOCAB, LESSON_COUNT } from '../data/lessons.js';
import { KANJI } from '../data/kanji-n5.js';

const KANA_ONLY = /^[぀-ヿー]+$/;
const BLANK = '＿';
const PICK_SENTENCE = 'ただしいぶんは どれですか。';

// ---------- Cấu trúc 25 bài ----------
test('có đủ 25 bài, đánh số liên tục, mỗi bài có tiêu đề và mô tả', () => {
  assert.equal(LESSON_COUNT, 25);
  assert.equal(LESSONS.length, 25);
  LESSONS.forEach((l, i) => {
    assert.equal(l.n, i + 1);
    for (const f of ['title', 'jp', 'summary', 'note']) assert.ok(l[f], `Bài ${l.n} thiếu ${f}`);
  });
});

test('mỗi bài có đủ nội dung tối thiểu để học và làm bài tập', () => {
  for (const l of LESSONS) {
    assert.ok(l.vocab.length >= 5, `Bài ${l.n} chỉ có ${l.vocab.length} từ`);
    assert.ok(l.grammar.length >= 1, `Bài ${l.n} chưa có mẫu ngữ pháp`);
    const quizzes = l.grammar.reduce((a, p) => a + p.quiz.length, 0);
    assert.ok(quizzes >= 3, `Bài ${l.n} chỉ có ${quizzes} câu bài tập`);
  }
});

test('mỗi bài có ít nhất 3 mục ngữ pháp theo sách', () => {
  for (const l of LESSONS) assert.ok(l.grammar.length >= 3, `Bài ${l.n} chỉ có ${l.grammar.length} mục`);
});

// ---------- Từ vựng ----------
test('từ vựng: id duy nhất, đủ trường, cách đọc toàn kana, ví dụ đi kèm nghĩa', () => {
  const ids = VOCAB.map(w => w.id);
  assert.equal(new Set(ids).size, ids.length, 'id từ trùng');
  for (const l of LESSONS) {
    for (const w of l.vocab) {
      for (const f of ['word', 'kana', 'vi']) assert.ok(typeof w[f] === 'string' && w[f].length > 0, `${w.id} thiếu ${f}`);
      assert.ok(KANA_ONLY.test(w.kana), `${w.id}: cách đọc phải toàn kana (${w.kana})`);
      assert.equal(w.lesson, l.n);
      assert.equal(Boolean(w.ex), Boolean(w.exVi), `${w.id}: câu ví dụ và nghĩa phải đi cùng nhau`);
    }
  }
  assert.ok(VOCAB.length >= 900);
});

test('id từ vựng giữ dạng n5:<chữ gốc> để sổ lỗi đã lưu không mất, còn word chỉ là kana', () => {
  assert.ok(VOCAB.every(w => w.id === `n5:${w.kanji}`));
  assert.ok(VOCAB.every(w => w.word === w.kana));
});

test('từ có romaji ghi tay (は đọc là "wa") phải là chữ Latin thường', () => {
  const withRomaji = VOCAB.filter(w => w.romaji);
  assert.ok(withRomaji.length >= 1);
  for (const w of withRomaji) assert.match(w.romaji, /^[a-z' -]+$/, `${w.id}: romaji ${w.romaji}`);
});

// ---------- Ngữ pháp ----------
test('ngữ pháp: id mẫu và id câu hỏi không trùng', () => {
  const patternIds = GRAMMAR.map(p => p.id);
  assert.equal(new Set(patternIds).size, patternIds.length, 'id mẫu câu trùng');
  const quizIds = GRAMMAR.flatMap(p => p.quiz.map(q => q.id));
  assert.equal(new Set(quizIds).size, quizIds.length, 'id câu hỏi trùng');
});

test('ngữ pháp: mỗi mẫu đủ công thức, giải thích, ví dụ và bài tập', () => {
  assert.ok(GRAMMAR.length >= 120);
  for (const p of GRAMMAR) {
    for (const f of ['title', 'formula', 'meaning']) assert.ok(p[f], `${p.id} thiếu ${f}`);
    assert.ok(p.explain.length >= 1, `${p.id} thiếu giải thích`);
    assert.ok(p.examples.length >= 2, `${p.id} cần ít nhất 2 ví dụ`);
    assert.ok(Array.isArray(p.notes), `${p.id}: notes phải là mảng`);
    assert.ok(p.quiz.length >= 2, `${p.id} cần ít nhất 2 câu hỏi`);
    for (const e of p.examples) assert.ok(e.jp && e.vi, `${p.id}: ví dụ thiếu jp/vi`);
    assert.ok(p.lesson >= 1 && p.lesson <= 25);
  }
});

// ---------- Giảng giải ngữ pháp chi tiết ----------
const filled = (v, lo, hi) => Array.isArray(v) && v.length >= lo && v.length <= hi && v.every(x => typeof x === 'string' && x.trim());
const flat = s => s.replace(/\s/g, '');

test('ngữ pháp: mỗi mẫu có giảng giải chi tiết (dùng khi nào, cách tạo câu, bóc tách câu, lỗi hay gặp, mẹo nhớ)', () => {
  for (const p of GRAMMAR) {
    assert.ok(filled(p.explain, 2, 6), `${p.id}: explain 2-6 đoạn`);
    assert.ok(filled(p.when, 2, 4), `${p.id}: when 2-4 mục`);
    assert.ok(filled(p.steps, 2, 5), `${p.id}: steps 2-5 bước`);
    assert.ok(typeof p.tip === 'string' && p.tip.trim(), `${p.id}: thiếu tip`);
    assert.ok(Array.isArray(p.mistakes) && p.mistakes.length >= 1 && p.mistakes.length <= 3, `${p.id}: mistakes 1-3`);
    for (const m of p.mistakes) {
      assert.ok(m.wrong && m.right && m.why, `${p.id}: lỗi hay gặp thiếu trường`);
      assert.notEqual(m.wrong, m.right, `${p.id}: câu sai và câu đúng giống nhau`);
    }
    if (p.compare !== undefined) assert.ok(Array.isArray(p.compare) && p.compare.every(c => c.with && c.diff), `${p.id}: compare`);
    if (p.table !== undefined) {
      assert.ok(p.table.head.length >= 2 && p.table.rows.length >= 1, `${p.id}: bảng quá nhỏ`);
      for (const r of p.table.rows) assert.equal(r.length, p.table.head.length, `${p.id}: hàng bảng lệch số cột`);
    }
  }
});

test('ngữ pháp: câu bóc tách là một câu ví dụ của mẫu và các phần ghép lại đúng bằng câu đó', () => {
  for (const p of GRAMMAR) {
    const b = p.breakdown;
    assert.ok(b && b.jp && b.vi && b.parts.length >= 3, `${p.id}: breakdown thiếu`);
    assert.ok(b.parts.every(([jp, role]) => jp && role), `${p.id}: phần bóc tách thiếu nội dung`);
    assert.equal(flat(b.parts.map(x => x[0]).join('')), flat(b.jp), `${p.id}: các phần không ghép lại thành câu`);
    assert.ok(p.examples.some(e => flat(e.jp) === flat(b.jp)), `${p.id}: câu bóc tách không nằm trong ví dụ`);
  }
});

test('mỗi bài có hướng dẫn tổng quan (2-4 đoạn)', () => {
  for (const l of LESSONS) assert.ok(filled(l.guide, 2, 4), `Bài ${l.n}: guide`);
});

test('ngữ pháp: mỗi câu hỏi có 4 lựa chọn khác nhau và đúng một đáp án trong đó', () => {
  for (const p of GRAMMAR) {
    for (const q of p.quiz) {
      assert.equal(q.choices.length, 4, `${q.id}: cần 4 lựa chọn`);
      assert.equal(new Set(q.choices).size, 4, `${q.id}: lựa chọn trùng nhau`);
      assert.equal(q.choices.filter(c => c === q.answer).length, 1, `${q.id}: đáp án phải nằm trong lựa chọn đúng một lần`);
      assert.ok(q.hint, `${q.id}: thiếu gợi ý nghĩa`);
      assert.ok(q.explain, `${q.id}: thiếu giải thích đáp án`);
    }
  }
});

test('ngữ pháp: câu điền chỗ trống có đúng một ＿, câu chọn câu đúng thì không có', () => {
  for (const p of GRAMMAR) {
    for (const q of p.quiz) {
      const blanks = [...q.q].filter(c => c === BLANK).length;
      if (q.q === PICK_SENTENCE) assert.equal(blanks, 0, `${q.id}: câu chọn câu đúng không có ＿`);
      else assert.equal(blanks, 1, `${q.id}: cần đúng một ＿ (có ${blanks})`);
    }
  }
});

// ---------- Bài học chỉ dùng kana ----------
const HAN = /[㐀-鿿々]/;
test('bài học và bài tập không chứa chữ Hán (chữ Hán chỉ có ở mục Kanji)', () => {
  const bad = [];
  const scan = (where, v) => {
    if (typeof v === 'string') { if (HAN.test(v)) bad.push(`${where}: ${v}`); }
    else if (Array.isArray(v)) v.forEach((x, i) => scan(`${where}[${i}]`, x));
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) scan(`${where}.${k}`, x);
  };
  for (const l of LESSONS) {
    const { vocab, ...rest } = l;
    scan(`bài ${l.n}`, rest);
    for (const w of vocab) scan(`bài ${l.n} / ${w.id}`, { word: w.word, kana: w.kana, vi: w.vi, ex: w.ex, exVi: w.exVi });
  }
  assert.deepEqual(bad.slice(0, 10), []);
});

// ---------- Kanji ----------
test('kanji: đúng 80 chữ cần thiết, không trùng, mỗi chữ có thông tin cần thiết', () => {
  assert.equal(KANJI.length, 80);
  const chars = KANJI.map(k => k.char);
  assert.equal(new Set(chars).size, chars.length, 'kanji trùng');
  for (const k of KANJI) {
    assert.equal([...k.char].length, 1, `${k.char}: phải là một ký tự`);
    for (const f of ['hv', 'vi', 'on', 'kun', 'group']) assert.ok(k[f], `${k.char} thiếu ${f}`);
    assert.ok(/^[A-ZÀ-Ỹ]+$/u.test(k.hv), `${k.char}: Hán Việt nên viết hoa (${k.hv})`);
  }
});

test('kanji: từ ví dụ chứa đúng chữ Hán đó, cách đọc toàn kana', () => {
  for (const k of KANJI) {
    assert.ok(k.words.length >= 2, `${k.char}: cần ít nhất 2 từ ví dụ`);
    for (const w of k.words) {
      assert.ok(w.word.includes(k.char), `${k.char}: từ "${w.word}" không chứa chữ này`);
      assert.ok(KANA_ONLY.test(w.kana), `${k.char}: cách đọc "${w.kana}" của ${w.word} phải toàn kana`);
      assert.ok(w.vi, `${k.char}: từ ${w.word} thiếu nghĩa`);
    }
  }
});
