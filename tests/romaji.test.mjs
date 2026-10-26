import test from 'node:test';
import assert from 'node:assert/strict';
import { toRomaji, romajiOf, matchesRomaji, matchesWord, canon } from '../js/romaji.js';
import { buildKanaSet, toKatakana, toHiragana } from '../js/kana-data.js';

test('kana sang romaji', () => {
  assert.equal(toRomaji('がっこう'), 'gakkou');
  assert.equal(toRomaji('きょう'), 'kyou');
  assert.equal(toRomaji('ちょっと'), 'chotto');
  assert.equal(toRomaji('まっちゃ'), 'matcha');
  assert.equal(toRomaji('コーヒー'), 'koohii');
  assert.equal(toRomaji('ありがとうございます'), 'arigatougozaimasu');
  assert.equal(toRomaji('ほんや'), 'honya');
  assert.equal(toRomaji('お元気'), 'o元気', 'chữ Hán được giữ nguyên');
});

test('đổi qua lại hiragana và katakana', () => {
  assert.equal(toKatakana('きょうは'), 'キョウハ');
  assert.equal(toHiragana('キョウハ'), 'きょうは');
  assert.equal(toKatakana('ー'), 'ー');
});

test('luyện kana: chấp nhận cách gõ khác nhưng không dễ dãi về độ dài', () => {
  assert.ok(matchesRomaji('si', 'shi'));
  assert.ok(matchesRomaji('SHI ', 'shi'));
  assert.ok(matchesRomaji('tya', 'cha'));
  assert.ok(matchesRomaji('di', 'ji', { alts: ['di'] }));
  assert.ok(!matchesRomaji('oo', 'o'));
  assert.ok(!matchesRomaji('', 'a'));
  assert.ok(!matchesRomaji('ka', 'ki'));
});

test('canon bỏ dấu cách, dấu nháy và quy macron', () => {
  assert.equal(canon("hon'ya"), 'honya');
  assert.equal(canon('kyō', { lenient: true }), 'kyo');
});

test('đáp án từ vựng: chữ, kana, katakana hoặc romaji', () => {
  const w = { word: '今日', kana: 'きょう' };
  assert.ok(matchesWord('今日', w));
  assert.ok(matchesWord(' きょう ', w));
  assert.ok(matchesWord('キョウ', w));
  assert.ok(matchesWord('kyou', w));
  assert.ok(matchesWord('kyo', w), 'bỏ qua độ dài nguyên âm khi gõ từ vựng');
  assert.ok(!matchesWord('あした', w));
  assert.ok(!matchesWord('', w));
});

test('lời chào có は đọc là "wa" dùng romaji ghi tay', () => {
  const greeting = { word: 'こんにちは', kana: 'こんにちは', romaji: 'konnichiwa' };
  assert.equal(toRomaji(greeting.kana), 'konnichiha', 'romaji tự sinh sẽ sai');
  assert.equal(romajiOf(greeting), 'konnichiwa');
  assert.ok(matchesWord('konnichiwa', greeting));
  assert.ok(matchesWord('こんにちは', greeting));
  assert.equal(romajiOf({ word: 'がっこう', kana: 'がっこう' }), 'gakkou', 'từ thường vẫn tự sinh');
});

test('bộ kana để luyện', () => {
  const set = buildKanaSet(['hira', 'kata'], ['basic']);
  assert.equal(set.length, 46 * 2);
  assert.ok(set.every(k => k.romaji));
  const chars = new Set(set.map(k => k.char));
  assert.equal(chars.size, set.length, 'không có ký tự trùng');
  assert.deepEqual(buildKanaSet(['kata'], ['yoon']).slice(0, 3).map(k => k.char), ['キャ', 'キュ', 'キョ']);
});
