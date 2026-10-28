import test from 'node:test';
import assert from 'node:assert/strict';
import { numberKana, COUNTING_GROUPS, COUNTING_WORDS, COUNTER_COLUMNS } from '../data/counting.js';
import { matchesWord, romajiOf } from '../js/romaji.js';
import { convertInput, finalizeKana } from '../js/ime.js';

const byKanji = new Map(COUNTING_WORDS.map(w => [`${w.group}:${w.kanji}`, w]));
const read = (group, kanji) => byKanji.get(`${group}:${kanji}`)?.kana;

test('numberKana: các cách đọc bất quy tắc của 100, 1000, 10000', () => {
  const cases = { 0: 'ぜろ', 4: 'よん', 7: 'なな', 10: 'じゅう', 11: 'じゅういち', 20: 'にじゅう', 100: 'ひゃく', 300: 'さんびゃく', 600: 'ろっぴゃく', 800: 'はっぴゃく', 1000: 'せん', 3000: 'さんぜん', 8000: 'はっせん', 10000: 'いちまん', 12345: 'いちまんにせんさんびゃくよんじゅうご', 99999: 'きゅうまんきゅうせんきゅうひゃくきゅうじゅうきゅう' };
  for (const [n, kana] of Object.entries(cases)) assert.equal(numberKana(Number(n)), kana, n);
  assert.throws(() => numberKana(100000));
});

test('ngày trong tháng: 1–10, 14, 20, 24 đọc đặc biệt, còn lại số + にち', () => {
  const special = { 1: 'ついたち', 2: 'ふつか', 3: 'みっか', 4: 'よっか', 5: 'いつか', 6: 'むいか', 7: 'なのか', 8: 'ようか', 9: 'ここのか', 10: 'とおか', 14: 'じゅうよっか', 20: 'はつか', 24: 'にじゅうよっか', 11: 'じゅういちにち', 17: 'じゅうしちにち', 19: 'じゅうくにち', 29: 'にじゅうくにち', 30: 'さんじゅうにち', 31: 'さんじゅういちにち' };
  for (const [d, kana] of Object.entries(special)) assert.equal(read('day', `${d}日`), kana, `${d}日`);
  assert.equal(COUNTING_GROUPS.find(g => g.id === 'day').words.length, 31);
});

test('tháng, năm, giờ, phút: 4・7・9 đọc đặc biệt', () => {
  assert.equal(read('month', '4月'), 'しがつ');
  assert.equal(read('month', '7月'), 'しちがつ');
  assert.equal(read('month', '9月'), 'くがつ');
  assert.equal(read('month', '10月'), 'じゅうがつ');
  assert.equal(read('year', '2000年'), 'にせんねん');
  assert.equal(read('year', '2024年'), 'にせんにじゅうよねん');
  assert.equal(read('year', '1999年'), 'せんきゅうひゃくきゅうじゅうくねん');
  assert.equal(read('year', '1985年'), 'せんきゅうひゃくはちじゅうごねん');
  assert.equal(read('clock', '4時'), 'よじ');
  assert.equal(read('clock', '7時'), 'しちじ');
  assert.equal(read('clock', '9時'), 'くじ');
  assert.equal(read('clock', '1分'), 'いっぷん');
  assert.equal(read('clock', '10分'), 'じゅっぷん');
  assert.equal(read('yen', '4円'), 'よえん');
  assert.equal(read('yen', '300円'), 'さんびゃくえん');
});

test('trợ số từ 人・枚・台: bảng đọc đầy đủ 1–10', () => {
  const nin = ['ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'];
  const mai = ['いちまい', 'にまい', 'さんまい', 'よんまい', 'ごまい', 'ろくまい', 'ななまい', 'はちまい', 'きゅうまい', 'じゅうまい'];
  const dai = ['いちだい', 'にだい', 'さんだい', 'よんだい', 'ごだい', 'ろくだい', 'ななだい', 'はちだい', 'きゅうだい', 'じゅうだい'];
  nin.forEach((k, i) => assert.equal(read('nin', `${i + 1}人`), k));
  mai.forEach((k, i) => assert.equal(read('mai', `${i + 1}枚`), k));
  dai.forEach((k, i) => assert.equal(read('dai', `${i + 1}台`), k));
  assert.equal(read('nin', '何人'), 'なんにん');
});

test('trợ số từ khác: 本 冊 個 歳 階 つ có cách đọc biến âm đúng', () => {
  assert.deepEqual([1, 3, 6, 8, 10].map(n => read('hon', `${n}本`)), ['いっぽん', 'さんぼん', 'ろっぽん', 'はっぽん', 'じゅっぽん']);
  assert.deepEqual([1, 8, 10].map(n => read('hon', `${n}冊`)), ['いっさつ', 'はっさつ', 'じゅっさつ']);
  assert.deepEqual([1, 6].map(n => read('hon', `${n}個`)), ['いっこ', 'ろっこ']);
  assert.deepEqual([1, 3, 6].map(n => read('hon', `${n}匹`)), ['いっぴき', 'さんびき', 'ろっぴき']);
  assert.deepEqual([1, 2, 3].map(n => read('hon', `${n}杯`)), ['いっぱい', 'にはい', 'さんばい']);
  assert.equal(read('sai', '20歳'), 'はたち');
  assert.deepEqual([1, 3].map(n => read('sai', `${n}階`)), ['いっかい', 'さんがい']);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => read('tsu', n === 10 ? '十' : `${n}つ`)), ['ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお']);
});

test('dữ liệu: id duy nhất, nghĩa duy nhất (đề bài không mơ hồ), kana chỉ gồm hiragana', () => {
  assert.equal(new Set(COUNTING_WORDS.map(w => w.id)).size, COUNTING_WORDS.length);
  assert.equal(new Set(COUNTING_WORDS.map(w => w.vi)).size, COUNTING_WORDS.length, 'hai mục có cùng nghĩa tiếng Việt');
  for (const w of COUNTING_WORDS) {
    assert.match(w.kana, /^[ぁ-ゖー]+$/, w.kanji);
    for (const a of w.alts ?? []) assert.match(a, /^[ぁ-ゖーァ-ヺ]+$/, `${w.kanji} alt`);
    assert.equal(w.lesson, 0);
  }
});

test('gõ romaji từng phím: mọi mục và mọi cách đọc khác đều được chấm đúng', () => {
  const bad = [];
  for (const w of COUNTING_WORDS) {
    for (const reading of [w.kana, ...(w.alts ?? [])]) {
      let prev = { raw: '', text: '' };
      const probe = { ...w, kana: reading };
      for (const c of romajiOf(probe)) prev = convertInput(prev.text + c, prev, { target: reading });
      if (!matchesWord(finalizeKana(prev.text), w)) bad.push(`${w.kanji}: ${reading} → ${prev.text}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('chấm: gõ cách đọc sai bị từ chối (4 giờ không phải よんじ, 4 tháng không phải よんがつ)', () => {
  assert.equal(matchesWord('よんじ', byKanji.get('clock:4時')), false);
  assert.equal(matchesWord('よんがつ', byKanji.get('month:4月')), false);
  assert.equal(matchesWord('よんにん', byKanji.get('nin:4人')), false);
  assert.equal(matchesWord('にほん', byKanji.get('hon:2本')), true);
  assert.equal(matchesWord('よん', byKanji.get('num:4')), true);
  assert.equal(matchesWord('し', byKanji.get('num:4')), true);
});

test('bảng tra trợ số từ: đủ cột, mỗi cột đủ 1–10 và từ hỏi; mục đọc bất quy tắc được đánh dấu', () => {
  assert.deepEqual(COUNTER_COLUMNS.slice(0, 3).map(c => c.unit), ['人', '枚', '台']);
  for (const c of COUNTER_COLUMNS) {
    assert.ok(c.words.length >= 11, c.unit);
    assert.match(c.words.at(-1).kana, /^(なん|いくつ)/, `${c.unit}: mục cuối phải là từ hỏi`);
  }
  const flag = (unit, kanji) => COUNTER_COLUMNS.find(c => c.unit === unit).words.find(w => w.kanji === kanji).irregular === true;
  assert.ok(flag('人', '1人') && flag('人', '2人') && flag('人', '4人'));
  assert.ok(!flag('人', '3人') && !flag('枚', '1枚') && !flag('台', '4台'));
  assert.ok(flag('本', '3本') && flag('本', '6本') && flag('階', '3階') && flag('歳', '20歳'));
  const day = n => COUNTING_GROUPS.find(g => g.id === 'day').words.find(w => w.kanji === `${n}日`);
  assert.ok(day(1).irregular && day(14).irregular && day(20).irregular && !day(12).irregular);
});
