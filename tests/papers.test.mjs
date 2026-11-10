// Đề thi thử do app soạn (số 3, 4, 5): cùng cấu trúc 35 + 32 + 23 câu, phần nghe đọc bằng giọng máy (kịch bản kana).
import test from 'node:test';
import assert from 'node:assert/strict';
import { getPaper, buildPaper, findMockQuestion, scoreMock } from '../js/mock.js';
import { resolveQuestion, KINDS, SECTIONS } from '../js/questions.js';
import { KANJI } from '../data/kanji-n5.js';

const IDS = ['de-03', 'de-04', 'de-05'];
const HAN = /[㐀-鿿々]/g;
const ALLOWED = new Set(KANJI.map(k => k.char));
const SHAPE = { moji: [12, 8, 10, 5], 'bunpou-dokkai': [16, 5, 5, 3, 2, 1], choukai: [6, 6, 5, 6] };

for (const id of IDS) {
  const paper = getPaper(id);

  test(`${id}: có trong danh sách đề, ba phần thi 35 + 32 + 23 câu (25 + 50 + 30 phút), phần nghe dùng giọng máy`, () => {
    assert.ok(paper, `thiếu ${id} trong PAPERS (js/mock.js)`);
    const { questions, parts } = buildPaper(paper);
    assert.deepEqual(parts.map(p => p.key), ['moji', 'bunpou-dokkai', 'choukai']);
    assert.deepEqual(parts.map(p => p.to - p.from + 1), [35, 32, 23]);
    assert.deepEqual(parts.map(p => p.limitSec / 60), [25, 50, 30]);
    assert.deepEqual(parts.map(p => p.audioFiles), [false, false, false], 'nghe bằng giọng máy, không có file mp3');
    assert.equal(questions.length, 90);
    for (const part of paper.parts) assert.deepEqual(part.sections.map(s => s.questions.length), SHAPE[part.key], part.key);
  });

  test(`${id}: mọi câu hợp lệ (id duy nhất, lựa chọn không trùng, đáp án trong lựa chọn, có giải thích) và dựng lại được từ id`, () => {
    const { questions } = buildPaper(paper);
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
    for (const q of questions) {
      assert.ok(q.id.startsWith(`j:${id}:`));
      assert.equal(new Set(q.choices).size, q.choices.length, `${q.id}: lựa chọn trùng`);
      assert.ok(q.choices.includes(q.answer), `${q.id}: đáp án không nằm trong lựa chọn`);
      assert.ok(q.explain.length >= 15 && q.prompt && q.instr && q.instrVi, `${q.id}: thiếu trường`);
      assert.ok(q.kind in KINDS && q.type in SECTIONS && KINDS[q.kind].section === q.type, q.id);
      assert.deepEqual(findMockQuestion(q.id), q);
      assert.equal(resolveQuestion(q.id, { deck: [] }), findMockQuestion(q.id));
    }
  });

  test(`${id}: chữ Hán chỉ thuộc 80 chữ N5 (đáp án nhiễu 問題2 được dùng chữ na ná), kể cả lời thoại nghe`, () => {
    const bad = [];
    for (const p of paper.parts) {
      for (const s of p.sections) {
        s.questions.forEach((raw, i) => {
          const texts = [raw.prompt, raw.passage ?? s.passage ?? '', ...(raw.audio ?? []).map(l => l[1])];
          texts.push(...(s.looseChoices ? [raw.choices[raw.answer - 1]] : raw.choices));
          for (const ch of texts.join('').match(HAN) ?? []) if (!ALLOWED.has(ch)) bad.push(`${s.id}-${i + 1}: ${ch}`);
        });
      }
    }
    assert.deepEqual([...new Set(bad)], []);
  });

  test(`${id}: đoạn văn có bản dịch, câu sắp xếp có ★ và đáp án ở cụm thứ 3`, () => {
    const { questions } = buildPaper(paper);
    for (const q of questions.filter(x => x.kind === 'dokkai' || x.id.includes(':g3-'))) assert.ok(q.passage && q.passageVi, `${q.id}: thiếu đoạn văn hoặc bản dịch`);
    const sort = paper.parts[1].sections.find(s => s.id === 'g2');
    assert.ok(sort.sort);
    for (const raw of sort.questions) {
      assert.ok(raw.prompt.includes('★'));
      assert.equal(raw.answer, 3);
    }
  });

  test(`${id}: phần nghe có kịch bản kana, người nói hợp lệ, số lần nghe, c3/c4 chỉ hiện số`, () => {
    const sections = paper.parts[2].sections;
    assert.deepEqual(sections.map(s => s.plays), [2, 2, 1, 1]);
    for (const s of sections) {
      for (const raw of s.questions) {
        assert.ok(Array.isArray(raw.audio) && raw.audio.length >= 2, `${s.id}: thiếu audio`);
        for (const [who, line] of raw.audio) {
          assert.ok(['ナ', '女', '男'].includes(who), `${s.id}: người nói ${who}`);
          assert.ok(line && !HAN.test(line), `${s.id}: lời thoại chỉ viết bằng kana: ${line}`);
          HAN.lastIndex = 0;
        }
        assert.match(raw.prompt, /^\d+ばん$/);
        assert.equal(Boolean(raw.bare), ['c3', 'c4'].includes(s.id), `${s.id}: bare`);
      }
    }
    const { questions } = buildPaper(paper, { partKeys: ['choukai'] });
    assert.ok(questions.every(q => q.kind === 'choukai' && q.audio && !q.audioSrc && !q.image));
  });

  test(`${id}: đáp án cân bằng giữa các vị trí trong từng phần thi`, () => {
    const { questions, parts } = buildPaper(paper);
    for (const part of parts) {
      const pos = [0, 0, 0, 0];
      for (const q of questions.slice(part.from, part.to + 1)) if (!q.id.includes(':g2-')) pos[q.choices.indexOf(q.answer)] += 1;
      const total = pos.reduce((a, b) => a + b, 0);
      assert.ok(Math.min(...pos.slice(0, part.key === 'choukai' ? 3 : 4)) >= total * 0.15, `${part.key}: ${pos}`);
    }
  });
}

test('đề 3, 4, 5 không trùng câu với nhau', () => {
  const seen = new Map();
  for (const id of IDS) {
    for (const q of buildPaper(getPaper(id)).questions) {
      const key = `${q.prompt}|${(q.passage ?? '').slice(0, 20)}`;
      assert.ok(!seen.has(key) || q.kind === 'choukai' || q.prompt.length < 8, `${id} ${q.id} trùng ${seen.get(key)}`);
      seen.set(key, q.id);
    }
  }
});

test('đề có phần nghe bằng giọng máy vẫn chấm theo thang 180 điểm', () => {
  const items = IDS.flatMap(id => buildPaper(getPaper(id)).questions.map(q => ({ section: q.type, ok: true })));
  assert.equal(scoreMock(items).total, 180);
});
