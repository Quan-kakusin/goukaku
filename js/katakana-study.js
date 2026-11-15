// Học 59 từ katakana hay gặp trong đề N5 theo ôn lặp lại (cùng sổ và cùng quy tắc với kanji: js/srs.js, js/kanji-study.js).
// Mục: 'kk:<katakana>'. Mỗi mục được hỏi xen kẽ hai dạng: nhìn katakana chọn nghĩa, và nhìn nghĩa chọn katakana.

import { KATAKANA } from '../data/katakana-n5.js';
import { KATA_BY_KANA, kataMeaningQuestion, kataWordQuestion, shuffle } from './questions.js';
import { dueKeys, newKeys, summary } from './srs.js';
import { getState } from './storage.js';

export const ALL_KEYS = KATAKANA.map(k => `kk:${k.kana}`);

export const srsSummary = (now = Date.now()) => summary(getState().srs, ALL_KEYS, now);

export function questionOfKey(key, rng = Math.random) {
  const k = KATA_BY_KANA.get(key.slice(3));
  if (!k) return null;
  return rng() < 0.5 ? kataMeaningQuestion(k, rng) : kataWordQuestion(k, rng);
}

// Lượt ôn: tối đa maxDue mục đến hạn (cũ nhất trước) cộng newCount mục mới theo thứ tự trong danh sách
export function buildSession({ book = getState().srs, newCount = 10, maxDue = 20, now = Date.now() } = {}) {
  const due = dueKeys(book, now).filter(k => k.startsWith('kk:')).slice(0, maxDue);
  const fresh = newKeys(book, ALL_KEYS).slice(0, newCount);
  return { due, fresh, keys: [...due, ...fresh] };
}

export function sessionQuestions(keys, rng = Math.random) {
  return shuffle(keys, rng).map(k => questionOfKey(k, rng)).filter(Boolean);
}
