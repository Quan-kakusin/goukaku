import test from 'node:test';
import assert from 'node:assert/strict';
import { KANJI } from '../data/kanji-n5.js';
import { KANJI_NOTES, CONFUSABLE } from '../data/kanji-notes.js';
import { applyResult, dueKeys, newKeys, summary, DAY, INTERVAL_DAYS } from '../js/srs.js';
import { ALL_KEYS, keyOfQuestion, buildSession, questionOfKey, sessionQuestions } from '../js/kanji-study.js';
import { kanjiHvQuestion, resolveQuestion, confusablesOf, KINDS, KANJI_WORDS } from '../js/questions.js';
import { normalize, defaults } from '../js/storage.js';

test('mẹo nhớ: đủ 80 chữ, mỗi chữ có mẹo, nhóm dễ nhầm chỉ gồm chữ N5', () => {
  const chars = KANJI.map(k => k.char);
  assert.deepEqual(chars.filter(c => !KANJI_NOTES[c]?.[1]), []);
  assert.deepEqual(Object.keys(KANJI_NOTES).filter(c => !chars.includes(c)), []);
  for (const g of CONFUSABLE) {
    assert.ok(g.length >= 2 && g.every(c => chars.includes(c)), g.join(''));
    assert.equal(new Set(g).size, g.length);
  }
});

test('SRS: đúng thì lên hộp và hẹn ngày ôn; sai thì về hộp 1 và ôn ngay', () => {
  const t = 1_000_000;
  let b = applyResult({}, 'kc:日', true, t);
  assert.deepEqual(b['kc:日'], { box: 1, due: t + INTERVAL_DAYS[0] * DAY, ok: 1, ng: 0 });
  b = applyResult(b, 'kc:日', true, t + DAY);
  assert.equal(b['kc:日'].box, 2);
  assert.equal(b['kc:日'].due, t + DAY + 3 * DAY);
  b = applyResult(b, 'kc:日', false, t + 2 * DAY);
  assert.deepEqual(b['kc:日'], { box: 1, due: t + 2 * DAY, ok: 2, ng: 1 });
});

test('SRS: làm đúng sớm hơn hạn không được lên hộp, hộp tối đa là 5', () => {
  const t = 5000;
  let b = applyResult({}, 'kc:月', true, t);
  b = applyResult(b, 'kc:月', true, t + 1000); // chưa đến hạn
  assert.equal(b['kc:月'].box, 1);
  assert.equal(b['kc:月'].ok, 2);
  let x = {};
  let now = t;
  for (let i = 0; i < 9; i += 1) {
    x = applyResult(x, 'kc:火', true, now);
    now = x['kc:火'].due;
  }
  assert.equal(x['kc:火'].box, 5);
});

test('SRS: mục đến hạn xếp cũ nhất trước, mục mới giữ thứ tự học, thống kê khớp', () => {
  const book = { 'kc:A': { box: 1, due: 50, ok: 1, ng: 0 }, 'kc:B': { box: 5, due: 10, ok: 5, ng: 0 }, 'kc:C': { box: 2, due: 999, ok: 1, ng: 0 } };
  assert.deepEqual(dueKeys(book, 100), ['kc:B', 'kc:A']);
  assert.deepEqual(newKeys(book, ['kc:A', 'kc:X', 'kc:C', 'kc:Y']), ['kc:X', 'kc:Y']);
  const s = summary(book, ['kc:A', 'kc:B', 'kc:C', 'kc:X'], 100);
  assert.deepEqual({ total: s.total, learned: s.learned, fresh: s.fresh, due: s.due, mastered: s.mastered }, { total: 4, learned: 3, fresh: 1, due: 2, mastered: 1 });
});

test('kanji-study: mục khớp dữ liệu, id câu hỏi ánh xạ đúng mục', () => {
  assert.equal(ALL_KEYS.length, KANJI.length + KANJI_WORDS.length);
  assert.equal(new Set(ALL_KEYS).size, ALL_KEYS.length);
  assert.equal(keyOfQuestion('k:日曜日'), 'kw:日曜日');
  assert.equal(keyOfQuestion('p:日曜日'), 'kw:日曜日');
  assert.equal(keyOfQuestion('h:日'), 'kc:日');
  assert.equal(keyOfQuestion('x:6:cloze:ab'), null);
  assert.equal(keyOfQuestion('v:n5:私'), null);
  for (const key of ALL_KEYS) assert.ok(questionOfKey(key), key);
});

test('kanji-study: lượt ôn lấy mục đến hạn trước rồi mục mới, đúng số lượng', () => {
  const book = { 'kc:一': { box: 1, due: 0, ok: 1, ng: 0 } };
  const s = buildSession({ book, newCount: 3, now: 10 });
  assert.deepEqual(s.due, ['kc:一']);
  assert.equal(s.fresh.length, 3);
  assert.ok(!s.fresh.includes('kc:一'));
  assert.equal(sessionQuestions(s.keys).length, 4);
});

test('Hán Việt → chữ: 80 câu hợp lệ, đáp án nhiễu ưu tiên chữ dễ nhầm, dựng lại được từ id', () => {
  const prompts = new Set();
  for (const k of KANJI) {
    const q = kanjiHvQuestion(k);
    assert.equal(q.choices.length, 4);
    assert.equal(new Set(q.choices).size, 4, k.char);
    assert.ok(q.choices.includes(k.char) && q.answer === k.char);
    assert.equal(q.plain, true);
    prompts.add(q.prompt);
    const mates = confusablesOf(k.char);
    const take = Math.min(3, mates.length);
    assert.ok(mates.slice(0, take).every(m => q.choices.includes(m) || mates.length > 3), `${k.char}: thiếu chữ dễ nhầm`);
    assert.equal(resolveQuestion(q.id).answer, k.char);
  }
  assert.equal(prompts.size, KANJI.length, 'mỗi đề phải chỉ có một đáp án (Hán Việt + nghĩa không trùng)');
  assert.ok(KINDS.kanjihv);
});

test('lưu trữ: sổ SRS được kiểm tra khi nhập, mục sai bị bỏ', () => {
  assert.deepEqual(defaults().srs, {});
  const out = normalize({
    custom: [],
    srs: { 'kw:日曜日': { box: 2, due: 5, ok: 3, ng: 1 }, 'kc:月': { box: 9, due: 5 }, 'x:lạ': { box: 1, due: 1 }, 'kc:火': { box: 1, due: 'mai' } },
  });
  assert.deepEqual(Object.keys(out.srs), ['kw:日曜日']);
  assert.deepEqual(out.srs['kw:日曜日'], { box: 2, due: 5, ok: 3, ng: 1 });
});
