// Danh mục bài tập của một bài cho trang Bài tập: mỗi dạng bài là một danh sách id câu hỏi (dựng lại được bằng resolveQuestion).
// Hàm thuần, không đụng DOM/storage.

import { GRAMMAR, getLesson } from '../data/lessons.js';
import { EX_GROUPS, EX_KINDS, lessonExercises } from './exercises.js';
import { vocabQuestion, wordQuestion, shuffle } from './questions.js';
import { lessonWords } from './deck.js';

const VOCAB_KINDS = {
  meaning: { title: 'Chọn nghĩa của từ', desc: 'Cho từ tiếng Nhật, chọn nghĩa tiếng Việt đúng.' },
  word: { title: 'Chọn từ theo nghĩa', desc: 'Cho nghĩa tiếng Việt, chọn từ tiếng Nhật đúng.' },
};

// Kết quả: [{ id: nhóm, title, desc, kinds: [{ kind, title, desc, ids }] }], bỏ nhóm và dạng không có câu nào.
// deck: bộ từ đang dùng (gồm từ người dùng tự thêm). rng chỉ dùng để thử dựng câu từ vựng, id không phụ thuộc rng.
export function exerciseCatalog(n, deck, rng = () => 0.5) {
  const words = lessonWords(deck, n);
  const by = lessonExercises(n);
  const fromBook = getLesson(n).grammar.flatMap(p => p.quiz.map(q => `g:${q.id}`));
  const kinds = {
    meaning: words.filter(w => vocabQuestion(w, deck, rng)).map(w => `v:${w.id}`),
    word: words.filter(w => wordQuestion(w, deck, rng)).map(w => `w:${w.id}`),
    ...Object.fromEntries(Object.keys(EX_KINDS).map(k => [k, (by[k] ?? []).map(q => q.id)])),
  };
  const meta = k => (VOCAB_KINDS[k] ? { ...VOCAB_KINDS[k], group: 'vocab' } : EX_KINDS[k]);
  const groups = EX_GROUPS.map(g => ({
    ...g,
    kinds: Object.entries(kinds)
      .filter(([k, ids]) => meta(k)?.group === g.id && ids.length > 0)
      .map(([k, ids]) => ({ kind: k, title: meta(k).title, desc: meta(k).desc, ids })),
  }));
  if (fromBook.length) groups.push({ id: 'book', title: 'Câu hỏi trong sách', desc: 'Các câu hỏi ngữ pháp viết tay cho từng mẫu câu của bài.', kinds: [{ kind: 'grammar', title: 'Điền chỗ trống theo mẫu câu', desc: 'Chọn từ hoặc trợ từ đúng để hoàn thành câu theo mẫu ngữ pháp.', ids: fromBook }] });
  return groups.filter(g => g.kinds.length > 0);
}

// Mọi id của một mẫu ngữ pháp (bài tập sinh ra từ mẫu đó cộng với câu hỏi viết tay)
export function patternIds(n, patternId) {
  const p = GRAMMAR.find(x => x.id === patternId);
  const ids = Object.values(lessonExercises(n)).flat().filter(q => q.ref?.patternId === patternId).map(q => q.id);
  return [...(p ? p.quiz.map(q => `g:${q.id}`) : []), ...ids];
}

export const allIds = groups => groups.flatMap(g => g.kinds.flatMap(k => k.ids));

// Chọn ngẫu nhiên count id (không trùng). count lớn hơn số có sẵn thì lấy hết.
export const pickIds = (ids, count, rng = Math.random) => shuffle(ids, rng).slice(0, count);

// Trộn nhiều dạng: lấy lần lượt từng dạng một (thứ tự dạng xáo trộn) cho tới đủ count, rồi xáo thứ tự câu.
export function mixIds(groups, count, rng = Math.random) {
  const lists = shuffle(groups.flatMap(g => g.kinds.map(k => shuffle(k.ids, rng))), rng);
  const out = [];
  for (let i = 0; out.length < count && lists.some(l => i < l.length); i += 1) {
    for (const l of lists) if (i < l.length && out.length < count) out.push(l[i]);
  }
  return shuffle(out, rng);
}

// Bản gọn cho trang Bài tập: gộp các dạng thành vài mục dễ hiểu để người học không bị rối. Mỗi mục là danh sách id và các dạng bên trong.
const PRESETS = [
  { id: 'vocab', title: 'Từ vựng', desc: 'Chọn nghĩa của từ, chọn từ theo nghĩa, điền từ vào câu.', kinds: ['meaning', 'word', 'cloze'] },
  { id: 'right', title: 'Chọn câu đúng', desc: 'Chọn câu, trợ từ hoặc cách nói đúng theo ngữ pháp của bài.', kinds: ['correct', 'wrongone', 'vi2jp', 'jp2vi', 'particle', 'grammar'] },
  { id: 'order', title: 'Sắp xếp câu', desc: 'Chọn thứ tự đúng của các cụm từ để thành câu.', kinds: ['order'] },
  { id: 'formula', title: 'Công thức', desc: 'Nhớ công thức, ý nghĩa và các bảng của mẫu câu.', kinds: ['formula', 'usage', 'table', 'role'] },
];

// Kết quả: [{ id, title, desc, ids, parts: [danh sách id theo từng dạng bên trong] }], bỏ mục không có câu nào
export function exerciseSummary(n, deck, rng) {
  const byKind = Object.fromEntries(exerciseCatalog(n, deck, rng).flatMap(g => g.kinds.map(k => [k.kind, k.ids])));
  return PRESETS.map(p => {
    const parts = p.kinds.map(k => byKind[k] ?? []).filter(ids => ids.length > 0);
    return { id: p.id, title: p.title, desc: p.desc, parts, ids: parts.flat() };
  }).filter(p => p.ids.length > 0);
}

// Chọn count câu từ một mục: lấy đều giữa các dạng bên trong để câu hỏi đa dạng
export const pickFromPreset = (preset, count, rng = Math.random) => mixIds([{ kinds: preset.parts.map(ids => ({ ids })) }], count, rng);

// Luyện tổng hợp: lấy đều giữa các mục
export const mixPresets = (presets, count, rng = Math.random) => mixIds([{ kinds: presets.map(p => ({ ids: p.ids })) }], count, rng);
