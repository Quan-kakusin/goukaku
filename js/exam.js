// Luyện đề (chỉ gồm các mẫu ngữ pháp của bài): dựng đề, chấm điểm, thống kê. Hàm thuần (không đụng DOM/storage) nên test được với rng cố định.

import { LESSON_COUNT, GRAMMAR } from '../data/lessons.js';
import { shuffle, grammarQuestion } from './questions.js';
import { PASS_SCORE } from './progress.js';

export const PASS_PERCENT = PASS_SCORE;
const SECONDS_PER_QUESTION = 45;

// Thời gian gợi ý cho đề thi thử: 45 giây mỗi câu, làm tròn lên bội số của 5 phút
export const defaultMinutes = count => Math.max(5, Math.ceil((count * SECONDS_PER_QUESTION) / 60 / 5) * 5);

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Phạm vi → các số bài. 0 = từ riêng chưa xếp bài, được tính vào phạm vi "tất cả".
// scope: 'all' | số bài (1–25). Giá trị khác → không có bài nào.
export function scopeLessons(scope) {
  if (scope === 'all') return [0, ...range(1, LESSON_COUNT)];
  const n = Number(scope);
  return Number.isInteger(n) && n >= 1 && n <= LESSON_COUNT ? [n] : [];
}

export function scopeLabel(scope) {
  if (scope === 'all') return `Tất cả ${LESSON_COUNT} bài`;
  const n = Number(scope);
  return Number.isInteger(n) && n >= 1 && n <= LESSON_COUNT ? `Bài ${n}` : 'Không rõ phạm vi';
}

// Số câu ngữ pháp có thể dựng trong một phạm vi. Đề chỉ gồm câu hỏi của các mẫu ngữ pháp trong bài, toàn kana.
export function poolSize(lessons) {
  const inScope = new Set(lessons);
  return GRAMMAR.filter(p => inScope.has(p.lesson)).reduce((a, p) => a + p.quiz.length, 0);
}

// Dựng đề: lấy ngẫu nhiên câu hỏi ngữ pháp của các bài trong phạm vi, không trùng.
// Có thể trả về ít câu hơn `count` nếu phạm vi không đủ câu.
export function buildExam({ lessons, count, rng }) {
  const inScope = new Set(lessons);
  const ids = GRAMMAR.filter(p => inScope.has(p.lesson)).flatMap(p => p.quiz.map(q => q.id));
  if (count < 1) return [];
  const out = [];
  const used = new Set();
  for (const id of shuffle(ids, rng)) {
    if (out.length >= count) break;
    const q = grammarQuestion(id, rng);
    if (q && !used.has(q.id)) {
      used.add(q.id);
      out.push(q);
    }
  }
  return out;
}

// Một câu trả lời → mục lưu trong lịch sử. chosen = null nghĩa là bỏ trống.
export const toItem = (q, chosen, flagged = false) => ({
  qid: q.id,
  kind: q.kind,
  section: q.type,
  lesson: q.lesson ?? 0,
  choices: q.choices,
  chosen,
  ok: chosen !== null && chosen === q.answer,
  flagged,
});

const group = (items, key) => {
  const out = {};
  for (const it of items) {
    const k = key(it);
    out[k] ??= { correct: 0, total: 0 };
    out[k].total += 1;
    if (it.ok) out[k].correct += 1;
  }
  return out;
};

export function gradeItems(items) {
  const total = items.length;
  const correct = items.filter(i => i.ok).length;
  const blank = items.filter(i => i.chosen === null).length;
  return {
    total,
    correct,
    blank,
    wrong: total - correct - blank,
    percent: total ? Math.round((100 * correct) / total) : 0,
    bySection: group(items, i => i.section),
    byKind: group(items, i => i.kind),
    byLesson: group(items.filter(i => i.lesson > 0), i => i.lesson),
  };
}

export function verdict(percent) {
  if (percent >= 90) return { key: 'excellent', label: 'Xuất sắc' };
  if (percent >= PASS_PERCENT) return { key: 'pass', label: 'Đạt' };
  if (percent >= 50) return { key: 'near', label: 'Gần đạt' };
  return { key: 'fail', label: 'Chưa đạt' };
}

export const pct = ({ correct, total }) => (total ? Math.round((100 * correct) / total) : 0);

// Một lần làm đề hoàn chỉnh để lưu vào lịch sử
export function makeEntry({ id, title, mode, items, seconds, limit, paper, at = Date.now() }) {
  return { id, at, title, mode, seconds, limit: limit ?? null, percent: gradeItems(items).percent, ...(paper && { paper }), items };
}

// Thống kê từ lịch sử: điểm trung bình, điểm theo phần, và những bài làm yếu nhất
export function historyStats(exams) {
  const items = exams.flatMap(e => e.items);
  const bySection = group(items, i => i.section);
  const byLesson = group(items.filter(i => i.lesson > 0), i => i.lesson);
  const weakLessons = Object.entries(byLesson)
    .map(([lesson, g]) => ({ lesson: Number(lesson), percent: pct(g), total: g.total }))
    .filter(l => l.total >= 4 && l.percent < 100)
    .sort((a, b) => a.percent - b.percent || b.total - a.total)
    .slice(0, 5);
  return {
    count: exams.length,
    questions: items.length,
    average: exams.length ? Math.round(exams.reduce((a, e) => a + e.percent, 0) / exams.length) : 0,
    best: exams.reduce((a, e) => Math.max(a, e.percent), 0),
    bySection: Object.fromEntries(Object.entries(bySection).map(([k, g]) => [k, pct(g)])),
    weakLessons,
  };
}

export function formatDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// Mô tả thời gian bằng chữ cho trình đọc màn hình: "12 phút 5 giây"
export function spokenDuration(seconds) {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  return m ? `${m} phút ${s % 60} giây` : `${s} giây`;
}
