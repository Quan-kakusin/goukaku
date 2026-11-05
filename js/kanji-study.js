// Học kanji theo ôn lặp lại: gom mục kanji (từ và chữ) đến hạn + mục mới thành một đề, và ghi kết quả vào sổ (js/srs.js).
// Mục: 'kw:<từ>' (từ kanji: hỏi cách đọc hoặc chọn chữ Hán) · 'kc:<chữ>' (một chữ Hán: Hán Việt → chữ).

import { KANJI } from '../data/kanji-n5.js';
import { KANJI_WORDS, KANJI_BY_CHAR, kanjiQuestion, kanjiPickQuestion, kanjiHvQuestion, shuffle } from './questions.js';
import { applyResult, dueKeys, newKeys, summary } from './srs.js';
import { getState, save } from './storage.js';

// Mọi mục theo thứ tự học: mỗi chữ rồi tới các từ ví dụ của nó
export const ALL_KEYS = KANJI.flatMap(k => [`kc:${k.char}`, ...KANJI_WORDS.filter(w => w.kanji === k.char).map(w => `kw:${w.word}`)]);

// id câu hỏi → mục SRS (null nếu không phải câu kanji)
export function keyOfQuestion(qid) {
  const sep = qid.indexOf(':');
  const kind = qid.slice(0, sep);
  const rest = qid.slice(sep + 1);
  if (kind === 'k' || kind === 'p') return `kw:${rest}`;
  if (kind === 'h') return `kc:${rest}`;
  return null;
}

export function recordKey(key, correct, now = Date.now()) {
  if (!key) return;
  const s = getState();
  s.srs = applyResult(s.srs, key, correct, now);
  save();
}

export const recordQuestion = (qid, correct) => recordKey(keyOfQuestion(qid), correct);

export const srsSummary = (now = Date.now()) => summary(getState().srs, ALL_KEYS, now);

// Dựng câu hỏi cho một mục. Từ kanji xen kẽ hai dạng: chọn cách đọc và chọn chữ Hán.
export function questionOfKey(key, rng = Math.random) {
  const rest = key.slice(3);
  if (key.startsWith('kc:')) {
    const k = KANJI_BY_CHAR.get(rest);
    return k ? kanjiHvQuestion(k, rng) : null;
  }
  const w = KANJI_WORDS.find(x => x.word === rest);
  if (!w) return null;
  return rng() < 0.5 ? kanjiQuestion(w, rng) : kanjiPickQuestion(w, rng);
}

// Danh sách mục cho một lượt ôn: tối đa maxDue mục đến hạn (cũ nhất trước) cộng newCount mục mới theo thứ tự học
export function buildSession({ book = getState().srs, newCount = 5, maxDue = 20, now = Date.now() } = {}) {
  const due = dueKeys(book, now).slice(0, maxDue);
  const fresh = newKeys(book, ALL_KEYS).slice(0, newCount);
  return { due, fresh, keys: [...due, ...fresh] };
}

export function sessionQuestions(keys, rng = Math.random) {
  return shuffle(keys, rng).map(k => questionOfKey(k, rng)).filter(Boolean);
}
