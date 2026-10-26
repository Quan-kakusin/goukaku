// Trang "Tra từ": tìm trong toàn bộ từ vựng của 25 bài (và từ bạn tự thêm), lọc theo bài.

import { h, wordsTabs, toast, field, show } from '../ui.js';
import { LESSONS } from '../../data/lessons.js';
import { getState, save } from '../storage.js';
import { getDeck } from '../deck.js';
import { romajiOf } from '../romaji.js';
import { vocabRow } from './parts.js';

const KANA_ONLY = /^[぀-ヿー]+$/;

// Bỏ dấu tiếng Việt để gõ "chao" cũng tìm ra "Chào hỏi"
const plain = t =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');

export function mount(root) {
  let query = '';
  let lessonFilter = 'all';

  const list = h('div', { class: 'vocab-list' });
  const count = h('p', { class: 'muted' });

  function draw() {
    const q = plain(query.trim());
    const deck = getDeck();
    const rows = deck.filter(
      w =>
        (lessonFilter === 'all' || String(w.lesson) === lessonFilter) &&
        (!q || [w.word, w.kanji, w.kana, romajiOf(w), w.vi].some(t => t && plain(t).includes(q))),
    );
    count.textContent = `${rows.length} / ${deck.length} từ`;
    list.replaceChildren(...(rows.length ? rows.map(w => vocabRow(w, { onChange: draw, showLesson: true })) : [h('p', { class: 'muted' }, 'Không có từ nào khớp.')]));
  }

  const search = h('input', {
    type: 'search',
    placeholder: 'Tìm theo kana, romaji hoặc nghĩa…',
    'aria-label': 'Tìm từ',
    oninput: e => {
      query = e.target.value;
      draw();
    },
  });
  const lessonSel = h(
    'select',
    {
      'aria-label': 'Lọc theo bài',
      onchange: e => {
        lessonFilter = e.target.value;
        draw();
      },
    },
    h('option', { value: 'all' }, 'Mọi bài'),
    ...LESSONS.map(l => h('option', { value: String(l.n) }, `Bài ${l.n} · ${l.title}`)),
    h('option', { value: '0' }, 'Ngoài sách (từ của tôi)'),
  );
  function addForm() {
    const word = h('input', { type: 'text', required: true, lang: 'ja', placeholder: 'ねこ' });
    const kana = h('input', { type: 'text', required: true, lang: 'ja', placeholder: 'ねこ' });
    const vi = h('input', { type: 'text', required: true, placeholder: 'Con mèo' });
    const ex = h('input', { type: 'text', lang: 'ja', placeholder: '猫が 好きです。' });
    const exVi = h('input', { type: 'text', placeholder: 'Tôi thích mèo.' });
    const lesson = h(
      'select',
      { 'aria-label': 'Thêm vào bài' },
      h('option', { value: '0' }, 'Ngoài sách (chưa xếp bài)'),
      ...LESSONS.map(l => h('option', { value: String(l.n) }, `Bài ${l.n} · ${l.title}`)),
    );
    const kanaError = h('span', { class: 'field-error', id: 'kana-error', role: 'alert', hidden: true }, 'Cách đọc chỉ được gồm hiragana hoặc katakana.');
    kana.addEventListener('input', () => {
      kana.removeAttribute('aria-invalid');
      kana.removeAttribute('aria-describedby');
      kanaError.hidden = true;
    });

    return h(
      'details',
      { class: 'panel' },
      h('summary', null, '➕ Thêm từ riêng'),
      h('p', { class: 'muted' }, 'Muốn thêm nhiều từ của một bài? Mở bài đó rồi dùng "Dán danh sách từ".'),
      h(
        'form',
        {
          class: 'add-form',
          onsubmit: e => {
            e.preventDefault();
            if (!KANA_ONLY.test(kana.value.trim())) {
              kana.setAttribute('aria-invalid', 'true');
              kana.setAttribute('aria-describedby', 'kana-error');
              kanaError.hidden = false;
              kana.focus();
              return;
            }
            getState().custom.push({
              id: `c:${Date.now()}`,
              lesson: Number(lesson.value),
              word: word.value.trim(),
              kana: kana.value.trim(),
              vi: vi.value.trim(),
              ex: ex.value.trim(),
              exVi: exVi.value.trim(),
            });
            save();
            e.target.reset();
            toast('Đã thêm từ mới.');
            draw();
          },
        },
        field('Thêm vào', lesson),
        field('Từ (kanji hoặc kana, app hiển thị bằng kana)', word),
        field('Cách đọc (kana)', kana, kanaError),
        field('Nghĩa tiếng Việt', vi),
        field('Câu ví dụ (không bắt buộc)', ex),
        field('Nghĩa câu ví dụ', exVi),
        h('button', { class: 'btn primary', type: 'submit' }, 'Thêm'),
      ),
    );
  }

  show(root, wordsTabs('vocab'), h('h1', null, 'Tra từ'), h('div', { class: 'toolbar' }, search, lessonSel), count, list, addForm());
  draw();
}
