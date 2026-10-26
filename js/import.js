// Nhập từ vựng hàng loạt: mỗi dòng "chữ | cách đọc | nghĩa | ví dụ | nghĩa ví dụ" (ngăn bằng | hoặc Tab).
// Hàm thuần: trả về các dòng hợp lệ và danh sách lỗi theo số dòng để người dùng sửa.

const KANA_ONLY = /^[぀-ヿー]+$/;
const MAX_WORD = 40;
const MAX_TEXT = 200;

export const IMPORT_HELP = 'Mỗi dòng một từ: chữ | cách đọc | nghĩa | câu ví dụ | nghĩa câu ví dụ. Hai cột đầu và nghĩa là bắt buộc, ví dụ có thể bỏ trống. Dòng bắt đầu bằng # bị bỏ qua.';

// existing: tập khóa "chữ|cách đọc" đã có trong bài, để bỏ qua từ trùng
export function parseVocabLines(text, existing = new Set()) {
  const rows = [];
  const errors = [];
  const seen = new Set(existing);

  text.split(/\r?\n/).forEach((raw, i) => {
    const line = i + 1;
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const cells = trimmed.split(/\t|[|｜]/).map(c => c.trim());
    const [word = '', kanaRaw = '', vi = '', ex = '', exVi = ''] = cells;
    const kana = kanaRaw.replace(/[\s　]+/g, '');

    const fail = message => errors.push({ line, message, text: trimmed.slice(0, 60) });
    if (cells.length < 3) return fail('Thiếu cột: cần ít nhất chữ, cách đọc và nghĩa, ngăn bằng | hoặc Tab.');
    if (!word) return fail('Thiếu chữ Nhật.');
    if (word.length > MAX_WORD) return fail(`Chữ Nhật dài quá ${MAX_WORD} ký tự.`);
    if (!kana) return fail('Thiếu cách đọc.');
    if (!KANA_ONLY.test(kana)) return fail(`Cách đọc "${kanaRaw}" phải chỉ gồm hiragana hoặc katakana.`);
    if (!vi) return fail('Thiếu nghĩa tiếng Việt.');
    if ([vi, ex, exVi].some(t => t.length > MAX_TEXT)) return fail(`Một cột dài quá ${MAX_TEXT} ký tự.`);

    const key = `${word}|${kana}`;
    if (seen.has(key)) return fail('Từ này đã có trong bài (hoặc bị lặp trong danh sách).');
    seen.add(key);
    rows.push({ word, kana, vi, ex, exVi });
  });

  return { rows, errors };
}
