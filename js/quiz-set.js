// Bộ câu trắc nghiệm đơn giản cho Kanji (80 chữ), Kanji hay thi (81 từ) và Katakana (59 từ): chọn số câu bất kỳ, hai chiều trộn lẫn, 4 đáp án.
// Kanji: mỗi chữ Hán ra đúng một câu, bằng một từ ví dụ của chữ đó. Nhìn kanji chọn cách đọc, hoặc nhìn cách đọc chọn kanji.
// Kanji hay thi: mỗi từ ra một câu, hai chiều như Kanji.
// Katakana: mỗi từ ra một câu. Nhìn katakana chọn nghĩa, hoặc nhìn nghĩa chọn katakana.

import { KANJI } from '../data/kanji-n5.js';
import { KATAKANA } from '../data/katakana-n5.js';
import { KANJI_THI } from '../data/kanji-thi.js';
import { KANJI_WORDS, kanjiQuestion, kanjiPickQuestion, kataMeaningQuestion, kataWordQuestion, thiReadingQuestion, thiPickQuestion, pickN, shuffle } from './questions.js';

// Số câu hợp lệ: số nguyên từ 1 tới total. Giá trị rác (rỗng, chữ) thì lấy fallback.
export function clampCount(value, total, fallback = 20) {
  const n = value === '' || value == null ? NaN : Math.floor(Number(value));
  return Math.min(total, Math.max(1, Number.isFinite(n) ? n : fallback));
}

// Mỗi chữ Hán một từ ví dụ khác nhau (từ có thể chứa nhiều chữ Hán, nên tránh hai chữ cùng ra một từ).
// Chữ không "sở hữu" từ nào (校 chỉ có trong 学校 của chữ 学) được chọn từ trước.
function wordFor(char, used, rng) {
  const all = KANJI_WORDS.filter(w => w.word.includes(char) && !used.has(w.word));
  const own = all.filter(w => w.kanji === char);
  const from = own.length ? own : all;
  return from.length ? from[Math.floor(rng() * from.length)] : null;
}

export function kanjiSet(count = KANJI.length, rng = Math.random) {
  const chars = pickN(KANJI, clampCount(count, KANJI.length), rng).map(k => k.char);
  const owned = c => KANJI_WORDS.some(w => w.kanji === c);
  const used = new Set();
  const words = [];
  for (const c of [...chars.filter(x => !owned(x)), ...chars.filter(owned)]) {
    const w = wordFor(c, used, rng);
    if (w) {
      used.add(w.word);
      words.push(w);
    }
  }
  return shuffle(words, rng).map(w => (rng() < 0.5 ? kanjiQuestion(w, rng) : kanjiPickQuestion(w, rng)));
}

export function thiSet(count = KANJI_THI.length, rng = Math.random) {
  return pickN(KANJI_THI, clampCount(count, KANJI_THI.length), rng).map(w => (rng() < 0.5 ? thiReadingQuestion(w, rng) : thiPickQuestion(w, rng)));
}

export function kataSet(count = KATAKANA.length, rng = Math.random) {
  return pickN(KATAKANA, clampCount(count, KATAKANA.length), rng).map(k => (rng() < 0.5 ? kataMeaningQuestion(k, rng) : kataWordQuestion(k, rng)));
}
