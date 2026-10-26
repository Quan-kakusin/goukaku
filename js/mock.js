// Đề thi thử JLPT N5 đầy đủ: dựng câu hỏi từ data/jlpt, chấm điểm theo thang 180 của JLPT. Hàm thuần, không đụng DOM/storage.

import de01 from '../data/jlpt/de-01.js';
import de02 from '../data/jlpt/de-02.js';

export const PAPERS = [de01, de02];
export const getPaper = id => PAPERS.find(p => p.id === id) ?? null;

// Thang điểm N5: 言語知識(文字・語彙・文法)・読解 120 điểm, 聴解 60 điểm. Đậu khi tổng ≥ 80 và mỗi phần ≥ mức sàn.
export const SCALE = { written: 120, listening: 60 };
export const PASS = { total: 80, written: 38, listening: 19 };

// Xáo trộn ổn định theo id để thứ tự cụm trong dạng sắp xếp câu không lộ đáp án và không đổi giữa các lần dựng
function stableShuffle(arr, seed) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rng = () => {
    h = (Math.imul(h ^ (h >>> 15), 2246822519) + 0x9e3779b9) >>> 0;
    return h / 4294967296;
  };
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toQuestion(paper, part, section, raw, n) {
  const id = `j:${paper.id}:${section.id}-${n}`;
  const answer = raw.choices[raw.answer - 1];
  // Dạng sắp xếp câu tự soạn thì xáo cụm cho khỏi lộ đáp án; đề chép từ sách (keepOrder) giữ nguyên thứ tự in
  const choices = section.sort && !section.keepOrder ? stableShuffle(raw.choices, id) : raw.choices;
  return {
    id,
    type: section.kind,
    kind: section.kind,
    prompt: raw.prompt,
    choices,
    answer,
    explain: raw.explain,
    tag: `${section.mondai} · ${section.title}`,
    promptLang: section.audioChoices ? 'vi' : 'ja',
    choiceLang: section.audioChoices ? undefined : 'ja',
    mondai: section.mondai,
    instr: section.instr,
    instrVi: section.instrVi,
    passage: raw.passage ?? section.passage,
    passageVi: raw.passageVi ?? section.passageVi,
    audio: raw.audio,
    audioSrc: section.audioSrc,
    image: raw.image,
    bare: raw.bare ?? section.bare ?? false,
    scriptVi: raw.scriptVi,
    plays: section.plays,
    // 問題1 (đọc kanji) và 問題2 (viết kanji) kiểm tra chính cách đọc/viết, nên không được hiện furigana
    plain: section.kind === 'moji' && ['m1', 'm2'].includes(section.id),
    partKey: part.key,
    ref: { mock: paper.id },
  };
}

// Mọi câu của một đề theo thứ tự thi. Mỗi phần thi có khoảng [from, to] trong danh sách.
// includeListening=false: bỏ phần nghe (máy chưa có giọng tiếng Nhật).
// partKeys: chỉ lấy các phần thi có key này (làm từng phần); không truyền thì lấy cả đề.
export function buildPaper(paper, { includeListening = true, partKeys = null } = {}) {
  const questions = [];
  const parts = [];
  for (const part of paper.parts) {
    if (part.listening && !includeListening) continue;
    if (partKeys && !partKeys.includes(part.key)) continue;
    const from = questions.length;
    for (const section of part.sections) section.questions.forEach((raw, i) => questions.push(toQuestion(paper, part, section, raw, i + 1)));
    parts.push({ key: part.key, name: part.name, vi: part.vi, intro: part.intro, listening: Boolean(part.listening), audioFiles: part.sections.some(s => s.audioSrc), limitSec: part.minutes * 60, from, to: questions.length - 1 });
  }
  return { questions, parts };
}

const index = new Map(PAPERS.flatMap(paper => buildPaper(paper).questions.map(q => [q.id, q])));

// Dựng lại một câu từ id (sổ lỗi, lịch sử). Trả về null nếu đề không còn.
export const findMockQuestion = id => index.get(id) ?? null;

export const paperSize = (paper, opts) => buildPaper(paper, opts).questions.length;

const WRITTEN = ['moji', 'bunpou', 'dokkai'];
// Phần thi viết gồm những mục nào: dùng để biết người làm chỉ làm một phần
const WRITTEN_PARTS = [
  { key: 'moji', label: '文字・語彙', sections: ['moji'] },
  { key: 'bunpou-dokkai', label: '文法・読解', sections: ['bunpou', 'dokkai'] },
  { key: 'choukai', label: '聴解', sections: ['choukai'] },
];

// items: các mục trong lịch sử (section, ok). Trả về điểm từng phần thi thang JLPT và kết quả đậu/rớt.
export function scoreMock(items) {
  const by = {};
  for (const it of items) {
    by[it.section] ??= { correct: 0, total: 0 };
    by[it.section].total += 1;
    if (it.ok) by[it.section].correct += 1;
  }
  const sum = keys => keys.reduce((a, k) => ({ correct: a.correct + (by[k]?.correct ?? 0), total: a.total + (by[k]?.total ?? 0) }), { correct: 0, total: 0 });
  const written = sum(WRITTEN);
  const listening = sum(['choukai']);
  const scaled = ({ correct, total }, max) => (total ? Math.round((max * correct) / total) : null);
  const writtenScore = scaled(written, SCALE.written);
  const listeningScore = scaled(listening, SCALE.listening);
  const hasListening = listening.total > 0;
  const total = hasListening ? writtenScore + listeningScore : null;
  const passWritten = writtenScore !== null && writtenScore >= PASS.written;
  const passListening = hasListening && listeningScore >= PASS.listening;
  // Chỉ làm một trong hai phần thi viết: chưa đủ để quy ra thang 120 điểm hay so với mức sàn, chỉ báo số câu đúng từng phần
  const partScores = WRITTEN_PARTS.map(p => {
    const t = p.sections.reduce((a, k) => ({ correct: a.correct + (by[k]?.correct ?? 0), total: a.total + (by[k]?.total ?? 0) }), { correct: 0, total: 0 });
    return { key: p.key, label: p.label, ...t, percent: t.total ? Math.round((100 * t.correct) / t.total) : 0 };
  }).filter(p => p.total > 0);
  // Thiếu một trong hai phần thi viết (kể cả chỉ làm phần nghe) thì chỉ báo từng phần
  const doneKeys = new Set(partScores.map(p => p.key));
  const partial = (written.total > 0 || listening.total > 0) && !(doneKeys.has('moji') && doneKeys.has('bunpou-dokkai'));
  return {
    by,
    partial,
    partScores,
    written: { ...written, score: partial ? null : writtenScore, max: SCALE.written, pass: partial ? null : passWritten },
    listening: { ...listening, score: partial ? null : listeningScore, max: SCALE.listening, pass: partial ? null : passListening },
    total: partial ? null : total,
    max: hasListening && !partial ? SCALE.written + SCALE.listening : null,
    // Chỉ kết luận đậu/rớt khi làm đủ cả phần nghe
    passed: hasListening && !partial ? total >= PASS.total && passWritten && passListening : null,
  };
}
