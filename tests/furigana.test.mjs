import test from 'node:test';
import assert from 'node:assert/strict';
import { annotate, mainReading, MAIN_READING } from '../js/furigana.js';
import { KANJI } from '../data/kanji-n5.js';
import { PAPERS, buildPaper } from '../js/mock.js';

const show = text => annotate(text).map(p => (p.ruby ? `${p.text}[${p.ruby}]` : p.text)).join('');

test('mỗi chữ trong 80 chữ Kanji đều có cách đọc chính (toàn hiragana)', () => {
  for (const k of KANJI) {
    const r = mainReading(k);
    assert.match(r, /^[぀-ゟ]+$/, `${k.char}: ${r}`);
    assert.ok(MAIN_READING[k.char], `${k.char} chưa có trong bảng MAIN_READING`);
  }
  assert.equal(Object.keys(MAIN_READING).length, KANJI.length, 'bảng không có chữ thừa');
});

test('annotate: từ trong từ vựng, gốc động từ + okurigana', () => {
  assert.equal(show('先生は 学校で 日本語を 教えて います。'), '先生[せんせい]は 学校[がっこう]で 日本語[にほんご]を 教[おし]えて います。');
  assert.equal(show('電車で 会社へ 行きます'), '電車[でんしゃ]で 会社[かいしゃ]へ 行[い]きます');
  assert.equal(show('友だちと 話します'), '友[とも]だちと 話[はな]します');
});

test('annotate: chữ có nhiều cách đọc chọn theo ngữ cảnh', () => {
  assert.equal(show('来ます'), '来[き]ます');
  assert.equal(show('来ない'), '来[こ]ない');
  assert.equal(show('来る'), '来[く]る');
  assert.equal(show('出ます'), '出[で]ます');
  assert.equal(show('出して'), '出[だ]して');
  assert.equal(show('入ります'), '入[はい]ります');
  assert.equal(show('入れます'), '入[い]れます');
});

test('annotate: thứ trong tuần, ngày tháng, số và đơn vị đếm', () => {
  assert.equal(show('月よう日'), '月[げつ]よう日[び]');
  assert.equal(show('日よう日'), '日[にち]よう日[び]');
  assert.equal(show('6月11日(月)'), '6月[がつ]11日[にち](月[げつ])');
  assert.equal(show('1日と 20日'), '1日[ついたち]と 20日[はつか]');
  assert.equal(show('十時 十二時 九時'), '十時[じゅうじ] 十二時[じゅうにじ] 九時[くじ]');
  assert.equal(show('三百円 四百円'), '三百円[さんびゃくえん] 四百円[よんひゃくえん]');
  assert.equal(show('十五分 一分 三分'), '十五分[じゅうごふん] 一分[いっぷん] 三分[さんぷん]');
  assert.equal(show('1000円'), '1000円[えん]');
});

test('annotate: chữ chưa biết cách đọc thì để nguyên, không đoán; câu toàn kana không đổi', () => {
  assert.equal(show('鬱'), '鬱');
  assert.equal(show('あさ ごはんを たべます。'), 'あさ ごはんを たべます。');
  assert.equal(annotate('').length, 0);
});

test('annotate: ghép lại các đoạn luôn ra đúng câu gốc (không mất, không thừa chữ)', () => {
  for (const p of PAPERS) {
    for (const q of buildPaper(p).questions) {
      for (const t of [q.prompt, q.passage ?? '', ...q.choices]) assert.equal(annotate(t).map(x => x.text).join(''), t, q.id);
    }
  }
});

test('đề thi: câu đọc/viết kanji (問題1, 問題2) không hiện furigana, các câu khác thì có', () => {
  for (const p of PAPERS) {
    const qs = buildPaper(p).questions;
    for (const q of qs) assert.equal(q.plain, q.kind === 'moji' && /:m[12]-/.test(q.id), q.id);
    assert.ok(qs.some(q => q.plain) && qs.some(q => !q.plain));
  }
});
