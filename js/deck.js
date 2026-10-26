import { VOCAB, LESSONS } from '../data/lessons.js';
import { getState } from './storage.js';

// Bài học chỉ hiển thị kana, nên từ người dùng tự thêm (có thể nhập bằng kanji) cũng được đổi sang cách đọc
const asKana = w => (w.word === w.kana ? { ...w, kanji: w.word } : { ...w, kanji: w.word, word: w.kana });

// Bộ từ đang dùng: từ gợi ý có sẵn (trừ những bài đã chọn ẩn) cộng với từ người dùng tự thêm
export function getDeck() {
  const s = getState();
  return [...VOCAB.filter(w => !s.settings.hideSuggested[w.lesson]), ...s.custom.map(asKana)];
}

// Mọi từ kể cả từ gợi ý đang bị ẩn: dùng để tra theo id, để thẻ và sổ lỗi sai cũ không bị mất nguồn
export const getAllWords = () => [...VOCAB, ...getState().custom.map(asKana)];

export const lessonWords = (deck, n) => deck.filter(w => w.lesson === n);
export const lessonTitle = n => (n ? `Bài ${n}` : 'Ngoài sách');
