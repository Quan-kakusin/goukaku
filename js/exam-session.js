// Chuyển đề từ nơi tạo (trang bài, trang Luyện đề, Sổ lỗi...) sang màn hình làm bài.
// Chỉ nằm trong bộ nhớ: tải lại trang giữa chừng thì phiên làm bài kết thúc (màn hình làm bài sẽ báo và về trang Thi thử N5).

let pending = null;
let last = null;

// cfg: { title, questions, mode: 'practice' | 'exam', limitSec?, record?: boolean, lessonScore?: số bài, returnHash?, parts?, paper? }
//   parts: các phần thi nối tiếp [{ name, vi, intro, from, to, limitSec, listening }] (đề thi thử N5), paper: id đề.
//   record: lưu vào lịch sử (mặc định có). lessonScore: ghi điểm cho bài đó (đề của đúng một bài).
export function startExam(cfg) {
  pending = { record: true, returnHash: '#/exams', limitSec: null, ...cfg };
  location.hash = '#/exam/run';
}

export function takePending() {
  const p = pending;
  pending = null;
  return p;
}

// Kết quả của lần làm không lưu vào lịch sử, để vẫn xem được giải chi tiết ngay sau khi nộp
export const setLast = entry => {
  last = entry;
};
export const getLast = () => last;
