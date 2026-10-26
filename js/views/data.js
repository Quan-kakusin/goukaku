import { h, toast, download, show } from '../ui.js';
import { getState, replaceState, resetState } from '../storage.js';
import { getDeck } from '../deck.js';

const oneLine = t => String(t ?? '').replace(/[\t\r\n]+/g, ' ');
const stamp = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD theo giờ máy

export function mount(root) {
  function draw() {
    const s = getState();
    const fileInput = h('input', {
      type: 'file',
      accept: 'application/json,.json',
      class: 'hidden',
      onchange: async e => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;
        importBtn.removeAttribute('data-state');
        importBtn.setAttribute('aria-busy', 'true'); // trạng thái loading
        try {
          const raw = JSON.parse(await file.text());
          importBtn.removeAttribute('aria-busy');
          if (!confirm('Thay toàn bộ dữ liệu hiện tại bằng dữ liệu trong file này?')) return;
          replaceState(raw);
          toast('Đã nhập dữ liệu.');
          draw();
        } catch (err) {
          importBtn.dataset.state = 'error'; // trạng thái lỗi
          toast(err instanceof SyntaxError ? 'File không phải JSON hợp lệ.' : err.message);
        } finally {
          importBtn.removeAttribute('aria-busy');
        }
      },
    });
    const importBtn = h('button', { class: 'btn', type: 'button', onclick: () => fileInput.click() }, 'Nhập từ file JSON');

    show(
      root,
      h('h1', null, 'Cài đặt'),
      h(
        'div',
        { class: 'panel' },
        h('h2', null, 'Dữ liệu của bạn'),
        h('p', null, `${s.exams.length} lần làm đề được lưu · ${s.custom.length} từ riêng · ${Object.keys(s.mistakes).length} mục trong sổ lỗi sai.`),
        h(
          'p',
          { class: 'muted' },
          'Mọi thứ lưu ngay trong trình duyệt này, ở đúng địa chỉ bạn đang mở. Xóa dữ liệu duyệt web hoặc mở app ở địa chỉ/cổng khác thì sẽ thấy trống. Hãy sao lưu thường xuyên.',
        ),
      ),
      h(
        'div',
        { class: 'panel' },
        h('h2', null, 'Sao lưu'),
        h(
          'div',
          { class: 'row' },
          h('button', { class: 'btn primary', type: 'button', onclick: () => download(`ja_paines-${stamp()}.json`, JSON.stringify(s, null, 2), 'application/json') }, 'Xuất dữ liệu (JSON)'),
          importBtn,
          fileInput,
        ),
      ),
      h(
        'div',
        { class: 'panel' },
        h('h2', null, 'Sang Anki'),
        h('p', { class: 'muted' }, 'Xuất toàn bộ từ vựng ra file văn bản phân tách bằng tab. Trong Anki chọn File → Import, các cột lần lượt là: chữ, cách đọc, nghĩa, câu ví dụ, nghĩa câu ví dụ, bài.'),
        h(
          'button',
          {
            class: 'btn',
            type: 'button',
            onclick: () => {
              const lines = getDeck().map(w => [w.word, w.kana, w.vi, w.ex, w.exVi, w.lesson ? `Bài ${w.lesson}` : ''].map(oneLine).join('\t'));
              download('ja_paines-anki.txt', lines.join('\n'), 'text/plain');
            },
          },
          'Xuất cho Anki (.txt)',
        ),
      ),
      h(
        'div',
        { class: 'panel danger-zone' },
        h('h2', null, 'Xóa dữ liệu'),
        h('p', { class: 'muted' }, 'Xóa toàn bộ bài đã học, lịch sử đề, sổ lỗi sai và từ riêng. Không thể hoàn tác, hãy xuất file sao lưu trước.'),
        h(
          'button',
          {
            class: 'btn danger',
            type: 'button',
            onclick: () => {
              if (!confirm('Xóa TOÀN BỘ dữ liệu học? Việc này không thể hoàn tác.')) return;
              resetState();
              toast('Đã xóa dữ liệu.');
              draw();
            },
          },
          'Xóa tất cả',
        ),
      ),
    );
  }
  draw();
}
