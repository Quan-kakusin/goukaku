// Furigana (chữ hiragana nhỏ phía trên chữ Hán) cho mục Kanji và đề thi thử.
// Hàm thuần (trừ phần nhớ lựa chọn bật/tắt): không đụng DOM, test được.

import { VOCAB } from '../data/lessons.js';
import { KANJI } from '../data/kanji-n5.js';
import { toHiragana } from './kana-data.js';

const HAN = /[㐀-鿿々]/;
const HAN_RUN = /^[㐀-鿿々]+/;
const isKana = c => /[぀-ヿー]/.test(c);

// Cách đọc chính của từng chữ trong 80 chữ, hiện phía trên chữ ở mục Kanji. Các cách đọc khác xem ở phần chi tiết.
export const MAIN_READING = {
  一: 'いち', 二: 'に', 三: 'さん', 四: 'よん', 五: 'ご', 六: 'ろく', 七: 'なな', 八: 'はち', 九: 'きゅう', 十: 'じゅう', 百: 'ひゃく', 円: 'えん',
  日: 'ひ', 月: 'つき', 火: 'ひ', 水: 'みず', 木: 'き', 金: 'かね', 土: 'つち', 気: 'き', 電: 'でん', 車: 'くるま',
  人: 'ひと', 子: 'こ', 男: 'おとこ', 女: 'おんな', 父: 'ちち', 母: 'はは', 目: 'め', 口: 'くち', 手: 'て',
  上: 'うえ', 下: 'した', 中: 'なか', 左: 'ひだり', 右: 'みぎ', 東: 'ひがし', 西: 'にし', 南: 'みなみ', 北: 'きた', 前: 'まえ', 後: 'あと',
  大: 'おお', 小: 'ちい', 高: 'たか', 安: 'やす', 新: 'あたら', 学: 'がく', 校: 'こう', 生: 'せい', 先: 'せん', 語: 'ご', 話: 'はな', 読: 'よ', 書: 'か', 聞: 'き',
  見: 'み', 行: 'い', 来: 'く', 食: 'た', 飲: 'の', 買: 'か', 出: 'で', 入: 'はい', 休: 'やす', 会: 'あ',
  時: 'とき', 分: 'ぶん', 今: 'いま', 年: 'とし', 週: 'しゅう', 間: 'かん', 国: 'くに', 社: 'しゃ', 名: 'な', 店: 'みせ', 道: 'みち', 駅: 'えき', 何: 'なに', 本: 'ほん',
};

// Với chữ chưa có trong bảng: lấy âm Kun đầu tiên, không có thì lấy âm On đổi sang hiragana
export function mainReading(k) {
  if (MAIN_READING[k.char]) return MAIN_READING[k.char];
  const kun = k.kun.split(/[,、]/).map(t => t.replace(/[(（].*?[)）]/g, '').trim()).find(t => /^[぀-ゟ]+$/.test(t));
  return kun ?? toHiragana(k.on.split(/[,、]/)[0].trim());
}

// ---- Tự gắn furigana cho câu trong đề, dựa trên từ vựng đã có trong app ----
// Chỉ gắn khi biết chắc cách đọc cả từ; chữ Hán nào không có trong từ điển thì để nguyên, không đoán.
const dict = new Map(); // từ (có chữ Hán) → cách đọc
const stems = new Map(); // gốc động từ/tính từ (chữ Hán, kèm okurigana ngay sau) → cách đọc

function addPair(word, kana) {
  if (!HAN.test(word) || !kana || word === kana) return;
  if (!dict.has(word)) dict.set(word, kana);
  // 食べる/たべる → gốc 食 = た (chỉ dùng khi chữ Hán đứng trước okurigana)
  const m = word.match(/^([㐀-鿿々]+)([぀-ゟ]+)$/);
  if (m && kana.endsWith(m[2]) && kana.length > m[2].length) {
    const reading = kana.slice(0, -m[2].length);
    const old = stems.get(m[1]);
    stems.set(m[1], old === undefined || old === reading ? reading : null); // null = nhiều cách đọc khác nhau, không dùng
  }
}
for (const w of VOCAB) addPair(w.kanji, w.kana);
for (const k of KANJI) for (const w of k.words) addPair(w.word, w.kana);
// Từ hay gặp trong đề nhưng không có trong danh sách trên
const EXTRA = {
  私: 'わたし', 何: 'なに', 今日: 'きょう', 明日: 'あした', 昨日: 'きのう', 毎日: 'まいにち', 毎朝: 'まいあさ', 毎晩: 'まいばん', 今朝: 'けさ', 今年: 'ことし', 来年: 'らいねん', 去年: 'きょねん',
  先週: 'せんしゅう', 来週: 'らいしゅう', 今週: 'こんしゅう', 一人: 'ひとり', 二人: 'ふたり', 大人: 'おとな', 子供: 'こども', 上手: 'じょうず', 下手: 'へた', 手紙: 'てがみ', 部屋: 'へや',
  お金: 'おかね', 友達: 'ともだち', 友だち: 'ともだち', 田中: 'たなか', 山田: 'やまだ', 山口: 'やまぐち', 山下: 'やました', 中川: 'なかがわ', 木村: 'きむら', 森: 'もり', 屋: 'や', 毎週: 'まいしゅう', 毎月: 'まいつき', 今月: 'こんげつ', 来月: 'らいげつ',
  果物: 'くだもの', 一緒: 'いっしょ', 一杯: 'いっぱい', 大好き: 'だいすき', 好き: 'すき', 嫌い: 'きらい', 時間: 'じかん', 誕生日: 'たんじょうび', 日本: 'にほん', 日本語: 'にほんご',
};
for (const [w, r] of Object.entries(EXTRA)) dict.set(w, r);

// Các chữ Hán chỉ ngày trong tuần/ngày/tháng đứng một mình đọc rất khác nhau tùy ngữ cảnh, nên không tra từ điển; xử lý theo mẫu bên dưới
for (const w of ['日', '月', '火', '土', '金']) dict.delete(w);
// Tên người và từ hay gặp khác

const keys = [...dict.keys()].sort((a, b) => b.length - a.length);

// ---- Số + đơn vị đếm: 十時 → じゅうじ, 四百円 → よんひゃくえん, 6月 → 月 = がつ ----
const KDIGIT = { 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
const ONES = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const NUMBER = /^[〇一二三四五六七八九十百]+/;
function parseKanjiNumber(str) {
  let total = 0;
  let cur = 0;
  for (const c of str) {
    if (c in KDIGIT) cur = cur * 10 + KDIGIT[c];
    else if (c === '十') {
      total += (cur || 1) * 10;
      cur = 0;
    } else if (c === '百') {
      total += (cur || 1) * 100;
      cur = 0;
    }
  }
  return total + cur;
}
// n từ 1 đến 999; four/seven/nine: cách đọc riêng của chữ số 4, 7, 9 khi ghép với đơn vị đếm
function readInt(n, { four = 'よん', seven = 'なな', nine = 'きゅう' } = {}) {
  const h = Math.floor(n / 100);
  const t = Math.floor(n / 10) % 10;
  const o = n % 10;
  let out = '';
  if (h) out += (h === 1 ? '' : h === 3 ? 'さん' : h === 6 ? 'ろっ' : h === 8 ? 'はっ' : ONES[h]) + (h === 3 ? 'びゃく' : h === 6 || h === 8 ? 'ぴゃく' : 'ひゃく');
  if (t) out += (t === 1 ? '' : ONES[t]) + 'じゅう';
  if (o) out += o === 4 ? four : o === 7 ? seven : o === 9 ? nine : ONES[o];
  return out;
}
const DAY = { 1: 'ついたち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか' };
// Trả về cách đọc đầy đủ của "số + đơn vị", hoặc null nếu chưa hỗ trợ
function readCounted(n, c) {
  const last = n % 10;
  const small = (base, sound) => (last === 1 ? base.slice(0, -2) + `いっ${sound}` : last === 8 ? base.slice(0, -3) + `はっ${sound}` : last === 0 ? base.replace(/じゅう$/, 'じゅっ') + sound : null);
  switch (c) {
    case '時': return readInt(n, { four: 'よ', seven: 'しち', nine: 'く' }) + 'じ';
    case '時間': return readInt(n, { four: 'よ', seven: 'しち', nine: 'く' }) + 'じかん';
    case '月': return readInt(n, { four: 'し', seven: 'しち', nine: 'く' }) + 'がつ';
    case '年': return readInt(n, { four: 'よ' }) + 'ねん';
    case '円': return readInt(n, { four: 'よ' }) + 'えん';
    case '日': return DAY[n] ?? readInt(n) + 'にち';
    case '枚': return readInt(n, { four: 'よん' }) + 'まい';
    case '人': return n === 1 ? 'ひとり' : n === 2 ? 'ふたり' : readInt(n, { four: 'よ' }) + 'にん';
    case '歳': return n === 20 ? 'はたち' : (small(readInt(n), 'さい') ?? readInt(n) + 'さい');
    case '分': {
      const base = readInt(n);
      if (last === 1) return base.slice(0, -2) + 'いっぷん';
      if (last === 6) return base.slice(0, -3) + 'ろっぷん';
      if (last === 8) return base.slice(0, -3) + 'はっぷん';
      if (last === 0) return base.replace(/じゅう$/, 'じゅっ') + 'ぷん';
      return base + (last === 3 || last === 4 ? 'ぷん' : 'ふん');
    }
    default: return null;
  }
}
const COUNTERS = ['時間', '時', '分', '円', '年', '月', '日', '枚', '人', '歳'];
const WEEKDAY = { 日: 'にち', 月: 'げつ', 火: 'か', 水: 'すい', 木: 'もく', 金: 'きん', 土: 'ど' };

// Tách phần chữ Hán cần gắn furigana khỏi okurigana/tiền tố kana chung với cách đọc: お願い/おねがい → "願" = ねがい… ở mức đơn giản chỉ cắt đuôi kana chung
function core(word, reading) {
  let end = word.length;
  let rEnd = reading.length;
  while (end > 1 && isKana(word[end - 1]) && word[end - 1] === reading[rEnd - 1]) {
    end -= 1;
    rEnd -= 1;
  }
  return { base: word.slice(0, end), reading: reading.slice(0, rEnd), tail: word.slice(end) };
}

// Chữ Hán có nhiều cách đọc ở gốc động từ: chọn theo chữ kana đứng sau (来ます → き, 来ない → こ, 来る → く)
function contextStem(run, rest) {
  if (run === '来') return /^(ま|て|た)/.test(rest) ? 'き' : /^な/.test(rest) ? 'こ' : /^る/.test(rest) ? 'く' : null;
  if (run === '出') return /^し/.test(rest) ? 'だ' : 'で';
  if (run === '入') return /^れ/.test(rest) ? 'い' : /^(り|る|っ)/.test(rest) ? 'はい' : null;
  if (run === '生') return /^まれ/.test(rest) ? 'う' : /^き/.test(rest) ? 'い' : null;
  return null;
}

// Trả về các đoạn: { text } hoặc { text, ruby }
export function annotate(text) {
  const out = [];
  let plain = '';
  const flush = () => {
    if (plain) out.push({ text: plain });
    plain = '';
  };
  let i = 0;
  while (i < text.length) {
    if (/\d/.test(text[i])) {
      const d = text.slice(i).match(/^\d+/)[0];
      const c = text[i + d.length];
      const n = Number(d);
      if ((c === '月' || c === '日' || c === '円' || c === '時' || c === '分' || c === '年') && n >= 1 && n <= 9999) {
        flush();
        if (c === '日' && DAY[n]) {
          out.push({ text: `${d}日`, ruby: DAY[n] }); // 1日, 2日... đọc cả cụm (ついたち, ふつか...)
        } else {
          const last = n % 10;
          const reading = { 月: 'がつ', 日: 'にち', 円: 'えん', 時: 'じ', 年: 'ねん', 分: [1, 3, 4, 6, 8, 0].includes(last) ? 'ぷん' : 'ふん' }[c];
          out.push({ text: d });
          out.push({ text: c, ruby: reading });
        }
        i += d.length + 1;
        continue;
      }
      plain += d;
      i += d.length;
      continue;
    }
    if (!HAN.test(text[i])) {
      plain += text[i];
      i += 1;
      continue;
    }
    // thứ trong tuần: 月よう日, 日よう日, （月）
    const wd = text.slice(i).match(/^([日月火水木金土])(よう|曜)日/);
    const paren = i > 0 && /[（(]/.test(text[i - 1]) && /[日月火水木金土]/.test(text[i]) && /[)）]/.test(text[i + 1] ?? '');
    if (wd || paren) {
      flush();
      out.push({ text: text[i], ruby: WEEKDAY[text[i]] });
      i += 1;
      if (wd) {
        plain += wd[2];
        i += wd[2].length;
        flush();
        out.push({ text: '日', ruby: 'び' });
        i += 1;
      }
      continue;
    }
    // số bằng chữ Hán + đơn vị đếm (đúng 十時, 四百円...), trừ khi từ điển có từ dài hơn
    const num = text.slice(i).match(NUMBER);
    if (num) {
      const after = text.slice(i + num[0].length);
      const ctr = COUNTERS.find(x => after.startsWith(x));
      const span = num[0].length + (ctr ? ctr.length : 0);
      const reading = ctr ? readCounted(parseKanjiNumber(num[0]), ctr) : null;
      const longer = keys.find(k => text.startsWith(k, i) && k.length >= span);
      if (reading && !longer) {
        flush();
        out.push({ text: text.slice(i, i + span), ruby: reading });
        i += span;
        continue;
      }
    }
    const key = keys.find(k => text.startsWith(k, i));
    if (key) {
      // chữ đơn đứng trước okurigana: ưu tiên gốc động từ (話します → はな, không phải はなし)
      const nextCh = text[i + key.length];
      if (key.length === 1 && stems.get(key) && nextCh && /[぀-ゟ]/.test(nextCh)) {
        flush();
        out.push({ text: key, ruby: stems.get(key) });
        i += 1;
        continue;
      }
      const c = core(key, dict.get(key));
      flush();
      out.push({ text: c.base, ruby: c.reading });
      if (c.tail) out.push({ text: c.tail });
      i += key.length;
      continue;
    }
    // gốc động từ/tính từ: chữ Hán + okurigana ngay sau
    const run = text.slice(i).match(HAN_RUN)[0];
    const next = text[i + run.length];
    const stem = contextStem(run, text.slice(i + run.length)) ?? stems.get(run);
    if (stem && next && /[぀-ゟ]/.test(next)) {
      flush();
      out.push({ text: run, ruby: stem });
      i += run.length;
      continue;
    }
    plain += run; // chữ Hán chưa biết cách đọc: để nguyên
    i += run.length;
  }
  flush();
  return out;
}

// ---- Bật/tắt furigana: thói quen dùng giao diện, lưu riêng, không vào dữ liệu học ----
const PREF_KEY = 'nihongo-n5:furigana';
export function getFuriganaPref() {
  try {
    return localStorage.getItem(PREF_KEY) !== 'off';
  } catch {
    return true;
  }
}
export function setFuriganaPref(on) {
  try {
    localStorage.setItem(PREF_KEY, on ? 'on' : 'off');
  } catch {
    // không lưu được thì lần sau về mặc định (bật)
  }
}
