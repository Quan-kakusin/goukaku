import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, defaults, getState, recordLessonScore, resetState, addExam, clearExams, MAX_EXAMS } from '../js/storage.js';

const item = (ok, extra = {}) => ({ qid: 'g:wo-1', kind: 'grammar', section: 'grammar', lesson: 6, choices: ['を', 'が', 'に', 'で'], chosen: ok ? 'を' : 'が', ok, flagged: false, ...extra });
const exam = (id, oks = [true, false], extra = {}) => ({ id, at: 1000, title: 'Đề', mode: 'exam', seconds: 90, limit: 600, percent: 0, items: oks.map(ok => item(ok)), ...extra });

test('dữ liệu mặc định hợp lệ và qua được normalize', () => {
  assert.deepEqual(normalize(defaults()), defaults());
});

test('normalize từ chối file lạ', () => {
  assert.throws(() => normalize(null), /không đúng định dạng/);
  assert.throws(() => normalize({}), /không đúng định dạng/);
  assert.throws(() => normalize([]), /không đúng định dạng/);
  assert.throws(() => normalize({ custom: 'không phải mảng' }), /không đúng định dạng/);
});

test('file sao lưu của bản cũ (có thẻ nhớ, chuỗi ngày...) vẫn nhập được, phần không còn dùng bị bỏ', () => {
  const out = normalize({
    version: 1,
    cards: { 'n5:私': { ef: 2.5, interval: 3, reps: 1, due: 1 } },
    days: { '2026-10-20': { reviews: 5, correct: 4, newCards: 1 } },
    custom: [{ id: 'c:1', word: '猫', kana: 'ねこ', vi: 'Mèo', topic: 'Từ của tôi' }],
    mistakes: { 'g:wo-1': { type: 'grammar', wrong: 2, streak: 0, last: 5 } },
    settings: { newPerDay: 50, dailyGoal: 99, mode: 'recall', currentLesson: 4 },
  });
  assert.ok(!('cards' in out) && !('days' in out));
  assert.deepEqual(Object.keys(out.settings), ['hideSuggested'], 'bài đang học không còn là một cài đặt');
  assert.equal(out.custom[0].lesson, 0);
  assert.equal(out.mistakes['g:wo-1'].wrong, 2);
});

test('normalize bỏ mục hỏng và giữ từ riêng hợp lệ', () => {
  const out = normalize(
    JSON.parse(`{
      "custom": [
        { "id": "c1", "word": "猫", "kana": "ねこ", "vi": "Mèo" },
        { "id": "c2", "word": "", "kana": "x", "vi": "y" },
        "rác"
      ],
      "kana": { "あ": { "ok": 1, "ng": 2 }, "__proto__": { "ok": 1, "ng": 1 }, "い": { "ok": "x" } }
    }`),
  );
  assert.equal(out.custom.length, 1);
  assert.deepEqual(Object.keys(out.kana), ['あ']);
  assert.equal(Object.getPrototypeOf(out.kana), Object.prototype);
});

test('từ riêng giữ số bài hợp lệ, số bài sai rơi về 0', () => {
  const mk = lesson => ({ id: `c:${lesson}`, word: '猫', kana: 'ねこ', vi: 'Mèo', lesson });
  const out = normalize({ custom: [mk(7), mk(25), mk(26), mk(-1), mk(2.5), mk('7')] });
  assert.deepEqual(out.custom.map(w => w.lesson), [7, 25, 0, 0, 0, 0]);
});

test('điểm các bài và cài đặt được làm sạch khi nhập; dữ liệu cũ về bài đã học xong bị bỏ qua', () => {
  const out = normalize(
    JSON.parse(`{
      "custom": [],
      "lessons": { "3": { "best": 85, "last": 60, "attempts": 4, "at": 100 }, "12": { "best": 250 }, "0": { "best": 50 }, "26": { "best": 50 }, "x": { "best": 50 }, "5": { "best": "cao" } },
      "learned": { "2": true, "3": false, "30": true, "abc": true },
      "settings": { "currentLesson": 99, "hideSuggested": { "4": true, "5": false, "30": true, "abc": true } }
    }`),
  );
  assert.deepEqual(Object.keys(out.lessons), ['3', '12']);
  assert.deepEqual(out.lessons[3], { best: 85, last: 60, attempts: 4, at: 100 });
  assert.equal(out.lessons[12].best, 100);
  assert.equal('learned' in out, false);
  assert.equal('currentLesson' in out.settings, false);
  assert.deepEqual(out.settings.hideSuggested, { 4: true });
});

test('lịch sử đề: bỏ mục hỏng, tính lại điểm, giới hạn số lượng', () => {
  const good = exam('ok', [true, true, false, false]);
  const bad = [
    exam('khong-co-cau', []),
    { ...exam('thieu-id'), id: '' },
    { ...exam('items-hong'), items: [{ qid: 1 }, 'rác'] },
    exam('section-la', [true], { items: [item(true, { section: 'abc' })] }),
    exam('choices-hong', [true], { items: [item(true, { choices: [1, 2] })] }),
    'rác',
  ];
  const many = Array.from({ length: MAX_EXAMS + 10 }, (_, i) => exam(`e${i}`));
  const out = normalize({ custom: [], exams: [good, ...bad, ...many] });
  assert.equal(out.exams.length, MAX_EXAMS, 'giới hạn số lần làm lưu lại');
  assert.equal(out.exams[0].id, 'ok');
  assert.equal(out.exams[0].percent, 50, 'điểm tính lại từ các câu, không tin số trong file');
  assert.ok(!out.exams.some(e => ['khong-co-cau', 'thieu-id', 'items-hong', 'section-la', 'choices-hong'].includes(e.id)));
  const e = normalize({ custom: [], exams: [exam('x', [true], { mode: 'la', limit: -3, seconds: -4, title: 'T'.repeat(500), items: [item(true, { lesson: 99, flagged: 'yes' })] })] }).exams[0];
  assert.equal(e.mode, 'practice');
  assert.equal(e.limit, null);
  assert.equal(e.seconds, 0);
  assert.equal(e.title.length, 120);
  assert.equal(e.items[0].lesson, 0);
  assert.equal(e.items[0].flagged, false);
});

test('addExam: mới nhất đứng đầu, trùng id thì thay, từ chối kết quả hỏng, xóa được lịch sử', () => {
  resetState();
  addExam(exam('a'));
  addExam(exam('b'));
  addExam(exam('a', [true, true]));
  assert.deepEqual(getState().exams.map(e => e.id), ['a', 'b']);
  assert.equal(getState().exams[0].percent, 100);
  assert.throws(() => addExam({ id: 'x' }), /không hợp lệ/);
  for (let i = 0; i < MAX_EXAMS + 5; i += 1) addExam(exam(`n${i}`));
  assert.equal(getState().exams.length, MAX_EXAMS);
  clearExams();
  assert.deepEqual(getState().exams, []);
  resetState();
});

test('recordLessonScore giữ điểm cao nhất, nhớ điểm lần cuối và đếm số lần làm', () => {
  resetState();
  recordLessonScore(4, 60, 1000);
  recordLessonScore(4, 90, 2000);
  recordLessonScore(4, 40.6, 3000);
  assert.deepEqual(getState().lessons[4], { best: 90, last: 41, attempts: 3, at: 3000 });
  recordLessonScore(9, 150, 1);
  assert.equal(getState().lessons[9].best, 100);
  resetState();
});

