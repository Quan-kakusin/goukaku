import { toKatakana } from './kana-data.js';

// Gõ romaji, ô nhập tự đổi sang hiragana như bàn phím tiếng Nhật: "hoteru" → ほてる, "kyou" → きょう, "n" + phụ âm → ん, "-" → ー.
// Hàm thuần nên test được. Phần còn dở (vd "k", "sh", "n" ở cuối) giữ nguyên dạng chữ Latin cho tới khi gõ đủ.

const BASE = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', shi: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', chi: 'ち', tsu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', fu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', ji: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ', sha: 'しゃ', shu: 'しゅ', sho: 'しょ', cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ', hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ', mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ', gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ', ja: 'じゃ', ju: 'じゅ', jo: 'じょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ', pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
};
// Cách gõ khác của cùng một âm, và âm ngoại lai hay gặp ở từ katakana (ティ, ファ, チェ...)
const ALT = {
  si: 'し', ti: 'ち', tu: 'つ', hu: 'ふ', zi: 'じ', di: 'ぢ', du: 'づ', wi: 'うぃ', we: 'うぇ',
  sya: 'しゃ', syu: 'しゅ', syo: 'しょ', tya: 'ちゃ', tyu: 'ちゅ', tyo: 'ちょ', cya: 'ちゃ', cyu: 'ちゅ', cyo: 'ちょ',
  zya: 'じゃ', zyu: 'じゅ', zyo: 'じょ', jya: 'じゃ', jyu: 'じゅ', jyo: 'じょ',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ', je: 'じぇ', she: 'しぇ', che: 'ちぇ', thi: 'てぃ', dhi: 'でぃ',
  tsa: 'つぁ', tsi: 'つぃ', tse: 'つぇ', tso: 'つぉ', ye: 'いぇ', va: 'ゔぁ', vi: 'ゔぃ', vu: 'ゔ', ve: 'ゔぇ', vo: 'ゔぉ',
  xtu: 'っ', ltu: 'っ', xa: 'ぁ', xi: 'ぃ', xu: 'ぅ', xe: 'ぇ', xo: 'ぉ', xya: 'ゃ', xyu: 'ゅ', xyo: 'ょ',
};
const TABLE = { ...BASE, ...ALT };
const KEYS = Object.keys(TABLE);
const isPrefix = s => KEYS.some(k => k.startsWith(s));
const VOWEL = /[aiueo]/;
const LETTER = /[a-z]/;

// Đổi chuỗi đang gõ: trả về hiragana + phần Latin chưa đủ để đổi. Ký tự khác (kana sẵn có, số, dấu) giữ nguyên.
export function romajiToKana(raw) {
  const s = raw.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === '-') {
      out += 'ー';
      i += 1;
      continue;
    }
    if (!LETTER.test(ch)) {
      out += raw[i]; // kana/số/dấu cách: giữ nguyên
      i += 1;
      continue;
    }
    if (ch === 'n') {
      const next = s[i + 1];
      if (next === 'n') {
        // "nn": ん; nếu sau đó là nguyên âm/y thì n thứ hai là đầu âm tiết kế (konnichiha → こんにちは)
        const after = s[i + 2];
        out += 'ん';
        i += after && (VOWEL.test(after) || after === 'y') ? 1 : 2;
        continue;
      }
      if (next && !VOWEL.test(next) && next !== 'y' && LETTER.test(next)) {
        out += 'ん';
        i += 1;
        continue;
      }
      if (next === "'") {
        out += 'ん';
        i += 2;
        continue;
      }
    }
    // phụ âm đôi → っ (kk → っk, tch → っch)
    if (ch !== 'n' && !VOWEL.test(ch) && ((ch === s[i + 1]) || (ch === 't' && s[i + 1] === 'c' && s[i + 2] === 'h'))) {
      out += 'っ';
      i += 1;
      continue;
    }
    let matched = false;
    for (const len of [4, 3, 2, 1]) {
      const piece = s.slice(i, i + len);
      if (piece.length === len && TABLE[piece]) {
        out += TABLE[piece];
        i += len;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    const tail = s.slice(i);
    if (isPrefix(tail) || tail === 'n') {
      out += tail; // còn dở: giữ để gõ tiếp
      break;
    }
    out += raw[i]; // chuỗi không hợp lệ: giữ nguyên chữ vừa gõ
    i += 1;
  }
  return out;
}

// Khi kiểm tra đáp án: "n" còn dở ở cuối là ん, phần Latin còn lại không đổi được thì giữ nguyên (sẽ bị tính sai)
export const finalizeKana = text => romajiToKana(text).replace(/n$/, 'ん');

// Một lần gõ trong ô nhập: value là nội dung ô sau khi người dùng thao tác, prev là kết quả lần trước ({ raw, text }).
// raw là chuỗi romaji đã gõ (để "konnichiha" ra こんにちは: nn + nguyên âm thì n thứ hai mở đầu âm tiết kế), text là chữ hiện trong ô.
// "n" còn chờ ở cuối hiện luôn là ん cho dễ thấy (ichiban → いちばん); gõ thêm nguyên âm thì ん tự ghép lại (な, に...).
// Xóa, dán hoặc sửa giữa chừng thì coi chữ đang hiện là nội dung mới.
// target: chữ kana của từ cần gõ; ký tự nào của từ đó là katakana (エアコン, コピーします) thì ô hiện katakana ở đúng vị trí ấy.
export function convertInput(value, prev = { raw: '', text: '' }, { target = '' } = {}) {
  const appended = value.length === prev.text.length + 1 && value.startsWith(prev.text);
  const raw = appended ? prev.raw + value.slice(-1) : value;
  let text = romajiToKana(raw);
  if (text.endsWith('n')) text = `${text.slice(0, -1)}ん`;
  return { raw, text: matchScript(text, target) };
}

const KATA = /^[ァ-ヺー]$/;

// Ký tự thứ i của text lấy chữ viết (hiragana/katakana) giống ký tự thứ i của từ đích; phần dư hoặc chưa đổi được giữ nguyên
export function matchScript(text, target) {
  if (!target) return text;
  return [...text].map((c, i) => (KATA.test(target[i] ?? '') ? toKatakana(c) : c)).join('');
}

// 'kata' nếu cả từ là katakana, 'mixed' nếu có xen katakana (コピーします), còn lại 'hira'
export function scriptOf(kana) {
  const t = kana.replace(/\s/g, '');
  if (/^[ァ-ヺー]+$/.test(t)) return 'kata';
  return /[ァ-ヺ]/.test(t) ? 'mixed' : 'hira';
}
