// Bảng tra cứu số đếm: trợ số từ (人, 枚, 台...), số, ngày, tháng, năm, giờ, phút, giá tiền. Nhìn là thấy ngay, bấm vào ô để nghe.
// Cách đọc bất quy tắc (biến âm hoặc đọc riêng) tô đậm vì phải học thuộc.

import { h, show, toast, wordsTabs } from '../ui.js';
import { COUNTING_GROUPS, COUNTER_COLUMNS } from '../../data/counting.js';
import { speak } from '../tts.js';
import { toRomaji } from '../romaji.js';

const group = id => COUNTING_GROUPS.find(g => g.id === id).words;

function say(kana) {
  if (!speak(kana)) toast('Máy chưa có giọng đọc tiếng Nhật. Hãy cài gói ngôn ngữ Nhật trong Windows.');
}

// Ô trong bảng: bấm để nghe. irregular: đọc bất quy tắc
const cellButton = (w, { romaji = true } = {}) =>
  h(
    'button',
    { class: `cnt-cell${w.irregular ? ' irr' : ''}`, type: 'button', 'aria-label': `${w.kanji}, đọc là ${w.kana}${w.irregular ? ', đọc bất quy tắc' : ''}. Bấm để nghe`, onclick: () => say(w.kana) },
    h('span', { class: 'cnt-k', lang: 'ja' }, w.kanji),
    h('span', { class: 'cnt-r', lang: 'ja' }, w.kana),
    romaji && h('span', { class: 'cnt-ro' }, toRomaji(w.kana)),
    w.alts?.length > 0 && h('span', { class: 'cnt-alt', lang: 'ja' }, `hoặc ${w.alts.join(', ')}`),
  );

const grid = (words, cls = '') => h('div', { class: `cnt-grid ${cls}`.trim() }, ...words.map(w => cellButton(w)));

// Bảng trợ số từ: mỗi cột một trợ số từ, mỗi hàng một số lượng
function counterMatrix() {
  const cols = COUNTER_COLUMNS;
  const rowNo = Array.from({ length: 10 }, (_, i) => i + 1);
  const cell = (c, idx) => {
    const w = c.words[idx];
    return h('td', null, w ? h('button', { class: `cnt-mini${w.irregular ? ' irr' : ''}`, type: 'button', lang: 'ja', 'aria-label': `${w.kanji}, đọc là ${w.kana}${w.irregular ? ', đọc bất quy tắc' : ''}. Bấm để nghe`, onclick: () => say(w.kana) }, w.kana) : h('span', { class: 'muted' }, '—'));
  };
  return h(
    'div',
    { class: 'table-wrap cnt-matrix-wrap', role: 'region', 'aria-label': 'Bảng trợ số từ, cuộn ngang để xem hết', tabindex: 0 },
    h(
      'table',
      { class: 'cnt-matrix' },
      h(
        'thead',
        null,
        h('tr', null, h('th', { scope: 'col' }, 'Số'), ...cols.map(c => h('th', { scope: 'col', title: c.what }, h('span', { class: 'cnt-unit', lang: 'ja' }, c.unit), h('small', null, c.label)))),
      ),
      h(
        'tbody',
        null,
        ...rowNo.map((n, i) => h('tr', null, h('th', { scope: 'row' }, String(n)), ...cols.map(c => cell(c, i)))),
        h('tr', null, h('th', { scope: 'row' }, 'Mấy?'), ...cols.map(c => cell(c, c.words.length - 1))),
      ),
    ),
  );
}

export function mount(root) {
  const sections = [
    {
      id: 'counters',
      title: 'Trợ số từ (đếm người, vật, tuổi, tầng, lần…)',
      note: 'Mỗi cột là một trợ số từ, mỗi hàng là số lượng. Cuộn ngang để xem các cột bên phải. Chọn trợ số từ theo loại vật: người = 人, vật mỏng (giấy, tem, áo sơ mi) = 枚, máy móc và xe cộ = 台, vật dài (chai, cây bút) = 本, sách vở = 冊, vật nhỏ = 個, thú nhỏ = 匹, ly chén = 杯. Tuổi: 20 tuổi đọc riêng là はたち (không phải にじゅっさい).',
      body: counterMatrix(),
    },
    { id: 'numbers', title: 'Số đếm', note: 'Chú ý 300, 600, 800 (さんびゃく, ろっぴゃく, はっぴゃく) và 3000, 8000 (さんぜん, はっせん).', body: grid(group('num'), 'wide') },
    { id: 'days', title: 'Ngày trong tháng', note: 'Từ mồng 1 đến mồng 10, cùng 14, 20 và 24 đọc riêng. Các ngày còn lại là số + にち (17 và 27 đọc しち, 19 và 29 đọc く).', body: grid(group('day'), 'wide') },
    { id: 'months', title: 'Tháng', note: 'Tháng 4 = しがつ, tháng 7 = しちがつ, tháng 9 = くがつ.', body: grid(group('month')) },
    { id: 'years', title: 'Năm', note: 'Số + ねん. Chữ số cuối 4 đọc よ, 7 đọc なな (hoặc しち), 9 đọc く: にせんにじゅうよねん (2024).', body: grid(group('year'), 'wide') },
    { id: 'clock', title: 'Giờ và phút', note: 'Giờ: 4 = よじ, 7 = しちじ, 9 = くじ. Phút: 1, 3, 4, 6, 8, 10 đọc ぷん (có biến âm), còn lại đọc ふん.', body: grid(group('clock'), 'wide') },
    { id: 'yen', title: 'Giá tiền (円)', note: '4 円 = よえん. Biến âm của 300, 600, 800, 3000, 8000 giống phần Số đếm.', body: grid(group('yen'), 'wide') },
  ];

  const jump = h(
    'div',
    { class: 'row cnt-jump', role: 'group', 'aria-label': 'Nhảy tới phần' },
    ...sections.map(s => h('button', { class: 'btn small', type: 'button', onclick: () => root.querySelector(`#cnt-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, s.title.split(' (')[0])),
  );

  show(
    root,
    wordsTabs('counting'),
    h('h1', null, 'Bảng tra số đếm'),
    h('p', { class: 'muted' }, 'Nhìn là thấy ngay cách đọc. Bấm vào một ô để nghe phát âm. ', h('span', { class: 'irr-sample' }, 'Chữ đậm có gạch chân'), ' là cách đọc bất quy tắc, cần học thuộc. Muốn luyện thì sang ', h('a', { href: '#/typing/count' }, 'Gõ romaji → Số đếm・ngày tháng'), '.'),
    jump,
    ...sections.map(s => h('section', { class: 'panel flat cnt-section', id: `cnt-${s.id}` }, h('h2', null, s.title), h('p', { class: 'muted' }, s.note), s.body)),
  );
  return undefined;
}
