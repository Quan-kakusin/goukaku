// Toàn bộ dữ liệu của người học nằm trong localStorage, dưới một khóa duy nhất.
// Mỗi địa chỉ (cả cổng) là một origin riêng, nên luôn mở app ở cùng một địa chỉ.

import { LESSON_COUNT } from '../data/lessons.js';

const KEY = 'nihongo-n5:v1';
export const QUESTION_TYPES = ['vocab', 'kanji', 'grammar', 'moji', 'bunpou', 'dokkai', 'choukai'];
export const MAX_EXAMS = 40;
const MAX_ITEMS = 200;

const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const num = v => typeof v === 'number' && Number.isFinite(v);
const text = v => (typeof v === 'string' ? v : '');
const entries = o => Object.entries(o).filter(([k]) => k !== '__proto__');
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lessonNo = v => (Number.isInteger(v) && v >= 0 && v <= LESSON_COUNT ? v : 0); // 0 = chưa xếp vào bài
const validLesson = key => {
  const n = Number(key);
  return Number.isInteger(n) && n >= 1 && n <= LESSON_COUNT ? n : null;
};

export const defaults = () => ({
  version: 1,
  custom: [], // từ người dùng tự thêm: { id, word, kana, vi, ex, exVi, lesson }
  kana: {}, // ký tự → { ok, ng }: kana nào hay sai thì được hỏi nhiều hơn
  mistakes: {}, // id câu hỏi → { type, wrong, streak, last } — xem js/mistakes.js
  lessons: {}, // số bài → { best, last, attempts, at }: điểm đề của đúng bài đó
  exams: [], // lịch sử làm đề, mới nhất trước — xem normalizeExam
  settings: { hideSuggested: {} },
});

function normalizeItem(it) {
  if (!isObj(it) || typeof it.qid !== 'string' || !QUESTION_TYPES.includes(it.section) || typeof it.kind !== 'string') return null;
  if (!Array.isArray(it.choices) || !it.choices.every(c => typeof c === 'string')) return null;
  if (!(it.chosen === null || typeof it.chosen === 'string') || typeof it.ok !== 'boolean') return null;
  return {
    qid: it.qid,
    kind: it.kind,
    section: it.section,
    lesson: lessonNo(it.lesson),
    choices: it.choices.slice(0, 8),
    chosen: it.chosen,
    ok: it.ok,
    flagged: it.flagged === true,
  };
}

// Một lần làm đề. percent luôn tính lại từ các câu để không tin số liệu trong file nhập vào.
function normalizeExam(e) {
  if (!isObj(e) || typeof e.id !== 'string' || !e.id || !num(e.at) || !Array.isArray(e.items)) return null;
  const items = e.items.slice(0, MAX_ITEMS).map(normalizeItem).filter(Boolean);
  if (!items.length) return null;
  return {
    id: e.id,
    at: e.at,
    title: text(e.title).slice(0, 120) || 'Đề luyện tập',
    mode: e.mode === 'exam' ? 'exam' : 'practice',
    seconds: num(e.seconds) ? Math.max(0, Math.round(e.seconds)) : 0,
    limit: num(e.limit) && e.limit > 0 ? Math.round(e.limit) : null,
    percent: Math.round((100 * items.filter(i => i.ok).length) / items.length),
    ...(typeof e.paper === 'string' && e.paper && { paper: e.paper.slice(0, 40) }),
    items,
  };
}

// Kiểm tra và làm sạch dữ liệu (dùng cho cả lúc đọc localStorage lẫn khi nhập file).
// File sao lưu của các phiên bản trước (có thẻ nhớ, chuỗi ngày...) vẫn nhập được; phần không còn dùng bị bỏ qua.
export function normalize(raw) {
  if (!isObj(raw) || !Array.isArray(raw.custom)) {
    throw new Error('File không đúng định dạng dữ liệu của app.');
  }
  const out = defaults();

  out.custom = raw.custom
    .filter(w => isObj(w) && text(w.id) && text(w.word).trim() && text(w.kana).trim() && text(w.vi).trim())
    .map(w => ({
      id: w.id,
      word: w.word,
      kana: w.kana,
      vi: w.vi,
      ex: text(w.ex),
      exVi: text(w.exVi),
      lesson: lessonNo(w.lesson),
    }));

  if (isObj(raw.kana)) {
    for (const [ch, s] of entries(raw.kana)) {
      if (isObj(s) && num(s.ok) && num(s.ng)) out.kana[ch] = { ok: s.ok, ng: s.ng };
    }
  }

  if (isObj(raw.mistakes)) {
    for (const [id, m] of entries(raw.mistakes)) {
      if (isObj(m) && QUESTION_TYPES.includes(m.type) && num(m.wrong) && num(m.streak) && num(m.last)) {
        out.mistakes[id] = { type: m.type, wrong: m.wrong, streak: m.streak, last: m.last };
      }
    }
  }

  if (isObj(raw.lessons)) {
    for (const [key, s] of entries(raw.lessons)) {
      const n = validLesson(key);
      if (n && isObj(s) && num(s.best)) {
        const best = clamp(s.best, 0, 100);
        out.lessons[n] = {
          best,
          last: num(s.last) ? clamp(s.last, 0, 100) : best,
          attempts: num(s.attempts) ? Math.max(1, Math.round(s.attempts)) : 1,
          at: num(s.at) ? s.at : 0,
        };
      }
    }
  }

  if (Array.isArray(raw.exams)) {
    out.exams = raw.exams.map(normalizeExam).filter(Boolean).slice(0, MAX_EXAMS);
  }

  if (isObj(raw.settings)) {
    const { hideSuggested } = raw.settings;
    if (isObj(hideSuggested)) {
      for (const [key, on] of entries(hideSuggested)) {
        const n = validLesson(key);
        if (n && on === true) out.settings.hideSuggested[n] = true;
      }
    }
  }
  return out;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : defaults();
  } catch {
    return defaults();
  }
}

let state = load();
let warned = false;

export const getState = () => state;

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    return true;
  } catch {
    if (!warned && typeof window !== 'undefined') {
      warned = true;
      window.dispatchEvent(new Event('save-failed'));
    }
    return false;
  }
}

export function replaceState(raw) {
  state = normalize(raw);
  save();
}

export function resetState() {
  state = defaults();
  save();
}

// Điểm đề của một bài: giữ điểm cao nhất, đếm số lần làm
export function recordLessonScore(n, percent, now = Date.now()) {
  const prev = state.lessons[n];
  const pct = clamp(Math.round(percent), 0, 100);
  state.lessons[n] = { best: Math.max(prev?.best ?? 0, pct), last: pct, attempts: (prev?.attempts ?? 0) + 1, at: now };
}

// Thêm một lần làm đề vào lịch sử (mới nhất đứng đầu, giữ tối đa MAX_EXAMS)
export function addExam(entry) {
  const clean = normalizeExam(entry);
  if (!clean) throw new Error('Kết quả đề không hợp lệ, không lưu được.');
  state.exams = [clean, ...state.exams.filter(e => e.id !== clean.id)].slice(0, MAX_EXAMS);
  return clean;
}

export function clearExams() {
  state.exams = [];
}
