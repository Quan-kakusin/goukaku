import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { PAPERS, getPaper, buildPaper, findMockQuestion, scoreMock, paperSize, PASS, SCALE } from '../js/mock.js';
import { resolveQuestion, KINDS, SECTIONS } from '../js/questions.js';
import { KANJI } from '../data/kanji-n5.js';

const HAN = /[㐀-鿿々]/g;
const ALLOWED = new Set(KANJI.map(k => k.char));
const paper = PAPERS[0];

test('đề số 1: hai phần thi (35 + 32 câu, 25 + 50 phút), chưa có phần nghe', () => {
  const { questions, parts } = buildPaper(paper);
  assert.deepEqual(parts.map(p => p.key), ['moji', 'bunpou-dokkai']);
  assert.deepEqual(parts.map(p => p.to - p.from + 1), [35, 32]);
  assert.deepEqual(parts.map(p => p.limitSec / 60), [25, 50]);
  assert.equal(questions.length, 67);
  assert.equal(paperSize(paper), 67);
  assert.ok(questions.every(q => q.kind !== 'choukai'));
  assert.equal(parts[0].from, 0);
  assert.equal(parts[1].from, parts[0].to + 1);
  assert.equal(getPaper('khong-co'), null);
});

test('tùy chọn bỏ phần nghe chỉ bỏ các câu nghe, đề không có phần nghe thì không đổi', () => {
  for (const p of PAPERS) {
    const withAll = buildPaper(p);
    const without = buildPaper(p, { includeListening: false });
    assert.equal(without.questions.length, withAll.questions.filter(q => q.kind !== 'choukai').length);
    assert.ok(without.questions.every(q => q.kind !== 'choukai'));
  }
  assert.equal(buildPaper(paper).questions.length, paperSize(paper), 'đề 1 chưa có phần nghe');
});

test('mọi câu hợp lệ: id duy nhất, lựa chọn không trùng, đáp án nằm trong lựa chọn, có giải thích', () => {
  const { questions } = buildPaper(paper);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const q of questions) {
    assert.ok(q.id.startsWith(`j:${paper.id}:`));
    assert.ok(q.choices.length >= 3 && q.choices.length <= 4, q.id);
    assert.equal(new Set(q.choices).size, q.choices.length, `${q.id}: lựa chọn trùng`);
    assert.ok(q.choices.includes(q.answer), `${q.id}: đáp án không nằm trong lựa chọn`);
    assert.ok(q.explain && q.prompt && q.instr && q.instrVi, `${q.id}: thiếu trường`);
    assert.ok(q.kind in KINDS && q.type in SECTIONS, q.id);
    assert.equal(KINDS[q.kind].section, q.type);
  }
});

test('đáp án không dồn vào một vị trí', () => {
  const { questions } = buildPaper(paper);
  const pos = [0, 0, 0, 0];
  for (const q of questions) pos[q.choices.indexOf(q.answer)] += 1;
  for (const n of pos.slice(0, 3)) assert.ok(n >= 10, `vị trí đáp án: ${pos}`);
});

test('đề số 1: đọc hiểu và đoạn văn điền chỗ trống có đoạn văn kèm bản dịch', () => {
  const { questions } = buildPaper(paper);
  const withPassage = questions.filter(x => x.kind === 'dokkai' || x.id.includes(':g3-'));
  assert.equal(withPassage.length, 11);
  for (const q of withPassage) assert.ok(q.passage && q.passageVi, `${q.id}: thiếu đoạn văn hoặc bản dịch`);
});

test('chữ Hán trong đề chỉ thuộc 80 chữ của mục Kanji (đáp án nhiễu của 問題2 được dùng chữ na ná)', () => {
  const bad = [];
  for (const p of paper.parts) {
    for (const s of p.sections) {
      s.questions.forEach((raw, i) => {
        const texts = [raw.prompt, raw.passage ?? s.passage ?? '', ...(raw.audio ?? []).map(l => l[1])];
        if (!s.looseChoices) texts.push(...raw.choices);
        else texts.push(raw.choices[raw.answer - 1]);
        for (const ch of texts.join('').match(HAN) ?? []) if (!ALLOWED.has(ch)) bad.push(`${s.id}-${i + 1}: ${ch}`);
      });
    }
  }
  assert.deepEqual([...new Set(bad)], []);
});

test('dạng sắp xếp câu: cụm bị xáo trộn ổn định và đáp án là cụm ở vị trí ★', () => {
  const a = buildPaper(paper).questions.filter(q => q.id.includes(':g2-'));
  const b = buildPaper(paper).questions.filter(q => q.id.includes(':g2-'));
  assert.equal(a.length, 5);
  assert.deepEqual(a.map(q => q.choices), b.map(q => q.choices), 'không đổi giữa các lần dựng');
  for (const q of a) {
    assert.ok(q.prompt.includes('★'));
    const raw = paper.parts[1].sections.find(s => s.id === 'g2').questions.find(x => x.prompt === q.prompt);
    assert.equal(q.answer, raw.choices[2], 'đáp án là cụm thứ 3 theo đúng thứ tự');
    assert.ok(raw.explain.includes(q.answer.replace(/\s/g, '')) || raw.explain.includes(q.answer));
  }
  assert.ok(a.some(q => q.choices[2] !== q.answer), 'có câu mà đáp án không nằm sẵn ở vị trí 3 sau khi xáo');
});

test('resolveQuestion dựng lại câu thi thử từ id; id lạ trả về null', () => {
  const { questions } = buildPaper(paper);
  for (const q of questions) assert.equal(resolveQuestion(q.id, { deck: [] }), findMockQuestion(q.id));
  assert.equal(findMockQuestion(questions[3].id).answer, questions[3].answer);
  assert.equal(resolveQuestion('j:de-99:m1-1', { deck: [] }), null);
});

test('chấm điểm theo thang JLPT: 120 cho chữ・ngữ pháp・đọc hiểu, 60 cho nghe; đậu khi đủ ngưỡng', () => {
  const mk = (section, ok, n) => Array.from({ length: n }, () => ({ section, ok }));
  const all = [...mk('moji', true, 35), ...mk('bunpou', true, 26), ...mk('dokkai', true, 6), ...mk('choukai', true, 16)];
  const full = scoreMock(all);
  assert.equal(full.total, 180);
  assert.equal(full.max, 180);
  assert.equal(full.passed, true);

  const half = scoreMock([...mk('moji', true, 35), ...mk('moji', false, 0), ...mk('bunpou', false, 26), ...mk('dokkai', false, 6), ...mk('choukai', true, 16)]);
  assert.equal(half.written.score, Math.round((120 * 35) / 67));
  assert.equal(half.listening.score, SCALE.listening);

  // Nghe quá thấp: tổng đủ nhưng rớt vì phần nghe dưới sàn
  const lowListen = scoreMock([...mk('moji', true, 35), ...mk('bunpou', true, 26), ...mk('dokkai', true, 6), ...mk('choukai', true, 4), ...mk('choukai', false, 12)]);
  assert.ok(lowListen.total >= PASS.total);
  assert.equal(lowListen.listening.pass, false);
  assert.equal(lowListen.passed, false);

  // Không có phần nghe thì chưa kết luận
  const noListen = scoreMock([...mk('moji', true, 35), ...mk('bunpou', true, 26), ...mk('dokkai', true, 6)]);
  assert.equal(noListen.total, null);
  assert.equal(noListen.passed, null);
  assert.equal(noListen.written.score, 120);
});

// ---------- Đề số 2 (chép từ PDF) ----------
const paper2 = PAPERS.find(p => p.id === 'de-02');
const KEY2 = {
  moji: [2, 4, 1, 2, 2, 3, 4, 2, 2, 3, 1, 2, 3, 4, 4, 1, 3, 1, 4, 3, 1, 1, 3, 2, 1, 4, 2, 4, 3, 1, 2, 3, 4],
  'bunpou-dokkai': [2, 3, 2, 4, 3, 2, 3, 1, 3, 3, 1, 1, 4, 2, 4, 1, 4, 1, 4, 2, 2, 4, 2, 4, 3, 1, 2, 3, 4, 4, 1, 2],
  // 聴解: 問題1 (7 câu), 問題2 (6), 問題3 (5), 問題4 (6); không tính câu 例
  choukai: [2, 2, 3, 3, 1, 4, 4, 4, 3, 2, 4, 1, 3, 1, 3, 2, 3, 2, 1, 1, 2, 3, 3, 1],
};

test('đề số 2: ba phần thi (33 + 32 + 24 câu, 25 + 50 + 30 phút), phần nghe dùng file âm thanh', () => {
  const { questions, parts } = buildPaper(paper2);
  assert.deepEqual(parts.map(p => p.key), ['moji', 'bunpou-dokkai', 'choukai']);
  assert.deepEqual(parts.map(p => p.to - p.from + 1), [33, 32, 24]);
  assert.deepEqual(parts.map(p => p.limitSec / 60), [25, 50, 30]);
  assert.deepEqual(parts.map(p => p.audioFiles), [false, false, true]);
  assert.equal(questions.length, 89);
  assert.deepEqual(questions.slice(33).filter(q => q.kind === 'dokkai').length, 6);
});

test('đề số 2: đáp án từng câu khớp bảng đáp án của PDF', () => {
  const { questions, parts } = buildPaper(paper2);
  for (const part of parts) {
    const got = questions.slice(part.from, part.to + 1).map(q => q.choices.indexOf(q.answer) + 1);
    assert.deepEqual(got, KEY2[part.key], part.key);
  }
});

test('mọi đề: câu hợp lệ, id duy nhất toàn cục, có giải thích; đọc hiểu có đoạn văn và bản dịch', () => {
  const all = PAPERS.flatMap(p => buildPaper(p).questions);
  assert.equal(new Set(all.map(q => q.id)).size, all.length, 'id trùng giữa các đề');
  for (const q of all) {
    assert.ok(q.choices.length >= 3 && q.choices.length <= 4, q.id);
    assert.equal(new Set(q.choices).size, q.choices.length, `${q.id}: lựa chọn trùng`);
    assert.ok(q.choices.includes(q.answer) && q.explain && q.prompt, q.id);
    if (q.kind === 'dokkai') assert.ok(q.passage && q.passageVi, `${q.id}: thiếu đoạn văn/bản dịch`);
  }
});

test('đề số 2: dạng sắp xếp câu giữ thứ tự in, đoạn văn điền chỗ trống dùng chung', () => {
  const g2 = buildPaper(paper2).questions.filter(q => q.id.includes(':g2-'));
  assert.equal(g2.length, 5);
  for (const q of g2) assert.ok(q.prompt.includes('★') && q.choices.length === 4);
  const g3 = buildPaper(paper2).questions.filter(q => q.id.includes(':g3-'));
  assert.equal(g3.length, 5);
  assert.ok(g3.every(q => q.passage === g3[0].passage && q.passageVi));
});

test('chấm đề không có phần nghe: chỉ có điểm phần chữ・ngữ pháp・đọc hiểu, chưa kết luận đậu/rớt', () => {
  const { questions } = buildPaper(paper2, { includeListening: false });
  const items = questions.map(q => ({ section: q.type, ok: true }));
  const r = scoreMock(items);
  assert.equal(r.written.score, 120);
  assert.equal(r.written.pass, true);
  assert.equal(r.total, null);
  assert.equal(r.passed, null);
});

test('chấm cả đề số 2 có phần nghe: đủ 180 điểm và đậu khi đúng hết', () => {
  const items = buildPaper(paper2).questions.map(q => ({ section: q.type, ok: true }));
  const r = scoreMock(items);
  assert.equal(r.partial, false);
  assert.equal(r.total, 180);
  assert.equal(r.passed, true);
});

test('phần nghe của đề số 2: file âm thanh và hình đề đều tồn tại, mỗi もんだい một file', () => {
  const listening = buildPaper(paper2).questions.filter(q => q.kind === 'choukai');
  assert.equal(listening.length, 24);
  assert.deepEqual([...new Set(listening.map(q => q.audioSrc))], [1, 2, 3, 4].map(n => `audio/de-02/N5Q${n}.mp3`));
  for (const q of listening) {
    assert.ok(existsSync(new URL(`../public/${q.audioSrc}`, import.meta.url)), `thiếu ${q.audioSrc}`);
    if (q.image) assert.ok(existsSync(new URL(`../public/${q.image}`, import.meta.url)), `thiếu ${q.image}`);
    if (q.bare) assert.ok(q.choices.every(c => /^\d$/.test(c)), `${q.id}: lựa chọn chỉ có số`);
  }
  assert.equal(listening.filter(q => q.image).length, 10);
});

test('chỉ làm phần nghe: báo số câu đúng phần nghe, không quy điểm', () => {
  const items = buildPaper(paper2, { partKeys: ['choukai'] }).questions.map((q, i) => ({ section: q.type, ok: i < 20 }));
  const r = scoreMock(items);
  assert.equal(r.partial, true);
  assert.deepEqual(r.partScores.map(p => [p.key, p.correct, p.total]), [['choukai', 20, 24]]);
  assert.equal(r.total, null);
  assert.equal(r.listening.score, null);
});

test('làm từng phần: chọn phần nào thì đề chỉ có phần đó, câu và khoảng [from, to] tính lại từ 0', () => {
  const full = buildPaper(paper);
  const one = buildPaper(paper, { partKeys: ['moji'] });
  const two = buildPaper(paper, { partKeys: ['bunpou-dokkai'] });
  assert.deepEqual(one.parts.map(p => p.key), ['moji']);
  assert.deepEqual(two.parts.map(p => p.key), ['bunpou-dokkai']);
  assert.equal(one.questions.length + two.questions.length, full.questions.length);
  for (const { questions, parts } of [one, two]) {
    assert.equal(parts[0].from, 0);
    assert.equal(parts[0].to, questions.length - 1);
  }
  assert.deepEqual(buildPaper(paper, { partKeys: ['moji', 'bunpou-dokkai'] }).questions.map(q => q.id), full.questions.map(q => q.id), 'chọn đủ hai phần = cả đề');
  assert.equal(buildPaper(paper, { partKeys: ['khong-co'] }).parts.length, 0);
});

test('chấm khi chỉ làm một phần: báo số câu đúng từng phần, không quy ra thang 120 hay đậu/rớt', () => {
  const mk = (section, ok, n) => Array.from({ length: n }, () => ({ section, ok }));
  const onlyMoji = scoreMock([...mk('moji', true, 30), ...mk('moji', false, 5)]);
  assert.equal(onlyMoji.partial, true);
  assert.deepEqual(onlyMoji.partScores.map(p => [p.key, p.correct, p.total, p.percent]), [['moji', 30, 35, 86]]);
  assert.equal(onlyMoji.written.score, null);
  assert.equal(onlyMoji.written.pass, null);
  assert.equal(onlyMoji.total, null);
  const onlyGrammar = scoreMock([...mk('bunpou', true, 10), ...mk('dokkai', false, 6)]);
  assert.equal(onlyGrammar.partial, true);
  assert.deepEqual(onlyGrammar.partScores.map(p => [p.key, p.correct, p.total]), [['bunpou-dokkai', 10, 16]]);
  const both = scoreMock([...mk('moji', true, 35), ...mk('bunpou', true, 26), ...mk('dokkai', true, 6)]);
  assert.equal(both.partial, false);
  assert.equal(both.partScores.length, 2);
  assert.equal(both.written.score, SCALE.written);
});
