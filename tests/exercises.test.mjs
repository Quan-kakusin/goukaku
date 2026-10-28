import test from 'node:test';
import assert from 'node:assert/strict';
import { LESSON_COUNT, LESSONS } from '../data/lessons.js';
import { EX_KINDS, lessonExercises, exerciseCount, exerciseQuestion } from '../js/exercises.js';
import { exerciseCatalog, exerciseSummary, pickFromPreset, mixPresets, allIds, patternIds, pickIds, mixIds } from '../js/lesson-exercises.js';
import { resolveQuestion, KINDS } from '../js/questions.js';
import { sentencePool, spellings, pickSentences } from '../js/sentences.js';
import { matchesWord, romajiOf } from '../js/romaji.js';
import { convertInput, finalizeKana } from '../js/ime.js';
import { VOCAB } from '../data/lessons.js';

const lessons = Array.from({ length: LESSON_COUNT }, (_, i) => i + 1);
const all = lessons.flatMap(n => Object.values(lessonExercises(n)).flat());

test('mỗi bài có nhiều bài tập đa dạng (hàng trăm câu, nhiều dạng)', () => {
  for (const n of lessons) {
    const kinds = Object.keys(lessonExercises(n));
    assert.ok(exerciseCount(n) >= 100, `Bài ${n} chỉ có ${exerciseCount(n)} câu`);
    assert.ok(kinds.length >= 8, `Bài ${n} chỉ có ${kinds.length} dạng: ${kinds}`);
  }
  assert.ok(all.length > 3500);
  for (const k of Object.keys(EX_KINDS)) assert.ok(all.some(q => q.kind === k), `không bài nào có dạng ${k}`);
});

test('câu hỏi hợp lệ: id duy nhất, ≥3 lựa chọn không trùng, có đáp án trong lựa chọn, không rò chữ undefined/false', () => {
  const ids = new Set();
  const bad = [];
  for (const q of all) {
    if (ids.has(q.id)) bad.push(`trùng id ${q.id}`);
    ids.add(q.id);
    const texts = [q.prompt, q.hint ?? '', q.explain, q.tag, ...q.choices].join('|');
    if (q.choices.length < 3 || q.choices.length > 4) bad.push(`${q.id}: ${q.choices.length} lựa chọn`);
    if (new Set(q.choices).size !== q.choices.length) bad.push(`${q.id}: lựa chọn trùng`);
    if (!q.choices.includes(q.answer)) bad.push(`${q.id}: đáp án không nằm trong lựa chọn`);
    if (q.choices.some(c => !c.trim())) bad.push(`${q.id}: lựa chọn rỗng`);
    if (/\b(undefined|null|NaN)\b|\[object/.test(texts)) bad.push(`${q.id}: rò giá trị rỗng`);
    if (!q.prompt.trim() || !q.explain.trim()) bad.push(`${q.id}: thiếu đề hoặc giải thích`);
    if (!KINDS[q.kind]) bad.push(`${q.id}: dạng ${q.kind} chưa có trong KINDS`);
    if (!['vocab', 'grammar'].includes(q.type)) bad.push(`${q.id}: phần ${q.type}`);
  }
  assert.deepEqual(bad, []);
});

test('id ổn định: một bản module mới cho cùng danh sách id và đáp án, và resolveQuestion dựng đúng câu từ id', async () => {
  const fresh = await import('../js/exercises.js?bản-khác');
  const second = lessons.flatMap(n => Object.values(fresh.lessonExercises(n)).flat());
  assert.deepEqual(second.map(q => q.id), all.map(q => q.id));
  assert.deepEqual(second.map(q => q.choices), all.map(q => q.choices), 'đáp án nhiễu phải cố định theo id');
  const rng = () => 0.5;
  for (const q of all) {
    const r = resolveQuestion(q.id, { deck: VOCAB, rng });
    assert.ok(r, q.id);
    assert.equal(r.answer, q.answer);
    assert.equal(r.prompt, q.prompt);
    assert.deepEqual([...r.choices].sort(), [...q.choices].sort());
  }
  assert.equal(exerciseQuestion('x:5:order:khongco', a => a), null);
  assert.equal(resolveQuestion('x:99:order:abc', { deck: VOCAB }), null);
});

test('điền trợ từ: đúng một chỗ trống, ghép đáp án vào thì ra câu ví dụ gốc, đáp án nhiễu không cùng nhóm dễ lẫn', () => {
  const groups = [['は', 'が', 'を', 'も', 'の'], ['に', 'へ', 'で'], ['と', 'や'], ['から', 'まで']];
  const sentences = new Set(lessons.flatMap(n => LESSONS[n - 1].grammar.flatMap(p => p.examples.map(e => e.jp))).concat(VOCAB.map(w => w.ex)));
  for (const q of all.filter(x => x.kind === 'particle')) {
    assert.equal(q.prompt.split('＿').length, 2, q.id);
    const full = q.prompt.replace('＿', q.answer);
    assert.ok(sentences.has(full) || [...sentences].some(s => s.replace(/\s+/g, ' ').trim() === full), `${q.id}: ${full}`);
    const grp = groups.find(g => g.includes(q.answer)) ?? [];
    for (const c of q.choices.filter(x => x !== q.answer)) assert.ok(!grp.includes(c), `${q.id}: ${c} lẫn với ${q.answer}`);
  }
});

test('sắp xếp câu: đáp án là câu gốc, lựa chọn sai đều đặt vị ngữ lệch khỏi cuối câu, các cụm trong đề là hoán vị của đáp án', () => {
  const orders = all.filter(x => x.kind === 'order');
  assert.ok(orders.length > 200);
  for (const q of orders) {
    const tokens = q.answer.split(' ');
    assert.deepEqual(q.prompt.split(' ／ ').sort(), [...tokens].sort(), q.id);
    assert.notEqual(q.prompt.split(' ／ ').join(' '), q.answer, `${q.id}: đề đã xếp sẵn đúng`);
    for (const c of q.choices.filter(x => x !== q.answer)) {
      assert.deepEqual(c.split(' ').sort(), [...tokens].sort(), q.id);
      assert.notEqual(c.split(' ').at(-1), tokens.at(-1), `${q.id}: ${c}`);
    }
  }
});

test('điền từ vựng: ô trống thay đúng từ, lựa chọn nhiễu không nằm sẵn trong câu', () => {
  const cloze = all.filter(x => x.kind === 'cloze');
  assert.ok(cloze.length > 100);
  for (const q of cloze) {
    assert.equal(q.prompt.split('＿＿').length, 2, q.id);
    for (const c of q.choices.filter(x => x !== q.answer)) assert.ok(!q.prompt.includes(c), `${q.id}: ${c}`);
  }
});

test('lỗi hay gặp: câu đúng khác câu sai; câu đáp án của "tìm câu sai" không phải câu đúng của sách', () => {
  const rights = new Set(LESSONS.flatMap(l => l.grammar.flatMap(p => (p.mistakes ?? []).map(m => m.right))));
  for (const q of all.filter(x => x.kind === 'wrongone')) assert.ok(!rights.has(q.answer), `${q.id}: đáp án "tìm câu sai" lại là câu đúng`);
  for (const q of all.filter(x => x.kind === 'wrongone')) for (const c of q.choices.filter(x => x !== q.answer)) assert.ok(rights.has(c), `${q.id}: lựa chọn "${c}" không phải câu đúng trong sách`);
  const wrongs = new Set(LESSONS.flatMap(l => l.grammar.flatMap(p => (p.mistakes ?? []).map(m => m.wrong))));
  for (const q of all.filter(x => x.kind === 'correct')) for (const c of q.choices.filter(x => x !== q.answer)) assert.ok(wrongs.has(c), `${q.id}: "${c}" không phải câu sai trong sách`);
});

test('danh mục bài tập: nhóm, đếm, pickIds, mixIds, patternIds', () => {
  const groups = exerciseCatalog(5, VOCAB);
  assert.deepEqual(groups.map(g => g.id), ['vocab', 'sentence', 'formula', 'mistake', 'book']);
  const ids = allIds(groups);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.length > 250);
  assert.equal(pickIds(ids, 10).length, 10);
  assert.equal(pickIds(ids.slice(0, 3), 10).length, 3);
  const mix = mixIds(groups, 14);
  assert.equal(mix.length, 14);
  assert.equal(new Set(mix).size, 14);
  const kindOf = id => id.split(':').slice(0, id.startsWith('x') ? 3 : 1).join(':');
  assert.ok(new Set(mix.map(kindOf)).size >= 10, 'mixIds phải trải đều nhiều dạng');
  for (const p of LESSONS[4].grammar) assert.ok(patternIds(5, p.id).length >= p.quiz.length, p.id);
  assert.deepEqual(mixIds([], 10), []);
});

test('câu ví dụ để gõ: gõ romaji ra đúng câu, は へ を gõ theo chữ hoặc theo cách đọc đều được, câu quá dài/đối thoại bị loại', () => {
  const pool = sentencePool(lessons);
  assert.ok(pool.length > 250);
  const bad = [];
  for (const s of pool) {
    assert.ok(!s.word.includes('…'));
    let prev = { raw: '', text: '' };
    for (const c of romajiOf(s)) prev = convertInput(prev.text + c, prev, { target: s.kana });
    if (!matchesWord(finalizeKana(prev.text), s)) bad.push(`${s.word}: ${prev.text}`);
    for (const alt of spellings(s.word)) if (!matchesWord(alt, s)) bad.push(`alt ${alt}`);
  }
  assert.deepEqual(bad, []);
  const watashi = pool.find(s => s.word === 'わたしは かいしゃいんです。');
  assert.ok(matchesWord('わたしはかいしゃいんです', watashi));
  assert.ok(matchesWord('わたしわかいしゃいんです', watashi));
  assert.ok(matchesWord('わたしは かいしゃいんです。', watashi), 'gõ cả dấu cách và dấu câu vẫn đúng');
  assert.equal(matchesWord('わたしはがくせいです', watashi), false);
  assert.deepEqual(spellings('うちへ かえります。'), ['うちへかえります', 'うちえかえります']);
  assert.equal(pickSentences([5], false).length, pickSentences([5], true).length);
});

test('trang Bài tập gọn: bốn dạng lớn, mỗi dạng trộn nhiều loại câu, tổng hợp lấy đều giữa các dạng', () => {
  for (const n of lessons) {
    const presets = exerciseSummary(n, VOCAB);
    assert.deepEqual(presets.map(p => p.id), ['vocab', 'right', 'order', 'formula'], `Bài ${n}`)
    for (const p of presets) {
      assert.ok(p.ids.length >= 5, `Bài ${n} · ${p.title}`);
      const picked = pickFromPreset(p, 10);
      assert.equal(new Set(picked).size, picked.length);
      assert.ok(picked.every(id => p.ids.includes(id)));
    }
    const mix = mixPresets(presets, 12);
    assert.equal(mix.length, 12);
    const owner = id => presets.find(p => p.ids.includes(id)).id;
    assert.equal(new Set(mix.map(owner)).size, presets.length, 'tổng hợp phải có đủ các dạng');
  }
  const right = exerciseSummary(5, VOCAB).find(p => p.id === 'right');
  assert.ok(right.parts.length >= 4, 'dạng Chọn câu đúng phải gồm nhiều loại câu');
  const kindOf = id => (id.startsWith('x:') ? id.split(':')[2] : id.split(':')[0]);
  assert.ok(new Set(pickFromPreset(right, 12).map(kindOf)).size >= 3, 'mục Chọn câu đúng phải trộn nhiều loại câu');
});
