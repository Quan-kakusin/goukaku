import test from 'node:test';
import assert from 'node:assert/strict';
import { PAPERS, buildPaper } from '../js/mock.js';
import SCRIPT_VI from '../data/jlpt/script-vi.js';

const listening = PAPERS.flatMap(p => buildPaper(p).questions).filter(q => q.kind === 'choukai');

test('câu nghe nào cũng có lời thoại và bản dịch đúng từng dòng', () => {
  const bad = [];
  for (const q of listening) {
    const lines = q.script ?? q.audio;
    if (!lines?.length) bad.push(`${q.id}: thiếu lời thoại`);
    else if (q.scriptVi?.length !== lines.length) bad.push(`${q.id}: bản dịch lệch số dòng`);
    else if (!q.scriptVi.every(s => s.trim())) bad.push(`${q.id}: có dòng dịch rỗng`);
  }
  assert.deepEqual(bad, []);
});

test('bản dịch không có khóa thừa và không có chữ Hán', () => {
  const ids = new Set(listening.map(q => q.id));
  assert.deepEqual(Object.keys(SCRIPT_VI).filter(id => !ids.has(id)), []);
  assert.deepEqual(Object.entries(SCRIPT_VI).filter(([, lines]) => /[㐀-鿿]/.test(lines.join(''))).map(([id]) => id), []);
});

test('đề có file âm thanh thật: lời chép nằm ở script, không bật giọng đọc máy', () => {
  for (const q of listening.filter(x => x.audioSrc)) {
    assert.ok(q.script, `${q.id}: thiếu lời chép`);
    assert.equal(q.audio, undefined, q.id);
  }
});
