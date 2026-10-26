// Luyện từ vựng (thẻ flash, gõ romaji): chọn từ và chấm điểm. Hàm thuần, không đụng DOM/storage.
// Chỉ nằm trong một lượt luyện: app không theo dõi từng từ về lâu dài.

import { shuffle } from './questions.js';
import { matchesWord } from './romaji.js';

// Chọn từ để luyện: lọc theo bài, bỏ từ trùng cách đọc (gõ romaji sẽ không phân biệt được), xáo trộn rồi lấy `count` từ
// shuffle=false: giữ thứ tự trong sách (theo bài, theo thứ tự từ trong bài)
export function pickWords({ deck, lessons, count, rng, shuffle: mix = true }) {
  const inScope = new Set(lessons);
  const seen = new Set();
  const pool = deck.filter(w => {
    if (!inScope.has(w.lesson) || seen.has(w.kana)) return false;
    seen.add(w.kana);
    return true;
  });
  const ordered = mix ? shuffle(pool, rng) : pool;
  return count === 'all' ? ordered : ordered.slice(0, Number(count));
}

export const poolSize = (deck, lessons) => pickWords({ deck, lessons, count: 'all', rng: () => 0 }).length;

// ---- Thẻ flash: mỗi thẻ "nhớ" hoặc "chưa nhớ" ----
export function scoreFlash(results) {
  const total = results.length;
  const known = results.filter(r => r.known).length;
  return { total, known, unknown: total - known, percent: total ? Math.round((100 * known) / total) : 0 };
}

// ---- Gõ romaji ----
// outcome: 'first' (đúng ngay lần đầu) · 'retry' (đúng sau khi gõ lại) · 'skipped' (bỏ qua) · 'revealed' (xem đáp án)
export const POINTS = { first: 1, retry: 0.5, skipped: 0, revealed: 0 };

export const isCorrect = (input, word) => matchesWord(input, word);

export function scoreTyping(results) {
  const total = results.length;
  const count = o => results.filter(r => r.outcome === o).length;
  const points = results.reduce((a, r) => a + POINTS[r.outcome], 0);
  return {
    total,
    first: count('first'),
    retry: count('retry'),
    skipped: count('skipped'),
    revealed: count('revealed'),
    points,
    percent: total ? Math.round((100 * points) / total) : 0,
  };
}

// Nhãn các bài đã chọn, gộp dãy liền nhau: [1,2,3,5] → "Bài 1–3, 5"; một bài → "Bài 5"; đủ 25 bài → "Tất cả 25 bài"
export function lessonsLabel(lessons, total = 25) {
  const nums = [...new Set(lessons.filter(n => n >= 1))].sort((a, b) => a - b);
  if (nums.length === total) return `Tất cả ${total} bài`;
  const parts = [];
  for (let i = 0; i < nums.length; ) {
    let j = i;
    while (nums[j + 1] === nums[j] + 1) j += 1;
    parts.push(j - i >= 2 ? `${nums[i]}–${nums[j]}` : nums.slice(i, j + 1).join(', '));
    i = j + 1;
  }
  return nums.length ? `Bài ${parts.join(', ')}` : 'Chưa chọn bài';
}
