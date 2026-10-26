// Sổ lỗi sai: câu trả lời sai (từ vựng, kanji, ngữ pháp) tự vào sổ và được ôn lại.
// Một mục rời sổ sau RESOLVE_AFTER lần trả lời đúng liên tiếp; sai lại thì đếm lại từ đầu.

import { getState, save } from './storage.js';

export const RESOLVE_AFTER = 2;

// Hàm thuần: trả về sổ mới sau khi trả lời một câu, không sửa sổ cũ.
export function applyAnswer(book, { id, type }, correct, now = Date.now()) {
  const next = { ...book };
  const cur = next[id];
  if (!correct) {
    next[id] = { type, wrong: (cur?.wrong ?? 0) + 1, streak: 0, last: now };
  } else if (cur) {
    const streak = cur.streak + 1;
    if (streak >= RESOLVE_AFTER) delete next[id];
    else next[id] = { ...cur, streak, last: now };
  }
  return next;
}

// Các id cần ôn trước: sai nhiều nhất, rồi tới sai lâu nhất.
export function pickForReview(book, limit) {
  return Object.entries(book)
    .sort(([, a], [, b]) => b.wrong - a.wrong || a.last - b.last)
    .slice(0, limit)
    .map(([id]) => id);
}

export function recordAnswer(q, correct) {
  const s = getState();
  s.mistakes = applyAnswer(s.mistakes, q, correct);
  save();
}

export function removeMistake(id) {
  const s = getState();
  const { [id]: _removed, ...rest } = s.mistakes;
  s.mistakes = rest;
  save();
}

export const mistakeCount = () => Object.keys(getState().mistakes).length;
