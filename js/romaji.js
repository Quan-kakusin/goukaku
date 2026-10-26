import { ROMAJI, toHiragana } from './kana-data.js';

const SMALL = 'ゃゅょ';
// Âm ngoại lai trong katakana: chữ + kana nhỏ ぁぃぅぇぉ (ティ → ti, フォ → fo). Không có thì ふぉ bị đọc thành "fuo".
const FOREIGN = {
  てぃ: 'ti', でぃ: 'di', とぅ: 'tu', どぅ: 'du', ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo',
  うぃ: 'wi', うぇ: 'we', うぉ: 'wo', じぇ: 'je', しぇ: 'she', ちぇ: 'che', ゔぁ: 'va', ゔぃ: 'vi', ゔぇ: 've', ゔぉ: 'vo',
  つぁ: 'tsa', つぃ: 'tsi', つぇ: 'tse', つぉ: 'tso', くぁ: 'kwa', ぐぁ: 'gwa', いぇ: 'ye',
};

function readToken(chars, i) {
  const next = chars[i + 1];
  if (next && FOREIGN[chars[i] + next]) return { r: FOREIGN[chars[i] + next], len: 2 };
  if (next && SMALL.includes(next) && ROMAJI[chars[i] + next]) {
    return { r: ROMAJI[chars[i] + next], len: 2 };
  }
  if (ROMAJI[chars[i]]) return { r: ROMAJI[chars[i]], len: 1 };
  return null;
}

// Kana (hiragana hoặc katakana) sang romaji kiểu Hepburn. Ký tự khác giữ nguyên.
export function toRomaji(text) {
  const chars = [...toHiragana(text)];
  let out = '';
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    if (ch === 'っ') {
      const t = readToken(chars, i + 1);
      if (t && /^[a-z]/.test(t.r)) out += t.r.startsWith('ch') ? 't' : t.r[0];
      i += 1;
    } else if (ch === 'ー') {
      out += /[aiueo]$/.test(out) ? out.slice(-1) : '';
      i += 1;
    } else {
      const t = readToken(chars, i);
      out += t ? t.r : ch;
      i += t ? t.len : 1;
    }
  }
  return out;
}

// Quy các cách gõ khác nhau (si/shi, tya/cha...) về một dạng để so sánh
const EQUIV = [
  [/sya/g, 'sha'], [/syu/g, 'shu'], [/syo/g, 'sho'],
  [/tya/g, 'cha'], [/tyu/g, 'chu'], [/tyo/g, 'cho'],
  [/cya/g, 'cha'], [/cyu/g, 'chu'], [/cyo/g, 'cho'],
  [/zya/g, 'ja'], [/zyu/g, 'ju'], [/zyo/g, 'jo'],
  [/jya/g, 'ja'], [/jyu/g, 'ju'], [/jyo/g, 'jo'],
  [/si/g, 'shi'], [/ti/g, 'chi'], [/tu/g, 'tsu'], [/hu/g, 'fu'], [/zi/g, 'ji'], [/di/g, 'ji'],
];
const MACRON = { ā: 'aa', ī: 'ii', ū: 'uu', ē: 'ee', ō: 'ou' };

// lenient: bỏ qua độ dài nguyên âm (kyou = kyo = kyō)
export function canon(s, { lenient = false } = {}) {
  let r = s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[āīūēō]/g, c => MACRON[c])
    .replace(/[\s'’\-.,]/g, '');
  for (const [re, to] of EQUIV) r = r.replace(re, to);
  if (lenient) r = r.replace(/ou|oo/g, 'o').replace(/uu/g, 'u').replace(/aa/g, 'a').replace(/ii/g, 'i').replace(/ee/g, 'e');
  return r;
}

export function matchesRomaji(input, expected, { alts = [], lenient = false } = {}) {
  const a = canon(input, { lenient });
  return a !== '' && [expected, ...alts].some(e => canon(e, { lenient }) === a);
}

// Romaji của một từ: ưu tiên trường romaji ghi tay (cho trường hợp は đọc là "wa"), không thì sinh từ kana
export const romajiOf = w => w.romaji ?? toRomaji(w.kana);

// Đáp án từ vựng đúng nếu gõ đúng chữ, cách đọc kana (hiragana/katakana) hoặc romaji
// Kana được so theo hiragana nên gõ ほてる cho ホテル vẫn đúng; kéo dài nguyên âm (こおひい ↔ こーひー) được châm chước.
export function matchesWord(input, w) {
  const t = input.trim();
  if (!t) return false;
  if (t === w.word || t === w.kana || toHiragana(t.replace(/\s/g, '')) === toHiragana(w.kana)) return true;
  if (matchesRomaji(t, romajiOf(w), { lenient: true })) return true;
  return /[぀-ヿ]/.test(t) && matchesRomaji(toRomaji(t), romajiOf(w), { lenient: true });
}
