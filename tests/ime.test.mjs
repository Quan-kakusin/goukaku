import test from 'node:test';
import assert from 'node:assert/strict';
import { romajiToKana, finalizeKana, convertInput, scriptOf } from '../js/ime.js';
import { matchesWord, toRomaji, romajiOf } from '../js/romaji.js';
import { toHiragana } from '../js/kana-data.js';
import { VOCAB } from '../data/lessons.js';

const cases = {
  hoteru: 'ほてる', kyou: 'きょう', gakkou: 'がっこう', kitte: 'きって', matcha: 'まっちゃ', sensei: 'せんせい', toukyou: 'とうきょう', ryokan: 'りょかん',
  konnichiha: 'こんにちは', kanna: 'かんな', shatsu: 'しゃつ', ja: 'じゃ', si: 'し', tu: 'つ', thi: 'てぃ', fa: 'ふぁ', 'ko-hi-': 'こーひー', "hon'ya": 'ほんや',
  nippon: 'にっぽn', ichiban: 'いちばn', ryokan: 'りょかn',
};

test('romajiToKana: các cách gõ thường gặp ra đúng hiragana (n cuối còn chờ ký tự kế)', () => {
  for (const [input, expected] of Object.entries(cases)) assert.equal(romajiToKana(input), expected, input);
});

test('romajiToKana: nn, n + phụ âm, phụ âm đôi, phần dở giữ nguyên chữ Latin', () => {
  assert.equal(romajiToKana('nn'), 'ん');
  assert.equal(romajiToKana('kannji'), 'かんじ');
  assert.equal(romajiToKana('k'), 'k');
  assert.equal(romajiToKana('sh'), 'sh');
  assert.equal(romajiToKana('kk'), 'っk');
  assert.equal(romajiToKana('かな'), 'かな', 'kana sẵn có giữ nguyên');
  assert.equal(romajiToKana('KA'), 'か', 'không phân biệt hoa thường');
  assert.equal(romajiToKana('q'), 'q', 'chữ không đổi được thì giữ nguyên');
});

test('finalizeKana: n dở ở cuối thành ん khi kiểm tra', () => {
  assert.equal(finalizeKana('kan'), 'かん');
  assert.equal(finalizeKana('shinbun'), 'しんぶん');
  assert.equal(finalizeKana('n'), 'ん');
});

test('matchesWord nhận kana: hiragana cho từ katakana, và kéo dài nguyên âm', () => {
  const hotel = { word: 'ホテル', kana: 'ホテル' };
  assert.ok(matchesWord(finalizeKana('hoteru'), hotel), 'ほてる ↔ ホテル');
  assert.ok(matchesWord('ホテル', hotel));
  assert.ok(matchesWord('hoteru', hotel), 'romaji thường vẫn nhận');
  const coffee = { word: 'コーヒー', kana: 'コーヒー' };
  assert.ok(matchesWord(finalizeKana('ko-hi-'), coffee));
  assert.ok(matchesWord(finalizeKana('koohii'), coffee), 'こおひい châm chước');
  const watashi = { word: 'わたしは', kana: 'わたしは', romaji: 'watashi wa' };
  assert.ok(matchesWord(finalizeKana('watashiha'), watashi));
  assert.ok(matchesWord(finalizeKana('watashiwa'), watashi), 'わたしわ theo cách đọc');
  assert.equal(matchesWord(finalizeKana('hoteri'), hotel), false);
});

// Gõ từng phím như người dùng: mỗi lần gõ thêm một ký tự vào cuối ô rồi để convertInput đổi
const typeKeys = keys => {
  let prev = { raw: '', text: '' };
  for (const c of keys) prev = convertInput(prev.text + c, prev);
  return prev.text;
};

test('convertInput: n cuối hiện luôn là ん nhưng vẫn ghép được với chữ gõ tiếp', () => {
  const expected = {
    ichiban: 'いちばん', nippon: 'にっぽん', honkon: 'ほんこん', kan: 'かん', n: 'ん',
    kana: 'かな', nya: 'にゃ', ninjin: 'にんじん', kannji: 'かんじ', nn: 'ん',
    konnichiha: 'こんにちは', konnnichiha: 'こんにちは', "hon'ya": 'ほんや', 'konpyu-ta-': 'こんぴゅーたー',
  };
  for (const [keys, kana] of Object.entries(expected)) assert.equal(typeKeys(keys), kana, keys);
});

test('convertInput: xóa hoặc sửa giữa chừng thì lấy chữ đang hiện làm nội dung mới', () => {
  const shown = convertInput('ichiban'.slice(0, 0) + 'いちばn');
  assert.equal(shown.text, 'いちばん');
  const afterDelete = convertInput('いちば', shown);
  assert.equal(afterDelete.text, 'いちば');
  assert.equal(convertInput('いちばな', afterDelete).text, 'いちばな');
});

test('toRomaji: âm ngoại lai ティ ディ フォ ジェ đọc đúng, không thành "tei" "fuo"', () => {
  assert.equal(toRomaji('パーティー'), 'paatii');
  assert.equal(toRomaji('ディズニー'), 'dizunii');
  assert.equal(toRomaji('フォーク'), 'fooku');
  assert.equal(toRomaji('ジェイアール'), 'jeiaaru');
  assert.equal(toRomaji('ウィキ'), 'wiki');
});

test('mọi từ katakana nhận đủ các cách gõ: romaji, có dấu - cho ー, hiragana, katakana', () => {
  const kata = VOCAB.filter(w => /[゠-ヿ]/.test(w.word + w.kana));
  assert.ok(kata.length > 100);
  const bad = [];
  for (const w of kata) {
    const hira = toHiragana(w.kana);
    const typed = {
      romaji: typeKeys(romajiOf(w).replace(/\s/g, '')),
      dash: typeKeys(hira.split('ー').map(toRomaji).join('-')),
      hira,
      kata: w.kana,
    };
    for (const [style, shown] of Object.entries(typed)) if (!matchesWord(finalizeKana(shown), w)) bad.push(`${w.kana} (${style}: ${shown})`);
  }
  assert.deepEqual(bad, []);
});

test('ティ/ディ gõ theo romaji thường (ti, di, thi, texi) đều được nhận', () => {
  const party = VOCAB.find(w => w.kana === 'パーティー');
  for (const keys of ['pa-ti-', 'pa-thi-', 'pa-texi-', 'paatii']) assert.ok(matchesWord(finalizeKana(typeKeys(keys)), party), keys);
  const disney = VOCAB.find(w => w.kana === 'とうきょうディズニーランド');
  for (const keys of ['toukyoudizuni-rando', 'toukyoudhizuni-rando']) assert.ok(matchesWord(finalizeKana(typeKeys(keys)), disney), keys);
});

const typeLike = (keys, target) => {
  let prev = { raw: '', text: '' };
  for (const c of keys) prev = convertInput(prev.text + c, prev, { target });
  return prev.text;
};

test('convertInput: ô gõ theo chữ viết của từ đích (katakana, hiragana, trộn)', () => {
  assert.equal(typeLike('eakon', 'エアコン'), 'エアコン');
  assert.equal(typeLike('ko-hi-', 'コーヒー'), 'コーヒー');
  assert.equal(typeLike('hoteru', 'ホテル'), 'ホテル');
  assert.equal(typeLike('kopi-shimasu', 'コピーします'), 'コピーします');
  assert.equal(typeLike('kesigomu', 'けしゴム'), 'けしゴム');
  assert.equal(typeLike('ro-mazi', 'ローマじ'), 'ローマじ');
  assert.equal(typeLike('e-to', 'えーと'), 'えーと');
  assert.equal(typeLike('toukyoudhizuni-rando', 'とうきょうディズニーランド'), 'とうきょうディズニーランド');
  assert.equal(typeLike('sensei', 'せんせい'), 'せんせい', 'từ hiragana không đổi');
  assert.equal(typeLike('k', 'エアコン'), 'k', 'phần Latin còn dở giữ nguyên');
});

test('scriptOf: phân loại chữ viết của từ', () => {
  assert.equal(scriptOf('エアコン'), 'kata');
  assert.equal(scriptOf('コーヒー'), 'kata');
  assert.equal(scriptOf('コピーします'), 'mixed');
  assert.equal(scriptOf('ほてる'), 'hira');
  assert.equal(scriptOf('えーと'), 'hira');
});

test('mọi từ trong sách: gõ romaji được chấm đúng và chữ hiện đúng chữ viết (katakana/hiragana) của từ ở từng vị trí', () => {
  const bad = [];
  for (const w of VOCAB) {
    const target = [...w.kana.replace(/\s/g, '')];
    const shown = [...typeLike(romajiOf(w).replace(/\s/g, ''), w.kana)];
    const wrongScript = shown.some((c, i) => (/[ァ-ヺ]/.test(target[i] ?? '') && /[ぁ-ゖ]/.test(c)) || (/[ぁ-ゖ]/.test(target[i] ?? '') && /[ァ-ヺ]/.test(c)));
    if (wrongScript || !matchesWord(finalizeKana(shown.join('')), w)) bad.push(`${w.kana}: ${shown.join('')}`);
  }
  assert.deepEqual(bad, []);
});

test('gõ ー bằng dấu - ở từ katakana: hiện đúng từ, không lẫn hiragana', () => {
  const bad = [];
  for (const w of VOCAB.filter(x => x.kana.includes('ー'))) {
    const keys = toRomaji(w.kana).replace(/\s/g, '');
    // romaji của từ có ー thường ghi nguyên âm kép; thay lại bằng "-" như người dùng gõ thật
    const dash = keys.replace(/([aiueo])\1/g, '$1-');
    const shown = typeLike(dash, w.kana);
    if (shown !== w.kana.replace(/\s/g, '') && !matchesWord(finalizeKana(shown), w)) bad.push(`${w.kana}: ${shown}`);
  }
  assert.deepEqual(bad, []);
});
