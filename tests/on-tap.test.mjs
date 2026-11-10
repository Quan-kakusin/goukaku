// Bộ đề ôn tập 25 bài: 150 câu, không kanji, mỗi câu gắn một bài, có phần nghe bằng giọng máy.
import test from 'node:test';
import assert from 'node:assert/strict';
import { getPaper, buildPaper, findMockQuestion } from '../js/mock.js';
import { resolveQuestion, KINDS, SECTIONS } from '../js/questions.js';
import { toItem } from '../js/exam.js';
import { normalize, defaults } from '../js/storage.js';

const paper = getPaper('on-tap-01');
const HAN = /[㐀-鿿々]/;

test('bộ ôn tập có trong danh sách, đánh dấu review, ba phần 45 + 75 + 30 câu với giờ rộng rãi', () => {
  assert.ok(paper, 'thiếu on-tap-01 trong PAPERS (js/mock.js)');
  assert.equal(paper.review, true);
  const { questions, parts } = buildPaper(paper);
  assert.deepEqual(parts.map(p => p.key), ['moji', 'bunpou-dokkai', 'choukai']);
  assert.deepEqual(parts.map(p => p.to - p.from + 1), [45, 75, 30]);
  assert.equal(questions.length, 150);
  assert.ok(parts.every(p => p.limitSec >= 3600));
  assert.deepEqual(parts.map(p => p.audioFiles), [false, false, false]);
});

test('mọi câu hợp lệ, có bài (1-25), dựng lại được từ id, và lưu được bài vào lịch sử', () => {
  const { questions } = buildPaper(paper);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const q of questions) {
    assert.ok(q.id.startsWith('j:on-tap-01:'));
    assert.ok(Number.isInteger(q.lesson) && q.lesson >= 1 && q.lesson <= 25, `${q.id}: thiếu bài`);
    assert.equal(new Set(q.choices).size, q.choices.length, q.id);
    assert.ok(q.choices.includes(q.answer), q.id);
    assert.ok(q.explain.length >= 15 && q.prompt && q.instr && q.instrVi, q.id);
    assert.ok(q.kind in KINDS && q.type in SECTIONS && KINDS[q.kind].section === q.type, q.id);
    assert.deepEqual(findMockQuestion(q.id), q);
    assert.equal(resolveQuestion(q.id, { deck: [] }), findMockQuestion(q.id));
    assert.equal(toItem(q, q.answer).lesson, q.lesson);
  }
});

test('không có chữ Hán nào trong nội dung (đề, đáp án, đoạn văn, lời thoại, giải thích)', () => {
  const bad = [];
  for (const part of paper.parts) {
    for (const s of part.sections) {
      for (const f of [s.instr, s.passage ?? '']) if (HAN.test(f)) bad.push(`${s.id}: ${f.slice(0, 20)}`);
      s.questions.forEach((q, i) => {
        const texts = [q.prompt, q.explain, q.passage ?? '', ...q.choices, ...(q.audio ?? []).map(l => l[1])];
        for (const t of texts) if (HAN.test(t)) bad.push(`${s.id}-${i + 1}: ${t.slice(0, 24)}`);
      });
    }
  }
  assert.deepEqual(bad, []);
});

test('mỗi bài từ 1 đến 25 có ít nhất 3 câu, phần nghe phủ nhiều bài', () => {
  const { questions } = buildPaper(paper);
  const count = {};
  for (const q of questions) count[q.lesson] = (count[q.lesson] ?? 0) + 1;
  for (let n = 1; n <= 25; n += 1) assert.ok((count[n] ?? 0) >= 3, `bài ${n} chỉ có ${count[n] ?? 0} câu`);
  const listening = new Set(questions.filter(q => q.kind === 'choukai').map(q => q.lesson));
  assert.ok(listening.size >= 15, `phần nghe chỉ phủ ${listening.size} bài`);
});

test('phần nghe: kịch bản kana, người nói hợp lệ, số lần nghe 2/2/1/1, c3/c4 chỉ hiện số; câu sắp xếp đáp án ở cụm 3', () => {
  const sections = paper.parts[2].sections;
  assert.deepEqual(sections.map(s => s.plays), [2, 2, 1, 1]);
  assert.deepEqual(sections.map(s => s.questions.length), [9, 9, 6, 6]);
  for (const s of sections) {
    for (const raw of s.questions) {
      assert.ok(raw.audio.length >= 2);
      for (const [who, line] of raw.audio) assert.ok(['ナ', '女', '男'].includes(who) && line, s.id);
      assert.match(raw.prompt, /^\d+ばん$/);
      assert.equal(Boolean(raw.bare), ['c3', 'c4'].includes(s.id));
    }
  }
  const sort = paper.parts[1].sections.find(s => s.id === 'g2');
  assert.ok(sort.sort && sort.questions.length === 10);
  for (const raw of sort.questions) assert.ok(raw.prompt.includes('★') && raw.answer === 3);
});

test('đáp án cân bằng giữa các vị trí trong từng phần', () => {
  const { questions, parts } = buildPaper(paper);
  for (const part of parts) {
    const pos = [0, 0, 0, 0];
    for (const q of questions.slice(part.from, part.to + 1)) if (!q.id.includes(':g2-')) pos[q.choices.indexOf(q.answer)] += 1;
    const total = pos.reduce((a, b) => a + b, 0);
    assert.ok(Math.min(...pos.slice(0, part.key === 'choukai' ? 3 : 4)) >= total * 0.15, `${part.key}: ${pos}`);
  }
});

test('lưu trữ: lịch sử có bài của câu ôn tập vẫn qua normalize', () => {
  const q = buildPaper(paper).questions[0];
  const out = normalize({ ...defaults(), exams: [{ id: 'x', at: 1, title: 'Ôn tập', mode: 'exam', paper: paper.id, items: [toItem(q, q.answer)] }] });
  assert.equal(out.exams[0].items[0].lesson, q.lesson);
});
