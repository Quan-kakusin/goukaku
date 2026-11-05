// Ôn lặp lại ngắt quãng (kiểu Leitner) cho kanji. Hàm thuần: nhận và trả về dữ liệu, không đụng localStorage.
// Mỗi mục: { box: 1..5, due: mốc thời gian cần ôn, ok, ng }. Mục chưa từng học thì chưa có trong sổ.
// Đúng khi đã đến hạn (hoặc mục mới) thì lên một hộp; sai thì về hộp 1 và ôn lại ngay. Làm đúng sớm hơn hạn không được tính lên hộp.

export const DAY = 24 * 60 * 60 * 1000;
export const INTERVAL_DAYS = [1, 3, 7, 14, 30]; // khoảng cách ôn của hộp 1..5
export const MAX_BOX = INTERVAL_DAYS.length;

export function applyResult(book, key, correct, now = Date.now()) {
  const cur = book[key];
  const next = { ...book };
  if (!correct) {
    next[key] = { box: 1, due: now, ok: cur?.ok ?? 0, ng: (cur?.ng ?? 0) + 1 };
  } else if (!cur || cur.due <= now) {
    const box = Math.min((cur?.box ?? 0) + 1, MAX_BOX);
    next[key] = { box, due: now + INTERVAL_DAYS[box - 1] * DAY, ok: (cur?.ok ?? 0) + 1, ng: cur?.ng ?? 0 };
  } else {
    next[key] = { ...cur, ok: cur.ok + 1 };
  }
  return next;
}

// Các mục đến hạn, cũ nhất (quá hạn lâu nhất) trước
export const dueKeys = (book, now = Date.now()) =>
  Object.entries(book)
    .filter(([, v]) => v.due <= now)
    .sort(([, a], [, b]) => a.due - b.due)
    .map(([k]) => k);

// Mục chưa học, giữ nguyên thứ tự của allKeys
export const newKeys = (book, allKeys) => allKeys.filter(k => !book[k]);

export function summary(book, allKeys, now = Date.now()) {
  const known = allKeys.filter(k => book[k]);
  const byBox = Array.from({ length: MAX_BOX }, (_, i) => known.filter(k => book[k].box === i + 1).length);
  return {
    total: allKeys.length,
    learned: known.length,
    fresh: allKeys.length - known.length,
    due: known.filter(k => book[k].due <= now).length,
    byBox,
    mastered: byBox[MAX_BOX - 1],
  };
}
