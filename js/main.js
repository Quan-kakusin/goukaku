import { h, toast } from './ui.js';
import { mistakeCount } from './mistakes.js';
import { loadMemes } from './insights.js';
import * as flash from './views/flash.js';
import * as typing from './views/typing.js';
import * as exams from './views/exams.js';
import * as exam from './views/exam.js';
import * as vocab from './views/vocab.js';
import * as counting from './views/counting.js';
import * as lessons from './views/lessons.js';
import * as lesson from './views/lesson.js';
import * as kanji from './views/kanji.js';
import * as kana from './views/kana.js';
import * as notebook from './views/notebook.js';
import * as data from './views/data.js';

// Tab chỉ hiện favicon: tiêu đề là một ký tự trống (U+2800), vì tiêu đề rỗng thì trình duyệt hiện địa chỉ localhost
const TAB_TITLE = '\u2800';

// nav: mục sáng lên trên thanh điều hướng. 5 mục: Bài học · Từ vựng (thẻ flash, gõ romaji, tra từ, bảng số đếm) · Chữ viết (kana, kanji) · Luyện thi (thi thử N5, sổ lỗi sai) · Cài đặt. Không có trang chủ: mở app là vào danh sách bài.
// Đường dẫn có tham số: #/lesson/7/grammar → view "lesson" nhận ["7", "grammar"]; #/exam/run, #/exam/result/<id>.
const routes = {
  exams: { view: exams, title: 'Thi thử N5', nav: 'test' },
  exam: { view: exam, title: 'Làm bài', nav: 'test' },
  lessons: { view: lessons, title: 'Bài học', nav: 'learn' },
  lesson: { view: lesson, title: 'Bài học', nav: 'learn' },
  vocab: { view: vocab, title: 'Tra từ', nav: 'words' },
  flash: { view: flash, title: 'Thẻ flash', nav: 'words' },
  typing: { view: typing, title: 'Gõ romaji', nav: 'words' },
  counting: { view: counting, title: 'Số đếm', nav: 'words' },
  kanji: { view: kanji, title: 'Kanji', nav: 'write' },
  kana: { view: kana, title: 'Kana', nav: 'write' },
  notebook: { view: notebook, title: 'Sổ lỗi sai', nav: 'test' },
  data: { view: data, title: 'Cài đặt', nav: 'data' },
};
let cleanup = null;
let firstRender = true;

// Huy hiệu số mục trong Sổ lỗi sai, gắn trên mục Luyện thi, như chấm thông báo của Threads
function paintBadge() {
  const n = mistakeCount();
  const badge = document.getElementById('nb-badge');
  const link = document.querySelector('nav a[data-route="test"]');
  badge.hidden = n === 0;
  badge.textContent = n > 99 ? '99+' : String(n);
  link.setAttribute('aria-label', n ? `Luyện thi, ${n} câu trong sổ lỗi sai cần ôn` : 'Luyện thi');
}

function render() {
  cleanup?.();
  cleanup = null;

  const [first = '', ...params] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const name = Object.hasOwn(routes, first) ? first : 'lessons'; // đường dẫn lạ (kể cả #/ và #/grammar cũ) về danh sách bài
  for (const a of document.querySelectorAll('.rail nav a')) {
    if (a.dataset.route === routes[name].nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  document.title = TAB_TITLE;
  paintBadge();

  const root = document.getElementById('app');
  root.replaceChildren();
  root.classList.remove('wide'); // trang cần khung rộng (làm bài) tự thêm lại
  try {
    cleanup = routes[name].view.mount(root, params) ?? null;
  } catch (err) {
    console.error(err);
    root.replaceChildren(h('p', { class: 'error', role: 'alert' }, `Có lỗi khi hiển thị trang này: ${err.message}`));
  }
  window.scrollTo(0, 0);
  // Đưa tiêu điểm về nội dung sau khi chuyển trang để người dùng bàn phím/trình đọc màn hình không bị lạc
  if (!firstRender) root.focus({ preventScroll: true });
  firstRender = false;
}

loadMemes(); // meme tự tải: chạy nền, chưa xong thì dùng bộ mặc định
window.addEventListener('hashchange', render);
window.addEventListener('save-failed', () =>
  toast('Không lưu được tiến độ: trình duyệt đang chặn lưu trữ (chế độ riêng tư?).'),
);
render();
