import test from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultMinutes, scopeLessons, scopeLabel, poolSize, buildExam, toItem, gradeItems, verdict, makeEntry, historyStats, formatDuration, spokenDuration,
} from '../js/exam.js';
import { VOCAB, LESSONS } from '../data/lessons.js';

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

const ALL = [0, ...LESSONS.map(l => l.n)];
const build = (opts, seed = 1) => buildExam({ rng: seeded(seed), ...opts });

test('thời gian gợi ý: 45 giây mỗi câu, làm tròn lên bội số của 5 phút', () => {
  assert.deepEqual([5, 10, 20, 30, 50].map(defaultMinutes), [5, 10, 15, 25, 40]);
  assert.equal(defaultMinutes(1), 5);
});

test('phạm vi → số bài, và nhãn hiển thị', () => {
  assert.deepEqual(scopeLessons('12'), [12]);
  assert.equal(scopeLessons('all').length, 26);
  for (const bad of ['0', '26', 'abc', '', undefined, 'current']) assert.deepEqual(scopeLessons(bad), [], `"${bad}" không phải phạm vi hợp lệ`);
  assert.equal(scopeLabel('9'), 'Bài 9');
  assert.equal(scopeLabel('all'), 'Tất cả 25 bài');
});

test('dựng đề: chỉ có câu ngữ pháp, đủ số câu, không trùng, đúng phạm vi bài', () => {
  const qs = build({ lessons: [8], count: 10 });
  assert.equal(qs.length, 10);
  assert.equal(new Set(qs.map(q => q.id)).size, 10, 'câu hỏi trùng');
  assert.ok(qs.every(q => q.kind === 'grammar' && q.id.startsWith('g:')), 'đề không có câu từ vựng');
  assert.ok(qs.every(q => q.lesson === 8), 'có câu ngoài Bài 8');
  for (const q of qs) {
    assert.equal(q.choices.length, 4);
    assert.equal(new Set(q.choices).size, 4, `${q.id}: lựa chọn trùng`);
    assert.ok(q.choices.includes(q.answer));
  }
});

test('dựng đề: không vượt quá số câu ngữ pháp có sẵn của phạm vi', () => {
  const grammarCount = LESSONS[21].grammar.reduce((a, p) => a + p.quiz.length, 0);
  assert.equal(build({ lessons: [22], count: 30 }).length, grammarCount, 'lấy hết câu của Bài 22');
  assert.equal(poolSize([22]), grammarCount);
  assert.equal(build({ lessons: [1, 2], count: 500 }).length, poolSize([1, 2]));
});

test('đề không có chữ Hán', () => {
  const all = build({ lessons: ALL, count: 500 });
  assert.ok(all.length > 200);
  assert.ok(all.every(q => !/[㐀-鿿]/.test([q.prompt, q.explain, ...q.choices].join(''))));
});

test('dựng đề: lặp lại được với cùng hạt giống, khác nhau với hạt giống khác', () => {
  const ids = seed => build({ lessons: ALL, count: 20 }, seed).map(q => q.id);
  assert.deepEqual(ids(3), ids(3));
  assert.notDeepEqual(ids(3), ids(4));
});

test('dựng đề: số câu 0 hoặc phạm vi không có ngữ pháp thì trả về đề rỗng', () => {
  assert.deepEqual(build({ lessons: [1], count: 0 }), []);
  assert.deepEqual(build({ lessons: [0], count: 10 }), []);
});

test('toItem: bỏ trống và trả lời sai/đúng', () => {
  const q = { id: 'v:x', type: 'vocab', kind: 'meaning', lesson: 3, choices: ['a', 'b', 'c', 'd'], answer: 'b' };
  assert.deepEqual(toItem(q, 'b', true), { qid: 'v:x', kind: 'meaning', section: 'vocab', lesson: 3, choices: ['a', 'b', 'c', 'd'], chosen: 'b', ok: true, flagged: true });
  assert.equal(toItem(q, 'a').ok, false);
  assert.equal(toItem(q, null).ok, false);
  assert.equal(toItem({ ...q, lesson: undefined }, 'b').lesson, 0);
});

const item = (section, kind, lesson, chosen, ok) => ({ qid: `q${Math.random()}`, section, kind, lesson, choices: ['a', 'b', 'c', 'd'], chosen, ok, flagged: false });

test('chấm điểm: đúng/sai/bỏ trống, điểm theo phần, dạng và bài', () => {
  const items = [
    item('vocab', 'meaning', 1, 'a', true),
    item('vocab', 'meaning', 1, 'b', false),
    item('vocab', 'reading', 2, null, false),
    item('grammar', 'grammar', 2, 'c', true),
    item('grammar', 'grammar', 0, 'c', true),
  ];
  const g = gradeItems(items);
  assert.deepEqual([g.total, g.correct, g.wrong, g.blank, g.percent], [5, 3, 1, 1, 60]);
  assert.deepEqual(g.bySection, { vocab: { correct: 1, total: 3 }, grammar: { correct: 2, total: 2 } });
  assert.deepEqual(g.byKind.meaning, { correct: 1, total: 2 });
  assert.deepEqual(Object.keys(g.byLesson), ['1', '2'], 'bài 0 (từ riêng) không tính theo bài');
  assert.deepEqual(gradeItems([]).percent, 0);
});

test('xếp loại theo điểm', () => {
  assert.deepEqual([100, 90, 89, 70, 69, 50, 49, 0].map(p => verdict(p).key), ['excellent', 'excellent', 'pass', 'pass', 'near', 'near', 'fail', 'fail']);
});

test('thống kê lịch sử: trung bình, tốt nhất, theo phần và bài yếu nhất', () => {
  const mk = (id, items) => makeEntry({ id, title: id, mode: 'exam', items, seconds: 60, limit: null });
  const e1 = mk('a', [item('vocab', 'meaning', 5, 'a', true), item('vocab', 'meaning', 5, 'a', false), item('vocab', 'meaning', 5, 'a', false), item('vocab', 'meaning', 5, 'a', false), item('grammar', 'grammar', 9, 'a', true)]);
  const e2 = mk('b', [item('grammar', 'grammar', 9, 'a', true), item('grammar', 'grammar', 9, 'a', true), item('grammar', 'grammar', 9, 'a', true)]);
  const s = historyStats([e1, e2]);
  assert.equal(s.count, 2);
  assert.equal(s.questions, 8);
  assert.equal(s.best, 100);
  assert.equal(s.average, Math.round((e1.percent + e2.percent) / 2));
  assert.deepEqual(s.bySection, { vocab: 25, grammar: 100 });
  assert.deepEqual(s.weakLessons, [{ lesson: 5, percent: 25, total: 4 }], 'bài 9 đúng hết và bài chưa đủ 4 câu không bị coi là yếu');
  assert.deepEqual(historyStats([]), { count: 0, questions: 0, average: 0, best: 0, bySection: {}, weakLessons: [] });
});

test('định dạng thời gian', () => {
  assert.equal(formatDuration(0), '00:00');
  assert.equal(formatDuration(65), '01:05');
  assert.equal(formatDuration(3600), '60:00');
  assert.equal(formatDuration(-5), '00:00');
  assert.equal(spokenDuration(125), '2 phút 5 giây');
  assert.equal(spokenDuration(45), '45 giây');
});

test('poolSize: số câu ngữ pháp của phạm vi', () => {
  assert.equal(poolSize([1]), LESSONS[0].grammar.reduce((a, p) => a + p.quiz.length, 0));
  assert.ok(poolSize(ALL) > poolSize([1]));
  assert.equal(poolSize([0]), 0);
});
