// Bài tập của từng bài: sinh nhiều dạng câu hỏi từ từ vựng, câu ví dụ, bảng, lỗi hay gặp và công thức của chính bài đó.
// Hàm thuần, không đụng DOM/storage. Kết quả cố định theo dữ liệu (đáp án nhiễu chọn bằng rng gieo từ id câu) nên id ổn định:
// sổ lỗi sai và lịch sử đề dựng lại được đúng câu hỏi từ id 'x:<bài>:<dạng>:<mã>'.

import { LESSONS, LESSON_COUNT } from '../data/lessons.js';

// group: nhóm hiện trên trang Bài tập. section: phần thống kê (vocab | grammar).
export const EX_KINDS = {
  cloze: { group: 'vocab', section: 'vocab', label: 'Từ vựng: điền từ vào câu', short: 'Điền từ', title: 'Điền từ vào câu', desc: 'Chọn từ vựng của bài điền vào chỗ trống trong câu ví dụ.' },
  particle: { group: 'sentence', section: 'grammar', label: 'Ngữ pháp: điền trợ từ', short: 'Điền trợ từ', title: 'Điền trợ từ', desc: 'Câu ví dụ của bài bị che một trợ từ (は, が, を, に, で, へ, と, も, の…), chọn trợ từ đúng.' },
  order: { group: 'sentence', section: 'grammar', label: 'Ngữ pháp: sắp xếp câu', short: 'Sắp xếp câu', title: 'Sắp xếp thành câu', desc: 'Các cụm từ bị xáo trộn, chọn thứ tự đúng để thành câu. Nhớ vị ngữ đứng cuối câu.' },
  jp2vi: { group: 'sentence', section: 'grammar', label: 'Ngữ pháp: hiểu nghĩa câu', short: 'Hiểu nghĩa câu', title: 'Hiểu nghĩa câu Nhật', desc: 'Đọc câu tiếng Nhật, chọn nghĩa tiếng Việt đúng.' },
  vi2jp: { group: 'sentence', section: 'grammar', label: 'Ngữ pháp: chọn câu Nhật', short: 'Chọn câu Nhật', title: 'Chọn câu tiếng Nhật đúng', desc: 'Đọc nghĩa tiếng Việt, chọn câu tiếng Nhật đúng ngữ pháp của bài.' },
  formula: { group: 'formula', section: 'grammar', label: 'Công thức: nghĩa → mẫu câu', short: 'Nghĩa → mẫu câu', title: 'Nghĩa → mẫu câu', desc: 'Cho nghĩa, chọn công thức mẫu câu tương ứng.' },
  usage: { group: 'formula', section: 'grammar', label: 'Công thức: mẫu câu → nghĩa', short: 'Mẫu câu → nghĩa', title: 'Mẫu câu → nghĩa', desc: 'Cho công thức mẫu câu, chọn ý nghĩa đúng.' },
  table: { group: 'formula', section: 'grammar', label: 'Công thức: bảng tổng hợp', short: 'Bảng tổng hợp', title: 'Hoàn thành bảng', desc: 'Nhớ lại nội dung các bảng tổng hợp của bài (động từ, từ hỏi, cách dùng…).' },
  role: { group: 'formula', section: 'grammar', label: 'Công thức: vai trò từng thành phần', short: 'Vai trò trong câu', title: 'Vai trò trong câu', desc: 'Một thành phần của câu mẫu có vai trò gì (chủ đề, đối tượng, nơi chốn…).' },
  correct: { group: 'mistake', section: 'grammar', label: 'Lỗi hay gặp: chọn câu đúng', short: 'Chọn câu đúng', title: 'Chọn câu đúng', desc: 'Một câu đúng lẫn trong các câu sai thường gặp của bài.' },
  wrongone: { group: 'mistake', section: 'grammar', label: 'Lỗi hay gặp: tìm câu sai', short: 'Tìm câu sai', title: 'Tìm câu sai', desc: 'Ba câu đúng và một câu sai, tìm ra câu sai.' },
};

export const EX_GROUPS = [
  { id: 'vocab', title: 'Từ vựng', desc: 'Ôn từ mới của bài.' },
  { id: 'sentence', title: 'Câu và trợ từ', desc: 'Luyện cả câu từ ví dụ trong bài.' },
  { id: 'formula', title: 'Công thức mẫu câu', desc: 'Nhớ công thức, ý nghĩa và các bảng của bài.' },
  { id: 'mistake', title: 'Lỗi hay gặp', desc: 'Phân biệt câu đúng và câu sai.' },
];

// ---- Số ngẫu nhiên gieo từ id: cùng id cho cùng đáp án nhiễu ----
function hash(str) {
  let x = 2166136261;
  for (const c of str) {
    x ^= c.codePointAt(0);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}

function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuf(arr, r) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const uniq = arr => [...new Set(arr)];
const PUNCT_END = /[。、？！?!]+$/;

// ---- Dữ liệu nguồn của một bài ----
// Câu ví dụ (ngữ pháp, phân tích câu, ví dụ của từ vựng), bỏ trùng
function sentencesOf(l) {
  const out = [];
  const seen = new Set();
  const add = (jp, vi, src) => {
    const t = (jp ?? '').trim();
    if (!t || !vi || seen.has(t)) return;
    seen.add(t);
    out.push({ jp: t, vi: vi.trim(), ...src });
  };
  for (const p of l.grammar) {
    for (const e of p.examples) add(e.jp, e.vi, { patternId: p.id, title: p.title });
    if (p.breakdown) add(p.breakdown.jp, p.breakdown.vi, { patternId: p.id, title: p.title });
  }
  for (const w of l.vocab) if (w.ex) add(w.ex, w.exVi, { wordId: w.id, title: 'Từ vựng' });
  return out;
}

export const lessonSentences = n => sentencesOf(LESSONS[n - 1]);

// Cách đọc của mọi từ vựng: để nhận biết "danh từ + trợ từ" khi che trợ từ
const KANA_WORDS = new Set(LESSONS.flatMap(l => l.vocab.map(w => w.kana)));
const PARTICLES = ['から', 'まで', 'は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'や'];
// Trợ từ cùng nhóm dễ lẫn: không đưa vào đáp án nhiễu của nhau
const CONFUSABLE = [['は', 'が', 'を', 'も', 'の'], ['に', 'へ', 'で'], ['と', 'や'], ['から', 'まで']];
const PARTICLE_NOTE = {
  は: 'は đánh dấu chủ đề của câu',
  が: 'が đánh dấu chủ ngữ, hoặc đối tượng của すき, わかります, あります, います...',
  を: 'を đánh dấu tân ngữ của động từ',
  に: 'に chỉ thời điểm, nơi đến, nơi tồn tại hoặc người nhận',
  で: 'で chỉ phương tiện, nơi diễn ra hành động hoặc cách thức',
  へ: 'へ chỉ phương hướng di chuyển (đọc là え)',
  と: 'と nghĩa là "và" hoặc "cùng với"',
  も: 'も nghĩa là "cũng"',
  の: 'の nối hai danh từ (của, thuộc về)',
  から: 'から nghĩa là "từ" (mốc bắt đầu) hoặc "vì"',
  まで: 'まで nghĩa là "đến" (mốc kết thúc)',
  や: 'や dùng liệt kê vài thứ tiêu biểu (A や B)',
};

// Cụm "danh từ + trợ từ" mà chắc chắn là trợ từ: danh từ phải là từ vựng đã biết, tên người (～さん) hoặc từ katakana
function particleOf(token) {
  const t = token.replace(PUNCT_END, '');
  if (KANA_WORDS.has(t)) return null; // cả cụm đã là một từ (こども, いっしょに...)
  const suffix = PARTICLES.find(p => t.length > p.length && t.endsWith(p));
  if (!suffix) return null;
  const stem = t.slice(0, -suffix.length);
  const known = KANA_WORDS.has(stem) || /(さん|ちゃん|くん)$/.test(stem) || /^[ァ-ヺー]+$/.test(stem);
  return known ? { particle: suffix, stem } : null;
}

const confusableGroup = p => CONFUSABLE.find(g => g.includes(p)) ?? [p];
const particleDistractors = (p, r) => {
  const bad = confusableGroup(p);
  return shuf(PARTICLES.filter(x => !bad.includes(x)), r).slice(0, 3);
};

// Các bài lân cận làm nguồn đáp án nhiễu khi bài hiện tại không đủ: l, l-1, l+1, l-2, l+2...
const around = n => {
  const out = [n];
  for (let d = 1; d < LESSON_COUNT; d += 1) {
    if (n - d >= 1) out.push(n - d);
    if (n + d <= LESSON_COUNT) out.push(n + d);
  }
  return out;
};

const hasKana = s => /[぀-ヿ]/.test(s);

// ---- Dựng câu hỏi của một bài ----
function build(n) {
  const l = LESSONS[n - 1];
  const out = [];
  const ids = new Set();

  // key: chuỗi nhận diện nội dung nguồn để id không đổi khi thêm/bớt câu khác
  const add = (kind, key, make) => {
    let id = `x:${n}:${kind}:${hash(`${kind}|${key}`).toString(36)}`;
    while (ids.has(id)) id += 'x';
    const r = seeded(hash(id));
    const q = make(r);
    if (!q) return;
    const wrong = uniq(q.wrong).filter(c => c !== q.answer);
    if (wrong.length < 2) return; // ít nhất 3 lựa chọn
    ids.add(id);
    const info = EX_KINDS[kind];
    out.push({
      id,
      type: info.section,
      kind,
      prompt: q.prompt,
      hint: q.hint,
      choices: [q.answer, ...wrong.slice(0, 3)],
      answer: q.answer,
      explain: q.explain,
      tag: q.tag ?? info.title,
      lesson: n,
      promptLang: q.promptLang ?? 'ja',
      choiceLang: q.choiceLang,
      ref: q.ref,
    });
  };

  const sentences = sentencesOf(l);
  const pool = lessons => lessons.flatMap(k => sentencesOf(LESSONS[k - 1]));
  const farPool = pool(around(n).slice(0, 5));
  const patternRef = s => (s.patternId ? { patternId: s.patternId } : { wordId: s.wordId });
  // Đáp án nhiễu: câu cùng bài trước, rồi tới câu các bài lân cận
  const nearFirst = (key, own, r) => [...shuf(sentences.filter(x => key(x) !== own), r), ...shuf(farPool.filter(x => key(x) !== own), r)];

  // --- Hiểu nghĩa câu / chọn câu Nhật ---
  for (const s of sentences) {
    add('jp2vi', s.jp, r => ({
      prompt: s.jp,
      hint: 'Chọn nghĩa tiếng Việt đúng của câu',
      answer: s.vi,
      wrong: nearFirst(x => x.vi, s.vi, r).map(x => x.vi),
      explain: `${s.jp} nghĩa là "${s.vi}".`,
      tag: s.title,
      ref: patternRef(s),
      choiceLang: undefined,
    }));
    add('vi2jp', s.jp, r => ({
      prompt: s.vi,
      promptLang: undefined,
      hint: 'Chọn câu tiếng Nhật đúng',
      answer: s.jp,
      wrong: nearFirst(x => x.jp, s.jp, r).map(x => x.jp),
      explain: `"${s.vi}" là ${s.jp}`,
      tag: s.title,
      ref: patternRef(s),
      choiceLang: 'ja',
    }));
  }

  // --- Sắp xếp câu: câu một mệnh đề từ 3 đến 7 cụm ---
  for (const s of sentences) {
    if (s.jp.includes('…')) continue;
    let tokens = s.jp.split(/\s+/);
    // Câu ngắn (hai cụm): tách trợ từ khỏi danh từ (ここ ／ は ／ きょうしつです。) để đủ ba mảnh xếp lại
    if (tokens.length === 2) {
      const hit = particleOf(tokens[0]);
      if (hit) tokens = [hit.stem, tokens[0].slice(hit.stem.length), tokens[1]];
    }
    if (tokens.length < 3 || tokens.length > 7 || new Set(tokens).size < tokens.length) continue;
    add('order', s.jp, r => {
      const target = tokens.join(' ');
      const last = tokens[tokens.length - 1];
      const wrong = [];
      for (let i = 0; i < 150 && wrong.length < 3; i += 1) {
        const p = shuf(tokens, r);
        const text = p.join(' ');
        // Mọi đáp án sai đều để vị ngữ lệch khỏi cuối câu: thứ tự các thành phần khác trong tiếng Nhật khá tự do nên chỉ lỗi này mới chắc chắn là sai
        if (text === target || wrong.includes(text) || p[p.length - 1] === last) continue;
        wrong.push(text);
      }
      let shown = shuf(tokens, r);
      for (let i = 0; i < 20 && shown.join(' ') === target; i += 1) shown = shuf(tokens, r);
      return {
        prompt: shown.join(' ／ '),
        hint: `Sắp xếp thành câu đúng: ${s.vi}`,
        answer: target,
        wrong,
        explain: `Câu đúng: ${s.jp} (${s.vi}). Vị ngữ (động từ, tính từ, です) đứng cuối câu; trợ từ đi liền sau từ nó đánh dấu.`,
        tag: s.title,
        ref: patternRef(s),
        choiceLang: 'ja',
      };
    });
  }

  // --- Điền trợ từ ---
  for (const s of sentences) {
    if (s.jp.includes('…')) continue;
    const tokens = s.jp.split(/\s+/);
    let made = 0;
    tokens.forEach((tok, i) => {
      const hit = particleOf(tok);
      if (!hit || made >= 2) return;
      made += 1;
      add('particle', `${s.jp}#${i}`, r => {
        const tail = tok.slice(hit.stem.length + hit.particle.length);
        const blanked = tokens.map((t, j) => (j === i ? `${hit.stem}＿${tail}` : t)).join(' ');
        return {
          prompt: blanked,
          hint: s.vi,
          answer: hit.particle,
          wrong: particleDistractors(hit.particle, r),
          explain: `${s.jp} (${s.vi}). ${PARTICLE_NOTE[hit.particle]}.`,
          tag: s.title,
          ref: patternRef(s),
          choiceLang: 'ja',
        };
      });
    });
  }

  // --- Điền từ vựng vào câu ---
  const vocab = l.vocab;
  for (const w of vocab) {
    if (!w.ex || w.kana.length < 2 || w.ex.split(w.kana).length !== 2) continue;
    add('cloze', w.id, r => ({
      prompt: w.ex.replace(w.kana, '＿＿'),
      hint: w.exVi,
      answer: w.kana,
      wrong: shuf(vocab.filter(x => x.kana !== w.kana && x.vi !== w.vi && x.kana.length >= 2 && !w.ex.includes(x.kana)), r).map(x => x.kana),
      explain: `Từ cần điền là ${w.kana} (${w.vi}). Câu hoàn chỉnh: ${w.ex} (${w.exVi}).`,
      tag: 'Từ vựng',
      ref: { wordId: w.id },
      choiceLang: 'ja',
    }));
  }

  // --- Công thức / ý nghĩa / bảng / vai trò ---
  const patterns = around(n).slice(0, 5).flatMap(k => LESSONS[k - 1].grammar);
  // Mẫu khác cùng bài trước, rồi mới tới các bài lân cận
  const nearPatterns = (p, r) => [...shuf(l.grammar.filter(x => x.id !== p.id), r), ...shuf(patterns.filter(x => x.lesson !== n), r)];
  for (const p of l.grammar) {
    add('formula', p.id, r => ({
      prompt: p.meaning,
      promptLang: undefined,
      hint: `Mẫu câu nào có nghĩa như trên? (${p.title})`,
      answer: p.formula,
      wrong: nearPatterns(p, r).filter(x => x.formula !== p.formula && x.meaning !== p.meaning).map(x => x.formula),
      explain: `${p.meaning}: ${p.formula}. ${p.tip ?? ''}`.trim(),
      tag: p.title,
      ref: { patternId: p.id },
      choiceLang: 'ja',
    }));
    add('usage', p.id, r => ({
      prompt: p.formula,
      hint: 'Mẫu câu này có nghĩa gì?',
      answer: p.meaning,
      wrong: nearPatterns(p, r).filter(x => x.meaning !== p.meaning && x.formula !== p.formula).map(x => x.meaning),
      explain: `${p.formula} nghĩa là "${p.meaning}". ${p.tip ?? ''}`.trim(),
      tag: p.title,
      ref: { patternId: p.id },
    }));

    // Bảng: nhớ cột thứ j khi cho cột đầu
    // Chỉ hỏi bảng có quan hệ cố định giữa các cột (động từ → nghĩa, thể ます → thể ない...). Bỏ bảng ví dụ tự do, bảng ít dòng, cột trùng tiêu đề.
    const t = p.table;
    if (t && t.rows.length >= 3 && t.head[0] && !t.title.startsWith('Ví dụ')) {
      for (let j = 1; j < t.head.length; j += 1) {
        if (!t.head[j] || t.head.indexOf(t.head[j]) !== j) continue;
        t.rows.forEach((row, ri) => {
          const answer = row[j];
          if (!answer || answer === row[0]) return;
          add('table', `${p.id}|${ri}|${j}`, r => ({
            prompt: `${row[0]}`,
            promptLang: hasKana(row[0]) ? 'ja' : undefined,
            hint: `Bảng 「${t.title}」: ${t.head[0]} → ${t.head[j]}?`,
            answer,
            wrong: shuf(t.rows.map(x => x[j]).filter(x => x && x !== answer && x !== row[0]), r),
            explain: `Bảng 「${t.title}」: ${t.head.map((hd, k) => `${hd} = ${row[k]}`).join(' · ')}.`,
            tag: p.title,
            ref: { patternId: p.id },
            choiceLang: hasKana(answer) ? 'ja' : undefined,
          }));
        });
      }
    }

    // Mistake: câu đúng / tìm câu sai
    (p.mistakes ?? []).forEach((m, mi) => {
      const others = l.grammar.flatMap(x => (x.mistakes ?? []).filter(y => y !== m));
      const farMist = around(n).slice(1, 4).flatMap(k => LESSONS[k - 1].grammar.flatMap(x => x.mistakes ?? []));
      add('correct', `${p.id}|${mi}`, r => ({
        prompt: 'Câu nào đúng?',
        promptLang: undefined,
        hint: `Mẫu: ${p.title}`,
        answer: m.right,
        wrong: [m.wrong, ...shuf([...others, ...farMist].map(x => x.wrong).filter(x => x !== m.wrong && x !== m.right), r)],
        explain: `Câu đúng: 「${m.right}」. Câu sai: 「${m.wrong}」. ${m.why}`,
        tag: p.title,
        ref: { patternId: p.id },
        choiceLang: 'ja',
      }));
      add('wrongone', `${p.id}|${mi}`, r => ({
        prompt: 'Câu nào SAI?',
        promptLang: undefined,
        hint: `Mẫu: ${p.title}`,
        answer: m.wrong,
        wrong: shuf([...others, ...farMist].map(x => x.right).filter(x => x !== m.right && x !== m.wrong), r),
        explain: `Câu sai là 「${m.wrong}」. Sửa lại: 「${m.right}」. ${m.why}`,
        tag: p.title,
        ref: { patternId: p.id },
        choiceLang: 'ja',
      }));
    });

    // Vai trò của từng phần trong câu phân tích
    const bd = p.breakdown;
    if (bd) {
      const roles = l.grammar.flatMap(x => (x.breakdown ? x.breakdown.parts.map(pt => pt[1]) : []));
      bd.parts.forEach(([text, role], pi) => {
        if ([...text].length > 8) return;
        add('role', `${p.id}|${pi}`, r => ({
          prompt: `${bd.jp}　→　「${text.replace(PUNCT_END, '')}」`,
          hint: 'Thành phần này đóng vai trò gì trong câu?',
          answer: role,
          wrong: shuf(roles.filter(x => x !== role), r),
          explain: `Trong câu ${bd.jp} (${bd.vi}): ${text} = ${role}.`,
          tag: p.title,
          ref: { patternId: p.id },
        }));
      });
    }
  }

  return out;
}

const cache = new Map();

// Mọi câu hỏi của một bài, gom theo dạng: { cloze: [...], order: [...], ... }. Lựa chọn chưa xáo (đáp án đứng đầu).
export function lessonExercises(n) {
  if (!Number.isInteger(n) || n < 1 || n > LESSON_COUNT) return {};
  if (!cache.has(n)) {
    const by = {};
    for (const q of build(n)) (by[q.kind] ??= []).push(q);
    cache.set(n, by);
  }
  return cache.get(n);
}

export const exerciseCount = n => Object.values(lessonExercises(n)).reduce((a, qs) => a + qs.length, 0);

// Dựng lại một câu từ id 'x:<bài>:<dạng>:<mã>', lựa chọn xáo bằng shuffle(arr)
export function exerciseQuestion(id, shuffle) {
  const [, lesson, kind] = id.split(':');
  const q = lessonExercises(Number(lesson))[kind]?.find(x => x.id === id);
  return q ? { ...q, choices: shuffle(q.choices) } : null;
}
