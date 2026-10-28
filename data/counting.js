// Số đếm, ngày, tháng, năm, giờ và trợ số từ thường gặp để luyện gõ romaji.
// Mỗi mục có dạng từ vựng: { id, lesson: 0, group, word, kana, kanji, vi, alts? }. word = kana (app chỉ hiện kana), kanji = cách viết bằng số/chữ Hán.
// alts: cách đọc khác cũng được chấp nhận (4 = よん/し, 7 = なな/しち ...). Cách đọc chính là cách đọc phổ biến nhất.

const ONES = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];

// Số từ 1 đến 99999 đọc bằng kana (1000 = せん, 300 = さんびゃく, 8000 = はっせん, 10000 = いちまん ...)
export function numberKana(n) {
  if (!Number.isInteger(n) || n < 0 || n > 99999) throw new RangeError(`Không đọc được số ${n}`);
  if (n === 0) return 'ぜろ';
  const below = k => {
    const th = Math.floor(k / 1000);
    const hu = Math.floor(k / 100) % 10;
    const te = Math.floor(k / 10) % 10;
    const on = k % 10;
    const thou = { 1: 'せん', 3: 'さんぜん', 8: 'はっせん' };
    const hund = { 1: 'ひゃく', 3: 'さんびゃく', 6: 'ろっぴゃく', 8: 'はっぴゃく' };
    return (
      (th ? (thou[th] ?? `${ONES[th]}せん`) : '') +
      (hu ? (hund[hu] ?? `${ONES[hu]}ひゃく`) : '') +
      (te ? (te === 1 ? 'じゅう' : `${ONES[te]}じゅう`) : '') +
      ONES[on]
    );
  };
  const man = Math.floor(n / 10000);
  const rest = n % 10000;
  return (man ? `${below(man)}まん` : '') + (rest ? below(rest) : '');
}

// Đổi chữ số cuối của cách đọc: 4 = よ, 7 = なな, 9 = く khi đứng trước 年・円・時
const lastDigit = (kana, n, map) => {
  const o = n % 10;
  if (!(o in map)) return kana;
  const from = ONES[o];
  return kana.endsWith(from) ? kana.slice(0, -from.length) + map[o] : kana;
};

// irregular: cách đọc bất quy tắc (biến âm hoặc đọc riêng), nên học thuộc: bảng tra cứu tô đậm các mục này
const mk = (group, key, kanji, kana, vi, alts = [], irregular = false) => ({
  id: `cnt:${group}:${key}`,
  lesson: 0,
  group,
  word: kana,
  kana,
  kanji,
  vi,
  ...(alts.length && { alts }),
  ...(irregular && { irregular }),
});

const REGULAR = ['いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'];
const SOUND_CHANGE = /びゃく|ぴゃく|ぜん|っせん/; // 300, 600, 800, 3000, 8000

// ---- Số đếm ----
const NUM_LIST = [...Array.from({ length: 11 }, (_, i) => i), 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 30000, 50000];
const NUM_ALTS = { 0: ['れい', 'ゼロ'], 4: ['し', 'よ'], 7: ['しち'], 9: ['く'] };
const numbers = NUM_LIST.map(n => {
  const kana = numberKana(n);
  const alts = NUM_ALTS[n] ?? [];
  return mk('num', n, String(n), kana, `số ${n}`, alts, SOUND_CHANGE.test(kana));
});

// ---- Giá tiền ----
const YEN = [1, 4, 5, 7, 9, 10, 50, 100, 300, 600, 800, 1000, 3000, 8000, 10000, 50000];
const yen = YEN.map(n => {
  const kana = `${lastDigit(numberKana(n), n, { 4: 'よ' })}えん`;
  return mk('yen', n, `${n}円`, kana, `${n} yên (${n}円)`, n === 7 ? ['しちえん'] : [], n === 4 || SOUND_CHANGE.test(kana));
});

// ---- Ngày trong tháng ----
const DAY_SPECIAL = { 1: 'ついたち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか' };
const DAY_ALTS = { 17: ['じゅうななにち'], 27: ['にじゅうななにち'], 19: ['じゅうきゅうにち'], 29: ['にじゅうきゅうにち'] };
const dayKana = d => {
  if (DAY_SPECIAL[d]) return DAY_SPECIAL[d];
  const tens = d >= 30 ? 'さんじゅう' : d >= 20 ? 'にじゅう' : 'じゅう';
  const one = d % 10;
  const onesKana = { 1: 'いち', 2: 'に', 3: 'さん', 5: 'ご', 6: 'ろく', 7: 'しち', 8: 'はち', 9: 'く' }[one] ?? '';
  return `${tens}${onesKana}にち`;
};
const days = Array.from({ length: 31 }, (_, i) => i + 1).map(d => mk('day', d, `${d}日`, dayKana(d), `ngày ${d} (${d}日)`, DAY_ALTS[d] ?? [], d in DAY_SPECIAL || d in DAY_ALTS));

// ---- Tháng ----
const MONTH = ['いち', 'に', 'さん', 'し', 'ご', 'ろく', 'しち', 'はち', 'く', 'じゅう', 'じゅういち', 'じゅうに'];
const months = MONTH.map((r, i) => mk('month', i + 1, `${i + 1}月`, `${r}がつ`, `tháng ${i + 1} (${i + 1}月)`, [], [4, 7, 9].includes(i + 1)));

// ---- Năm ----
const YEARS = [1985, 1990, 1999, 2000, 2004, 2007, 2009, 2010, 2020, 2024, 2025, 2026, 2030];
const years = YEARS.map(y => {
  const kana = `${lastDigit(numberKana(y), y, { 4: 'よ', 9: 'く' })}ねん`;
  return mk('year', y, `${y}年`, kana, `năm ${y} (${y}年)`, y % 10 === 7 ? [`${lastDigit(numberKana(y), y, { 7: 'しち' })}ねん`] : [], [4, 7, 9].includes(y % 10) || SOUND_CHANGE.test(kana));
});

// ---- Giờ và phút ----
const HOUR = ['いち', 'に', 'さん', 'よ', 'ご', 'ろく', 'しち', 'はち', 'く', 'じゅう', 'じゅういち', 'じゅうに'];
const hours = HOUR.map((r, i) => mk('clock', `h${i + 1}`, `${i + 1}時`, `${r}じ`, `${i + 1} giờ (${i + 1}時)`, i + 1 === 7 ? ['ななじ'] : [], [4, 7, 9].includes(i + 1)));
const MIN = [
  [1, 'いっぷん'], [2, 'にふん'], [3, 'さんぷん'], [4, 'よんぷん'], [5, 'ごふん'], [6, 'ろっぷん'], [7, 'ななふん', ['しちふん']], [8, 'はっぷん', ['はちふん']], [9, 'きゅうふん'], [10, 'じゅっぷん', ['じっぷん']],
  [15, 'じゅうごふん'], [20, 'にじゅっぷん', ['にじっぷん']], [30, 'さんじゅっぷん', ['さんじっぷん']],
];
const minutes = MIN.map(([m, kana, alts]) => mk('clock', `m${m}`, `${m}分`, kana, `${m} phút (${m}分)`, alts, /ぷん|っ/.test(kana)));

// ---- Trợ số từ ----
// readings: cách đọc từ 1 đến 10. Mỗi phần tử là chuỗi hoặc [chính, ...đọc khác].
const COUNTERS = {
  nin: { suffix: 'にん', unit: '人', label: 'người', what: 'người', readings: ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', ['ななにん', 'しちにん'], 'はちにん', 'きゅうにん', 'じゅうにん'], ask: ['なんにん', '何人', 'mấy người'] },
  mai: { suffix: 'まい', unit: '枚', label: 'tờ, tấm', what: 'vật mỏng, dẹt', readings: ['いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', ['ななまい', 'しちまい'], 'はちまい', 'きゅうまい', 'じゅうまい'], ask: ['なんまい', '何枚', 'mấy tờ'] },
  dai: { suffix: 'だい', unit: '台', label: 'cái, chiếc', what: 'máy móc, xe cộ', readings: ['いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい', ['ななだい', 'しちだい'], 'はちだい', 'きゅうだい', 'じゅうだい'], ask: ['なんだい', '何台', 'mấy chiếc'] },
  hon: { suffix: 'ほん', unit: '本', label: 'cái, chai, cây', what: 'vật dài, thon', readings: ['いっぽん', 'にほん', 'さんぼん', 'よんほん', 'ごほん', 'ろっぽん', ['ななほん', 'しちほん'], ['はっぽん', 'はちほん'], 'きゅうほん', ['じゅっぽん', 'じっぽん']], ask: ['なんぼん', '何本', 'mấy cây'] },
  satsu: { suffix: 'さつ', unit: '冊', label: 'quyển', what: 'sách, vở', readings: ['いっさつ', 'にさつ', 'さんさつ', 'よんさつ', 'ごさつ', 'ろくさつ', ['ななさつ', 'しちさつ'], ['はっさつ', 'はちさつ'], 'きゅうさつ', ['じゅっさつ', 'じっさつ']], ask: ['なんさつ', '何冊', 'mấy quyển'] },
  ko: { suffix: 'こ', unit: '個', label: 'cái, viên, quả', what: 'vật nhỏ, tròn', readings: ['いっこ', 'にこ', 'さんこ', 'よんこ', 'ごこ', 'ろっこ', ['ななこ', 'しちこ'], ['はっこ', 'はちこ'], 'きゅうこ', ['じゅっこ', 'じっこ']], ask: ['なんこ', '何個', 'mấy cái'] },
  hiki: { suffix: 'ひき', unit: '匹', label: 'con', what: 'động vật nhỏ', readings: ['いっぴき', 'にひき', 'さんびき', 'よんひき', 'ごひき', 'ろっぴき', ['ななひき', 'しちひき'], ['はっぴき', 'はちひき'], 'きゅうひき', ['じゅっぴき', 'じっぴき']], ask: ['なんびき', '何匹', 'mấy con'] },
  hai: { suffix: 'はい', unit: '杯', label: 'ly, cốc, bát', what: 'đồ uống, thức ăn trong ly/bát', readings: ['いっぱい', 'にはい', 'さんばい', 'よんはい', 'ごはい', 'ろっぱい', ['ななはい', 'しちはい'], ['はっぱい', 'はちはい'], 'きゅうはい', ['じゅっぱい', 'じっぱい']], ask: ['なんばい', '何杯', 'mấy ly'] },
  sai: { suffix: 'さい', unit: '歳', label: 'tuổi', what: 'tuổi', readings: ['いっさい', 'にさい', 'さんさい', 'よんさい', 'ごさい', 'ろくさい', ['ななさい', 'しちさい'], ['はっさい', 'はちさい'], 'きゅうさい', ['じゅっさい', 'じっさい']], ask: ['なんさい', '何歳', 'mấy tuổi'], extra: [[20, 'はたち', '20歳', '20 tuổi (20歳, đọc đặc biệt)']] },
  kai: { suffix: 'かい', unit: '階', label: 'tầng', what: 'tầng nhà', readings: ['いっかい', 'にかい', 'さんがい', 'よんかい', 'ごかい', 'ろっかい', ['ななかい', 'しちかい'], ['はっかい', 'はちかい'], 'きゅうかい', ['じゅっかい', 'じっかい']], ask: ['なんがい', '何階', 'mấy tầng'] },
  kaiTimes: { suffix: 'かい', unit: '回', label: 'lần', what: 'số lần', readings: ['いっかい', 'にかい', 'さんかい', 'よんかい', 'ごかい', 'ろっかい', ['ななかい', 'しちかい'], ['はっかい', 'はちかい'], 'きゅうかい', ['じゅっかい', 'じっかい']], ask: ['なんかい', '何回', 'mấy lần'] },
  jikan: { suffix: 'じかん', unit: '時間', label: 'tiếng', what: 'khoảng thời gian tính bằng giờ', readings: ['いちじかん', 'にじかん', 'さんじかん', 'よじかん', 'ごじかん', 'ろくじかん', ['しちじかん', 'ななじかん'], 'はちじかん', 'くじかん', 'じゅうじかん'], ask: ['なんじかん', '何時間', 'mấy tiếng'] },
  shuukan: { suffix: 'しゅうかん', unit: '週間', label: 'tuần', what: 'khoảng thời gian tính bằng tuần', readings: ['いっしゅうかん', 'にしゅうかん', 'さんしゅうかん', 'よんしゅうかん', 'ごしゅうかん', 'ろくしゅうかん', ['ななしゅうかん', 'しちしゅうかん'], ['はっしゅうかん', 'はちしゅうかん'], 'きゅうしゅうかん', ['じゅっしゅうかん', 'じっしゅうかん']], ask: ['なんしゅうかん', '何週間', 'mấy tuần'] },
  kagetsu: { suffix: 'かげつ', unit: 'か月', label: 'tháng', what: 'khoảng thời gian tính bằng tháng', readings: ['いっかげつ', 'にかげつ', 'さんかげつ', 'よんかげつ', 'ごかげつ', 'ろっかげつ', ['ななかげつ', 'しちかげつ'], ['はっかげつ', 'はちかげつ'], 'きゅうかげつ', ['じゅっかげつ', 'じっかげつ']], ask: ['なんかげつ', '何か月', 'mấy tháng'] },
};

const TSU = [['ひとつ', 1], ['ふたつ', 2], ['みっつ', 3], ['よっつ', 4], ['いつつ', 5], ['むっつ', 6], ['ななつ', 7], ['やっつ', 8], ['ここのつ', 9], ['とお', 10]];

const counter = (group, key) => {
  const c = COUNTERS[key];
  const out = c.readings.map((r, i) => {
    const [kana, ...alts] = Array.isArray(r) ? r : [r];
    const n = i + 1;
    return mk(group, `${key}${n}`, `${n}${c.unit}`, kana, `${n} ${c.label} (${n}${c.unit})`, alts, kana !== REGULAR[i] + c.suffix);
  });
  for (const [n, kana, kanji, vi] of c.extra ?? []) out.push(mk(group, `${key}${n}`, kanji, kana, vi, [], true));
  const [kana, kanji, vi] = c.ask;
  out.push(mk(group, `${key}ask`, kanji, kana, `${vi} (${kanji}) để hỏi số lượng`, [], kana !== `なん${c.suffix}`));
  return out;
};

const tsu = [
  ...TSU.map(([kana, n]) => mk('tsu', `t${n}`, n === 10 ? '十' : `${n}つ`, kana, `${n} cái (${n === 10 ? '十, đọc とお' : `${n}つ`}, đếm chung)`, [], n !== 7)),
  mk('tsu', 'ask', 'いくつ', 'いくつ', 'mấy cái, bao nhiêu cái (いくつ)'),
];

export const COUNTING_GROUPS = [
  { id: 'num', label: 'Số đếm (0, 10, 100, 1000, 10000…)', words: numbers },
  { id: 'yen', label: 'Giá tiền (円)', words: yen },
  { id: 'day', label: 'Ngày trong tháng (1日 – 31日)', words: days },
  { id: 'month', label: 'Tháng (1月 – 12月)', words: months },
  { id: 'year', label: 'Năm (1990年, 2026年…)', words: years },
  { id: 'clock', label: 'Giờ và phút (時・分)', words: [...hours, ...minutes] },
  { id: 'nin', label: 'Đếm người: 人 (にん)', words: counter('nin', 'nin') },
  { id: 'mai', label: 'Đếm vật mỏng: 枚 (まい)', words: counter('mai', 'mai') },
  { id: 'dai', label: 'Đếm máy móc, xe cộ: 台 (だい)', words: counter('dai', 'dai') },
  { id: 'tsu', label: 'Đếm chung: ひとつ, ふたつ…', words: tsu },
  { id: 'hon', label: 'Đếm khác: 本・冊・個・匹・杯', words: ['hon', 'satsu', 'ko', 'hiki', 'hai'].flatMap(k => counter('hon', k)) },
  { id: 'sai', label: 'Tuổi, tầng, lần: 歳・階・回', words: ['sai', 'kai', 'kaiTimes'].flatMap(k => counter('sai', k)) },
  { id: 'span', label: 'Khoảng thời gian: 時間・週間・か月', words: ['jikan', 'shuukan', 'kagetsu'].flatMap(k => counter('span', k)) },
];

export const COUNTING_WORDS = COUNTING_GROUPS.flatMap(g => g.words.map(w => ({ ...w, group: g.id })));

// Bảng tra cứu trợ số từ: mỗi cột một trợ số từ, các hàng là 1–10 (rồi mục đặc biệt như 20歳) và từ hỏi なん～
export const COUNTER_COLUMNS = [
  ...['nin', 'mai', 'dai', 'hon', 'satsu', 'ko', 'hiki', 'hai', 'sai', 'kai', 'kaiTimes', 'jikan', 'shuukan', 'kagetsu'].map(key => {
    const c = COUNTERS[key];
    return { key, unit: c.unit, label: c.label, what: c.what, words: counter('table', key) };
  }),
  { key: 'tsu', unit: 'つ', label: 'cái (đếm chung)', what: 'vật không có trợ số từ riêng', words: tsu },
];
