// Dựng đề từ các cấu hình thường dùng rồi chuyển sang màn hình làm bài.

import { toast } from '../ui.js';
import { getAllWords } from '../deck.js';
import { buildExam, scopeLessons, scopeLabel, defaultMinutes } from '../exam.js';
import { resolveQuestion } from '../questions.js';
import { startExam } from '../exam-session.js';
import { getPaper, buildPaper } from '../mock.js';

const EMPTY = 'Phạm vi này chưa có câu hỏi ngữ pháp. Hãy đổi phạm vi hoặc thêm mẫu ngữ pháp cho bài.';

// scope: 'all' | số bài. mode: 'practice' | 'exam'. minutes: số phút (không truyền = tự tính).
export function launchExam({ scope, count = 15, mode = 'exam', minutes, title }) {
  const lessons = scopeLessons(scope);
  const questions = buildExam({ lessons, count, rng: Math.random });
  if (!questions.length) {
    toast(EMPTY);
    return false;
  }
  startExam({
    title: title ?? `${mode === 'exam' ? 'Thi thử' : 'Luyện tập'} ${scopeLabel(scope)}`,
    questions,
    mode,
    limitSec: mode === 'exam' ? (minutes ?? defaultMinutes(questions.length)) * 60 : null,
    lessonScore: lessons.length === 1 ? lessons[0] : undefined,
  });
  return true;
}

// Dựng lại các câu hỏi từ id (sổ lỗi sai, lịch sử đề). Câu không còn trong dữ liệu bị bỏ qua.
export function questionsFromIds(ids) {
  const deck = getAllWords();
  return ids.map(id => resolveQuestion(id, { deck })).filter(Boolean);
}

// Đề dựng lại từ danh sách id (làm lại đề cũ, luyện lại câu sai, ôn sổ lỗi). Nếu mọi câu cùng một bài thì điểm tính cho bài đó.
export function launchFromIds({ ids, title, mode = 'practice', minutes, record = true }) {
  const questions = questionsFromIds(ids);
  if (!questions.length) {
    toast('Không dựng lại được câu hỏi nào (nội dung có thể đã bị xóa hoặc thay đổi).');
    return false;
  }
  const lessons = new Set(questions.map(q => q.lesson ?? 0));
  const [only] = lessons;
  startExam({
    title,
    questions,
    mode,
    record,
    limitSec: mode === 'exam' ? (minutes ?? defaultMinutes(questions.length)) * 60 : null,
    lessonScore: lessons.size === 1 && only > 0 && mode === 'exam' ? only : undefined,
  });
  return true;
}

// Thi thử N5 theo đề thật: các phần thi nối tiếp, mỗi phần có giờ riêng, nộp phần này mới sang phần sau.
// partKeys: chỉ làm những phần này (không truyền thì làm cả đề).
export function launchMock({ paperId, includeListening = true, partKeys = null }) {
  const paper = getPaper(paperId);
  if (!paper) {
    toast('Không tìm thấy đề này.');
    return false;
  }
  const { questions, parts } = buildPaper(paper, { includeListening, partKeys });
  if (!parts.length) {
    toast('Đề này không có phần thi nào như vậy.');
    return false;
  }
  const subset = parts.length < buildPaper(paper, { includeListening }).parts.length;
  const title = subset ? `${paper.title} · ${parts.map(p => p.name).join(' + ')}` : paper.title;
  startExam({ title, questions, mode: 'exam', parts, paper: paper.id, record: true });
  return true;
}
