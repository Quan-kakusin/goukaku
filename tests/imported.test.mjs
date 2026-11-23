// Đề thi thử số 6 đến 9: chép từ bộ đề trực tuyến (file Excel người học đã cào), đáp án do app tự giải.
// Kiểm tra cấu trúc dữ liệu, không kiểm tra đáp án (đáp án đã được giải mù độc lập một lượt riêng).
import test from 'node:test';
import assert from 'node:assert/strict';
import { PAPERS, getPaper, buildPaper, findMockQuestion, scoreMock } from '../js/mock.js';
import { resolveQuestion, KINDS, SECTIONS } from '../js/questions.js';

const IDS = ['de-06', 'de-07', 'de-08', 'de-09'];
const HAN = /[㐀-鿿々]/;
const SECTION_IDS = { moji: ['m1', 'm2', 'm3', 'm4'], 'bunpou-dokkai': ['g1', 'g2', 'g3', 'd4', 'd5', 'd6'], choukai: ['c1', 'c2', 'c3', 'c4'] };
const PLAYS = { c1: 2, c2: 2, c3: 1, c4: 1 };

test('có đủ đề 6 đến 9 trong danh sách', () => {
  assert.equal(IDS.filter(id => getPaper(id)).length, 4);
  for (const id of IDS) assert.ok(PAPERS.includes(getPaper(id)));
});

for (const id of IDS) {
  const paper = getPaper(id);

  test(`${id}: ba phần thi đúng thứ tự, mục hợp lệ, mỗi phần có câu`, () => {
    assert.deepEqual(paper.parts.map(p => p.key), ['moji', 'bunpou-dokkai', 'choukai']);
    for (const p of paper.parts) {
      assert.ok(p.minutes > 0 && p.intro);
      for (const s of p.sections) {
        assert.ok(SECTION_IDS[p.key].includes(s.id), `${p.key}/${s.id}`);
        assert.ok(s.questions.length > 0 && s.instr && s.instrVi && s.mondai && s.title, s.id);
      }
    }
    assert.equal(paper.parts[2].listening, true);
    assert.ok(buildPaper(paper).questions.length >= 60);
  });

  test(`${id}: mọi câu hợp lệ (id duy nhất, lựa chọn không trùng, đáp án trong lựa chọn, có giải thích) và dựng lại được từ id`, () => {
    const { questions } = buildPaper(paper);
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
    for (const q of questions) {
      assert.ok(q.id.startsWith(`j:${id}:`));
      assert.ok(q.choices.length >= 3 && q.choices.every(c => typeof c === 'string' && c.trim()), q.id);
      assert.equal(new Set(q.choices).size, q.choices.length, `${q.id}: lựa chọn trùng`);
      assert.ok(q.choices.includes(q.answer), `${q.id}: đáp án không nằm trong lựa chọn`);
      assert.ok(q.explain.length >= 15 && q.prompt && q.instr && q.instrVi, `${q.id}: thiếu trường`);
      assert.ok(q.kind in KINDS && q.type in SECTIONS && KINDS[q.kind].section === q.type, q.id);
      assert.deepEqual(findMockQuestion(q.id), q);
      assert.equal(resolveQuestion(q.id, { deck: [] }), findMockQuestion(q.id));
    }
  });

  test(`${id}: bài đọc có đoạn văn và bản dịch, điền đoạn văn (g3) có đoạn văn, câu ★ đúng khuôn`, () => {
    const { questions } = buildPaper(paper);
    for (const q of questions.filter(x => x.kind === 'dokkai' || x.id.includes(':g3-'))) assert.ok(q.passage && q.passage.length > 10, `${q.id}: thiếu đoạn văn`);
    for (const q of questions.filter(x => x.kind === 'dokkai')) assert.ok(q.passageVi, `${q.id}: thiếu bản dịch`);
    const sort = paper.parts[1].sections.find(s => s.id === 'g2');
    assert.ok(sort.sort && sort.keepOrder);
    for (const raw of sort.questions) {
      assert.equal((raw.prompt.match(/★/g) ?? []).length, 1);
      assert.equal((raw.prompt.match(/＿+/g) ?? []).length, 3, raw.prompt);
      assert.equal(raw.choices.length, 4);
    }
  });

  test(`${id}: phần nghe có kịch bản kana, người nói hợp lệ, số lần nghe, c3/c4 chỉ hiện số, tranh được mô tả bằng chữ`, () => {
    for (const s of paper.parts[2].sections) {
      assert.equal(s.plays, PLAYS[s.id], s.id);
      for (const raw of s.questions) {
        assert.ok(Array.isArray(raw.audio) && raw.audio.length >= 2, `${s.id}: thiếu audio`);
        for (const [who, line] of raw.audio) {
          assert.ok(['ナ', '女', '男'].includes(who), `${s.id}: người nói ${who}`);
          assert.ok(line && !HAN.test(line), `${s.id}: lời thoại chỉ viết bằng kana: ${line}`);
        }
        assert.match(raw.prompt, /^\d+ばん$/);
        assert.equal(Boolean(raw.bare), ['c3', 'c4'].includes(s.id), `${s.id}: bare`);
        if (raw.viChoices) assert.ok(raw.choices.every(c => c.length > 8), raw.prompt); // mô tả tranh bằng chữ, không chỉ là số
        if (raw.bare) assert.deepEqual(raw.choices, ['1', '2', '3']);
      }
    }
    const { questions } = buildPaper(paper, { partKeys: ['choukai'] });
    assert.ok(questions.every(q => q.kind === 'choukai' && q.audio && !q.audioSrc && !q.image));
  });

  test(`${id}: đáp án không dồn vào một vị trí trong từng phần thi`, () => {
    const { questions, parts } = buildPaper(paper);
    for (const part of parts) {
      const pos = [0, 0, 0, 0];
      for (const q of questions.slice(part.from, part.to + 1)) pos[q.choices.indexOf(q.answer)] += 1;
      const total = pos.reduce((a, b) => a + b, 0);
      assert.ok(Math.max(...pos) <= total * 0.5, `${part.key}: ${pos}`);
    }
  });

  test(`${id}: làm đủ mọi câu vẫn chấm theo thang 180 (đề rút gọn quy theo tỉ lệ)`, () => {
    const items = buildPaper(paper).questions.map(q => ({ section: q.type, ok: true }));
    assert.equal(scoreMock(items).total, 180);
  });
}
