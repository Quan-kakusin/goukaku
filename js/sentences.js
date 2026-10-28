// Câu ví dụ của bài để luyện gõ romaji: mỗi câu thành một "từ" có thể đưa vào phiên gõ (cùng dạng với từ vựng).
// Chỉ lấy câu một mệnh đề, toàn kana, đủ ngắn để gõ. Hàm thuần, không đụng DOM/storage.

import { lessonSentences } from './exercises.js';
import { shuffle } from './questions.js';

const STRIP = /[。、，．？！\s]/g;
const KANA_ONLY = /^[ぁ-ゖァ-ヺー]+$/;
const MAX_CHARS = 36;
// Trợ từ viết khác cách đọc: người gõ theo cách đọc (わ, え, お) vẫn đúng
const SOUND = { は: 'わ', へ: 'え', を: 'お' };

// Mọi cách viết chấp nhận được của câu: mỗi cụm kết thúc bằng は/へ/を thì cho phép gõ theo cách đọc
export function spellings(jp) {
  const tokens = jp.split(/\s+/).map(t => t.replace(STRIP, ''));
  let variants = [''];
  for (const tok of tokens) {
    const last = tok.slice(-1);
    const alt = SOUND[last] ? tok.slice(0, -1) + SOUND[last] : null;
    variants = variants.flatMap(v => (alt && variants.length < 16 ? [v + tok, v + alt] : [v + tok]));
  }
  return [...new Set(variants)];
}

export function sentenceWord(n, s) {
  const [kana, ...alts] = spellings(s.jp);
  return { id: `s:${n}:${kana}`, lesson: n, sentence: true, word: s.jp, kana, kanji: s.jp, vi: s.vi, ...(alts.length && { alts }) };
}

function usable(s) {
  if (s.jp.includes('…')) return false;
  const kana = s.jp.replace(STRIP, '');
  return KANA_ONLY.test(kana) && [...kana].length <= MAX_CHARS && s.jp.split(/\s+/).length >= 2;
}

export function sentencePool(lessons) {
  const nums = lessons.filter(n => n >= 1);
  return nums.flatMap(n => lessonSentences(n).filter(usable).map(s => sentenceWord(n, s)));
}

export const sentenceCount = lessons => sentencePool(lessons).length;

export function pickSentences(lessons, mix = true, rng = Math.random) {
  const pool = sentencePool(lessons);
  return mix ? shuffle(pool, rng) : pool;
}
