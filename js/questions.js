// Sinh câu hỏi trắc nghiệm từ dữ liệu. Không đụng tới storage/DOM nên test được với rng cố định.
//
// Câu hỏi: { id, type, kind, prompt, hint, choices, answer, explain, tag, lesson?, promptLang?, choiceLang?, ref }
//   type = phần của đề: 'vocab' | 'grammar' | 'kanji' | 'moji' | 'bunpou' | 'dokkai' | 'choukai' (bốn loại cuối là đề thi thử N5).   kind = dạng câu hỏi (xem KINDS).
//   ref  = nơi tra lại kiến thức liên quan khi giải thích: { patternId } | { wordId } | { word }.
// id ổn định để sổ lỗi sai và lịch sử đề dựng lại được câu hỏi:
//   'v:<id từ>' chọn nghĩa · 'w:<id từ>' chọn từ theo nghĩa · 'g:<id câu>' ngữ pháp · 'k:<từ>' kanji · 'j:<đề>:<mục>-<số>' đề thi thử N5.

import { GRAMMAR } from '../data/lessons.js';
import { KANJI } from '../data/kanji-n5.js';
import { findMockQuestion } from './mock.js';

export const SECTIONS = {
  vocab: 'Từ vựng',
  grammar: 'Ngữ pháp',
  kanji: 'Kanji',
  moji: 'N5 · Chữ・Từ vựng',
  bunpou: 'N5 · Ngữ pháp',
  dokkai: 'N5 · Đọc hiểu',
  choukai: 'N5 · Nghe hiểu',
};

export const KINDS = {
  meaning: { section: 'vocab', label: 'Từ vựng: chọn nghĩa', short: 'Chọn nghĩa' },
  reading: { section: 'vocab', label: 'Từ vựng: chọn cách đọc', short: 'Chọn cách đọc' },
  word: { section: 'vocab', label: 'Từ vựng: chọn từ theo nghĩa', short: 'Chọn từ' },
  grammar: { section: 'grammar', label: 'Ngữ pháp: điền chỗ trống', short: 'Điền chỗ trống' },
  kanji: { section: 'kanji', label: 'Kanji: đọc từ', short: 'Đọc kanji' },
  // Đề thi thử N5 đầy đủ (js/mock.js)
  moji: { section: 'moji', label: 'Thi thử N5: 文字・語彙', short: '文字・語彙' },
  bunpou: { section: 'bunpou', label: 'Thi thử N5: 文法', short: '文法' },
  dokkai: { section: 'dokkai', label: 'Thi thử N5: 読解', short: '読解' },
  choukai: { section: 'choukai', label: 'Thi thử N5: 聴解', short: '聴解' },
};

export const TYPE_LABEL = SECTIONS;

export function shuffle(arr, rng = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const pickN = (arr, n, rng) => shuffle(arr, rng).slice(0, n);

const firstUnique = (items, key, n) => {
  const seen = new Set();
  const out = [];
  for (const it of items) {
    if (seen.has(key(it))) continue;
    seen.add(key(it));
    out.push(it);
    if (out.length === n) break;
  }
  return out;
};

const len = s => [...s].length;

// ---- Ngữ pháp ----
const grammarIndex = new Map(GRAMMAR.flatMap(p => p.quiz.map(qz => [qz.id, { qz, pattern: p }])));

export function grammarQuestion(quizId, rng) {
  const hit = grammarIndex.get(quizId);
  if (!hit) return null;
  const { qz, pattern } = hit;
  return {
    id: `g:${qz.id}`,
    type: 'grammar',
    kind: 'grammar',
    prompt: qz.q,
    hint: qz.hint,
    choices: shuffle(qz.choices, rng),
    answer: qz.answer,
    explain: qz.explain,
    tag: pattern.title,
    lesson: pattern.lesson,
    promptLang: 'ja',
    choiceLang: 'ja',
    ref: { patternId: pattern.id },
  };
}

export const findPattern = id => GRAMMAR.find(p => p.id === id);

// ---- Kanji: chọn cách đọc đúng của một từ ----
export const KANJI_WORDS = firstUnique(
  KANJI.flatMap(k => k.words.map(w => ({ ...w, kanji: k.char, group: k.group }))),
  w => w.word,
  Infinity,
);

export function kanjiQuestion(kw, rng) {
  const n = len(kw.kana);
  const pool = shuffle(KANJI_WORDS.filter(x => x.kana !== kw.kana), rng);
  // Ưu tiên cách đọc có độ dài gần đáp án để các lựa chọn dễ nhầm
  const near = pool.filter(x => Math.abs(len(x.kana) - n) <= 1);
  const wrong = firstUnique([...near, ...pool], x => x.kana, 3).map(x => x.kana);
  return {
    id: `k:${kw.word}`,
    type: 'kanji',
    kind: 'kanji',
    prompt: kw.word,
    hint: 'Chọn cách đọc đúng',
    choices: shuffle([kw.kana, ...wrong], rng),
    answer: kw.kana,
    explain: `${kw.word} đọc là ${kw.kana}, nghĩa là "${kw.vi}".`,
    tag: 'Kanji',
    promptLang: 'ja',
    choiceLang: 'ja',
    ref: { word: kw.word },
  };
}

// ---- Từ vựng ----
// Đáp án nhiễu ưu tiên cùng bài để dễ nhầm hơn; loại các từ trùng nghĩa với đáp án.
function distractorWords(w, deck, rng, filter) {
  const others = deck.filter(x => x.id !== w.id && x.vi !== w.vi && filter(x));
  const same = shuffle(others.filter(x => x.lesson === w.lesson), rng);
  const rest = shuffle(others.filter(x => x.lesson !== w.lesson), rng);
  return [...same, ...rest];
}

// Chọn nghĩa đúng của từ. Bài học chỉ có kana nên từ đồng âm (はし: đũa / cầu) không hỏi được: trả về null.
export function vocabQuestion(w, deck, rng) {
  if (deck.some(x => x.id !== w.id && x.kana === w.kana)) return null;
  const wrong = firstUnique(distractorWords(w, deck, rng, () => true), x => x.vi, 3).map(x => x.vi);
  return {
    id: `v:${w.id}`,
    type: 'vocab',
    kind: 'meaning',
    prompt: w.word,
    hint: w.word === w.kana ? 'Chọn nghĩa đúng' : `Chọn nghĩa đúng (đọc: ${w.kana})`,
    choices: shuffle([w.vi, ...wrong], rng),
    answer: w.vi,
    explain: `${w.word} (${w.kana}) nghĩa là "${w.vi}".${w.ex ? ` Ví dụ: ${w.ex} (${w.exVi})` : ''}`,
    tag: 'Từ vựng',
    lesson: w.lesson || undefined,
    promptLang: 'ja',
    ref: { wordId: w.id },
  };
}

// Chọn từ tiếng Nhật đúng theo nghĩa tiếng Việt
export function wordQuestion(w, deck, rng) {
  const wrong = firstUnique(distractorWords(w, deck, rng, x => x.word !== w.word), x => x.word, 3).map(x => x.word);
  if (wrong.length < 3) return null;
  return {
    id: `w:${w.id}`,
    type: 'vocab',
    kind: 'word',
    prompt: w.vi,
    hint: 'Chọn từ tiếng Nhật đúng',
    choices: shuffle([w.word, ...wrong], rng),
    answer: w.word,
    explain: `"${w.vi}" là ${w.word}${w.word === w.kana ? '' : ` (${w.kana})`}.`,
    tag: 'Chọn từ',
    lesson: w.lesson || undefined,
    choiceLang: 'ja',
    ref: { wordId: w.id },
  };
}

// Dựng lại câu hỏi từ id lưu trong sổ lỗi / lịch sử đề. Trả về null nếu dữ liệu nguồn không còn (vd từ riêng đã xóa).
export function resolveQuestion(id, { deck = [], rng } = {}) {
  const sep = id.indexOf(':');
  const kind = id.slice(0, sep);
  const key = id.slice(sep + 1);
  if (kind === 'g') return grammarQuestion(key, rng);
  if (kind === 'j') return findMockQuestion(id);
  if (kind === 'k') {
    const kw = KANJI_WORDS.find(x => x.word === key);
    return kw ? kanjiQuestion(kw, rng) : null;
  }
  const w = deck.find(x => x.id === key);
  if (!w) return null;
  if (kind === 'v') return vocabQuestion(w, deck, rng);
  if (kind === 'w') return wordQuestion(w, deck, rng);
  return null;
}

// Giải thích vì sao một lựa chọn (đáp án nhiễu) thuộc về từ khác, để người học thấy mình nhầm với gì.
// words: mọi từ (kể cả từ gợi ý đang ẩn). Trả về null nếu không có gì để nói.
export function choiceNote(q, text, words) {
  const show = w => `${w.word}${w.word === w.kana ? '' : ` (${w.kana})`}`;
  if (q.kind === 'meaning') {
    const w = words.find(x => x.vi === text);
    return w ? `"${text}" là nghĩa của ${show(w)}.` : null;
  }
  if (q.kind === 'word') {
    const w = words.find(x => x.word === text);
    return w ? `${show(w)} nghĩa là "${w.vi}".` : null;
  }
  if (q.kind === 'kanji') {
    const kw = KANJI_WORDS.find(x => x.kana === text);
    return kw ? `${text} là cách đọc của ${kw.word}, nghĩa là "${kw.vi}".` : null;
  }
  return null;
}
