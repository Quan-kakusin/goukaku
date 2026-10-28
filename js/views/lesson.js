// Trang chi tiết một bài. Đường dẫn #/lesson/<số bài>[/overview|vocab|grammar|exam].

import { h, show, icon, ICON, toast, field } from '../ui.js';
import { LESSON_COUNT, getLesson } from '../../data/lessons.js';
import { getState, save } from '../storage.js';
import { getDeck, lessonWords } from '../deck.js';
import { parseVocabLines, IMPORT_HELP } from '../import.js';
import { vocabRow, patternCard, lessonPicker, noteBox } from './parts.js';
import { launchFromIds } from './launch.js';
import { verdict, formatDuration } from '../exam.js';
import { exerciseCatalog, exerciseSummary, patternIds, allIds, pickIds, pickFromPreset, mixPresets } from '../lesson-exercises.js';

// Hai mục của bài: Bài học (đọc: tổng quan, từ vựng, ngữ pháp) và Bài tập (làm: nhiều dạng câu hỏi theo từ vựng và ngữ pháp của bài)
const TABS = [
  ['overview', 'Tổng quan'],
  ['vocab', 'Từ vựng'],
  ['grammar', 'Ngữ pháp'],
];
const COUNT_CHOICES = [10, 20, 30];
let lastCount = 10; // số câu mỗi lượt, giữ giữa các lần mở trang trong cùng phiên
const KANA_ONLY = /^[぀-ヿー]+$/;

export function mount(root, params = []) {
  const n = Number(params[0]);
  const lesson = Number.isInteger(n) ? getLesson(n) : undefined;
  if (!lesson) {
    show(root, h('h1', null, 'Không tìm thấy bài này'), h('a', { class: 'btn', href: '#/lessons' }, 'Xem 25 bài'));
    return undefined;
  }
  // 'exam' là đường dẫn cũ của tab Luyện tập: nay là mục Bài tập
  const practice = params[1] === 'exercise' || params[1] === 'exam';
  const tab = practice ? 'exercise' : TABS.some(([id]) => id === params[1]) ? params[1] : 'overview';
  const focusPattern = practice ? lesson.grammar.find(p => p.id === params[2]) : undefined;

  let importReport = null; // kết quả lần nhập hàng loạt gần nhất, hiện dưới ô nhập
  const words = () => lessonWords(getDeck(), n);
  const section = i => `${n}.${i + 1}`;

  // ---------- Đầu trang ----------
  function header() {
    return h(
      'div',
      { class: 'lesson-head' },
      h('a', { class: 'back-link', href: practice ? '#/lessons/exercise' : '#/lessons' }, icon(...ICON.back), 'Tất cả bài'),
      h('p', { class: 'eyebrow' }, `Bài ${n} / ${LESSON_COUNT}`),
      h('h1', null, lesson.title),
      h('p', { class: 'lesson-jp', lang: 'ja' }, lesson.jp),
      h('p', { class: 'muted' }, lesson.summary),
      lessonPicker({ selected: n, hrefFor: k => `#/lesson/${k}/${tab}`, label: 'Chọn bài khác', compact: true }),
    );
  }

  // Chuyển giữa hai mục lớn: Bài học / Bài tập
  function modeTabs() {
    return h(
      'nav',
      { class: 'tabs mode-tabs', 'aria-label': `Bài ${n}: chọn Bài học hoặc Bài tập` },
      h('a', { href: `#/lesson/${n}/overview`, 'aria-current': practice ? undefined : 'page' }, 'Bài học'),
      h('a', { href: `#/lesson/${n}/exercise`, 'aria-current': practice ? 'page' : undefined }, 'Bài tập', h('span', { class: 'tab-count' }, String(allIds(exerciseCatalog(n, getDeck())).length))),
    );
  }

  function tabs() {
    const counts = { vocab: words().length, grammar: lesson.grammar.length };
    return h(
      'nav',
      { class: 'tabs sub-tabs', 'aria-label': `Nội dung Bài ${n}` },
      ...TABS.map(([id, label]) =>
        h('a', { href: `#/lesson/${n}/${id}`, 'aria-current': id === tab ? 'page' : undefined }, label, id in counts && h('span', { class: 'tab-count' }, String(counts[id]))),
      ),
    );
  }

  // Cuối mỗi trang bài học: nút sang Bài tập
  function toExercise() {
    return h(
      'section',
      { class: 'panel flat cta-practice' },
      h('div', null, h('h2', null, 'Học xong rồi, làm bài tập thôi'), h('p', { class: 'muted' }, 'Bài tập có nhiều dạng (từ vựng, điền trợ từ, sắp xếp câu, công thức, lỗi hay gặp) bám theo từ vựng và ngữ pháp của bài này.')),
      h('a', { class: 'btn primary', href: `#/lesson/${n}/exercise` }, `Sang Bài tập Bài ${n} ›`),
    );
  }

  // ---------- Tab Tổng quan: hướng dẫn học bài ----------
  function overview() {
    const list = words();
    const hasNotes = lesson.grammar.some(p => p.notes.length > 0);
    const step = (title, text, href, label) =>
      h('li', null, h('div', null, h('strong', null, title), h('p', { class: 'muted' }, text)), href && h('a', { class: 'btn small', href }, label));

    return h(
      'div',
      { class: 'overview' },
      lesson.guide?.length > 0 && h('section', { class: 'panel flat' }, h('h2', null, 'Hướng dẫn của bài'), ...lesson.guide.map(t => h('p', null, t))),
      h(
        'section',
        { class: 'panel flat' },
        h('h2', null, 'Trong bài này bạn sẽ học'),
        h(
          'ul',
          { class: 'goals' },
          h('li', null, h('strong', null, `${list.length} từ vựng`), ' về chủ đề của bài'),
          ...lesson.grammar.map((p, i) => h('li', null, h('span', { class: 'section-no' }, section(i)), ' ', h('span', { lang: 'ja' }, p.title), h('span', { class: 'muted' }, ` · ${p.meaning}`))),
        ),
      ),
      h(
        'section',
        { class: 'panel flat' },
        h('h2', null, 'Cách học bài này'),
        h(
          'ol',
          { class: 'howto' },
          step('Đọc và nghe từ vựng', 'Bấm vào từng từ để xem ví dụ, bấm loa để nghe phát âm. Đọc to theo.', `#/lesson/${n}/vocab`, 'Mở từ vựng'),
          step('Đọc từng mục ngữ pháp', 'Mỗi mục có công thức, giải thích, ví dụ và lưu ý. Đọc xong thì sang Bài tập để luyện công thức đó.', `#/lesson/${n}/grammar`, 'Mở ngữ pháp'),
          step('Làm bài tập', 'Sang mục Bài tập để luyện nhiều dạng câu hỏi theo từ vựng và ngữ pháp của bài, thấy đúng sai và giải thích ngay.', `#/lesson/${n}/exercise`, 'Mở bài tập'),
          step('Xem lại câu sai', 'Đọc phần giải chi tiết, câu sai tự vào Sổ lỗi sai để ôn lại sau.', '#/notebook', 'Mở sổ lỗi sai'),
        ),
      ),
      lesson.grammar.length > 0 &&
        h(
          'section',
          { class: 'panel flat' },
          h('h2', null, 'Công thức cần nhớ'),
          h(
            'div',
            { class: 'table-wrap' },
            h(
              'table',
              { class: 'formula-table' },
              h('thead', null, h('tr', null, h('th', null, 'Mục'), h('th', null, 'Công thức'), h('th', null, 'Ý nghĩa'))),
              h('tbody', null, ...lesson.grammar.map((p, i) => h('tr', null, h('td', null, section(i)), h('td', { lang: 'ja' }, p.formula), h('td', null, p.meaning)))),
            ),
          ),
        ),
      hasNotes &&
        h(
          'section',
          { class: 'panel flat' },
          h('h2', null, 'Điểm dễ nhầm'),
          ...lesson.grammar.flatMap((p, i) => (p.notes.length ? [h('p', { class: 'muted' }, `${section(i)} ${p.title}`), noteBox(p.notes)] : [])),
        ),
      list.length > 0 &&
        h(
          'section',
          { class: 'panel flat' },
          h('h2', null, 'Từ vựng tiêu biểu'),
          h('div', { class: 'word-chips' }, ...list.slice(0, 12).map(w => h('a', { class: 'chip big', href: `#/lesson/${n}/vocab`, lang: 'ja' }, `${w.word} · ${w.vi}`))),
        ),
      h('p', { class: 'muted' }, lesson.note),
    );
  }

  // ---------- Tab Từ vựng ----------
  function addPanel() {
    const word = h('input', { type: 'text', required: true, lang: 'ja', placeholder: 'ねこ' });
    const kana = h('input', { type: 'text', required: true, lang: 'ja', placeholder: 'ねこ' });
    const vi = h('input', { type: 'text', required: true, placeholder: 'Con mèo' });
    const ex = h('input', { type: 'text', lang: 'ja', placeholder: '猫が 好きです。' });
    const exVi = h('input', { type: 'text', placeholder: 'Tôi thích mèo.' });
    const kanaError = h('span', { class: 'field-error', id: 'kana-error', role: 'alert', hidden: true }, 'Cách đọc chỉ được gồm hiragana hoặc katakana.');
    kana.addEventListener('input', () => {
      kana.removeAttribute('aria-invalid');
      kana.removeAttribute('aria-describedby');
      kanaError.hidden = true;
    });

    const area = h('textarea', { rows: 6, placeholder: '私 | わたし | Tôi | 私は 学生です。 | Tôi là sinh viên.\n学生 | がくせい | Học sinh, sinh viên', 'aria-label': 'Danh sách từ cần nhập' });
    const report = h('div', { class: 'import-report', role: 'status', 'aria-live': 'polite' });
    if (importReport) {
      report.append(
        h('p', { class: importReport.rows ? 'result ok' : 'result ng' }, importReport.rows ? `✓ Đã nhập ${importReport.rows} từ vào Bài ${n}.` : 'Chưa nhập được từ nào.'),
        importReport.errors.length > 0 && h('ul', { class: 'error-list' }, ...importReport.errors.map(e => h('li', null, `Dòng ${e.line}: ${e.message}`))),
      );
    }

    return h(
      'details',
      { class: 'panel', open: importReport !== null },
      h('summary', null, `Thêm từ vào Bài ${n}`),
      h('h2', null, 'Dán danh sách từ'),
      h('p', { class: 'muted' }, IMPORT_HELP),
      area,
      h(
        'button',
        {
          class: 'btn primary',
          type: 'button',
          onclick: () => {
            const s = getState();
            const existing = new Set(words().flatMap(w => [`${w.word}|${w.kana}`, `${w.kanji}|${w.kana}`]));
            const { rows, errors } = parseVocabLines(area.value, existing);
            const stamp = Date.now();
            rows.forEach((r, i) => s.custom.push({ id: `c:${stamp}-${i}`, lesson: n, ...r }));
            if (rows.length) save();
            importReport = { rows: rows.length, errors };
            render();
          },
        },
        'Nhập vào bài',
      ),
      report,
      h('h2', { class: 'spaced' }, 'Hoặc thêm từng từ'),
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
            getState().custom.push({ id: `c:${Date.now()}`, lesson: n, word: word.value.trim(), kana: kana.value.trim(), vi: vi.value.trim(), ex: ex.value.trim(), exVi: exVi.value.trim() });
            save();
            importReport = null;
            toast(`Đã thêm từ vào Bài ${n}`);
            render();
          },
        },
        field('Từ (kanji hoặc kana, app hiển thị bằng kana)', word),
        field('Cách đọc (kana)', kana, kanaError),
        field('Nghĩa tiếng Việt', vi),
        field('Câu ví dụ (không bắt buộc)', ex),
        field('Nghĩa câu ví dụ', exVi),
        h('button', { class: 'btn', type: 'submit' }, 'Thêm từ'),
      ),
    );
  }

  function vocabTab() {
    const s = getState();
    const list = words();
    const hidden = Boolean(s.settings.hideSuggested[n]);
    const customCount = s.custom.filter(w => w.lesson === n).length;
    return h(
      'div',
      null,
      h(
        'div',
        { class: 'panel flat' },
        h('p', { class: 'muted' }, lesson.note),
        h(
          'label',
          { class: 'check' },
          h('input', {
            type: 'checkbox',
            checked: hidden,
            onchange: e => {
              if (e.target.checked) s.settings.hideSuggested[n] = true;
              else delete s.settings.hideSuggested[n];
              save();
              render();
            },
          }),
          `Ẩn từ vựng trong sách, chỉ dùng từ tôi thêm (${customCount} từ)`,
        ),
      ),
      h('p', { class: 'muted spaced' }, `${list.length} từ. Bấm vào một từ để xem ví dụ.`),
      h('div', { class: 'vocab-list' }, ...(list.length ? list.map(w => vocabRow(w, { onChange: render })) : [h('p', { class: 'muted' }, 'Chưa có từ. Dán danh sách từ của bài vào ô bên dưới.')])),
      addPanel(),
    );
  }

  // ---------- Tab Ngữ pháp ----------
  function grammarTab() {
    if (!lesson.grammar.length) return h('p', { class: 'muted' }, `Bài này chưa có mẫu ngữ pháp. Bạn có thể thêm vào file data/minna/bai-${String(n).padStart(2, '0')}.js.`);
    const open = lesson.grammar.length === 1;
    return h(
      'div',
      null,
      h('p', { class: 'muted' }, `${lesson.grammar.length} mục ngữ pháp. Bấm vào từng mục để xem giải thích, cách tạo câu, ví dụ, lỗi hay gặp và mẹo nhớ.`),
      lesson.grammar.length > 1 &&
        h(
          'div',
          { class: 'row' },
          h('button', { class: 'btn small', type: 'button', onclick: e => e.target.closest('div').parentElement.querySelectorAll('details.pattern').forEach(d => (d.open = true)) }, 'Mở tất cả'),
          h('button', { class: 'btn small', type: 'button', onclick: e => e.target.closest('div').parentElement.querySelectorAll('details.pattern').forEach(d => (d.open = false)) }, 'Thu gọn tất cả'),
        ),
      ...lesson.grammar.map((p, i) =>
        patternCard(p, section(i), {
          open,
          exercise: { href: `#/lesson/${n}/exercise/${p.id}`, count: patternIds(n, p.id).length },
        }),
      ),
    );
  }

  // ---------- Mục Bài tập ----------
  // Gọn: một thẻ "Luyện tổng hợp" và vài dạng bài tập lớn (từ vựng, chọn câu đúng, sắp xếp câu, công thức)
  function exerciseTab() {
    const s = getState();
    const presets = exerciseSummary(n, getDeck());
    const score = s.lessons[n];
    const mine = s.exams.filter(e => e.items.length > 0 && e.items.every(i => i.lesson === n)).slice(0, 5);
    const run = (ids, title) => launchFromIds({ ids, title: `Bài tập Bài ${n} · ${title}`, mode: 'practice' });
    const take = k => Math.min(lastCount, k);

    const countSel = h(
      'select',
      {
        id: 'f-ex-count',
        'aria-label': 'Số câu mỗi lượt làm',
        onchange: e => {
          lastCount = Number(e.target.value) || 10;
          render();
        },
      },
      ...COUNT_CHOICES.map(c => h('option', { value: String(c), selected: c === lastCount }, `${c} câu`)),
    );

    const presetRow = p =>
      h(
        'div',
        { class: 'ex-row' },
        h('div', { class: 'ex-info' }, h('strong', null, p.title), h('p', { class: 'muted' }, p.desc)),
        h('button', { class: 'btn small', type: 'button', 'data-kind': p.id, onclick: () => run(pickFromPreset(p, lastCount), p.title) }, `Làm ${take(p.ids.length)} câu`),
      );

    const focus =
      focusPattern &&
      h(
        'section',
        { class: 'panel flat focus-pattern' },
        h('p', { class: 'eyebrow' }, 'Bài tập của một mục ngữ pháp'),
        h('h2', { lang: 'ja' }, `${section(lesson.grammar.indexOf(focusPattern))} ${focusPattern.title}`),
        h('p', { class: 'muted' }, `${focusPattern.meaning}.`),
        h(
          'div',
          { class: 'row' },
          h('button', { class: 'btn primary', type: 'button', onclick: () => run(pickIds(patternIds(n, focusPattern.id), lastCount), focusPattern.title) }, `Làm ${take(patternIds(n, focusPattern.id).length)} câu của mục này`),
          h('a', { class: 'btn', href: `#/lesson/${n}/grammar` }, 'Xem lại ngữ pháp'),
          h('a', { class: 'btn', href: `#/lesson/${n}/exercise` }, 'Tất cả bài tập'),
        ),
      );

    return h(
      'div',
      { class: 'practice' },
      score && h('p', null, h('span', { class: `chip${score.best >= 70 ? ' pass' : ''}` }, `Điểm đề cao nhất ${score.best}%`), ' ', h('span', { class: 'muted' }, `${score.attempts} lần làm đề bài này`)),
      focus,
      h(
        'div',
        { class: 'practice-card' },
        h('div', null, h('h2', null, 'Luyện tổng hợp'), h('p', { class: 'muted' }, 'Trộn các dạng bài tập của bài.')),
        h(
          'div',
          { class: 'row' },
          h('label', { class: 'sr-only', for: 'f-ex-count' }, 'Số câu mỗi lượt làm'),
          countSel,
          h('button', { class: 'btn primary', type: 'button', disabled: presets.length === 0, onclick: () => run(mixPresets(presets, lastCount), 'tổng hợp') }, 'Bắt đầu'),
        ),
      ),
      presets.length > 0 &&
        h(
          'section',
          { class: 'panel flat ex-group' },
          h('h2', null, 'Chọn dạng bài tập'),
          ...presets.map(presetRow),
        ),
      mine.length > 0 &&
        h(
          'section',
          { class: 'panel flat' },
          h('h2', null, 'Các lần làm gần đây'),
          h(
            'ul',
            { class: 'history' },
            ...mine.map(e => {
              const v = verdict(e.percent);
              return h('li', null, h('a', { class: 'history-row', href: `#/exam/result/${e.id}` }, h('span', { class: 'hr-main' }, h('strong', null, e.title), h('small', { class: 'muted' }, `${e.items.length} câu · ${formatDuration(e.seconds)}`)), h('span', { class: `verdict ${v.key}` }, `${e.percent}% ${v.label}`)));
            }),
          ),
        ),
    );
  }

  function render() {
    const body = tab === 'overview' ? overview() : tab === 'vocab' ? vocabTab() : tab === 'grammar' ? grammarTab() : exerciseTab();
    show(root, header(), modeTabs(), practice ? null : tabs(), body, practice ? null : toExercise(), footerNav());
  }

  function footerNav() {
    return h(
      'div',
      { class: 'lesson-nav' },
      n > 1 ? h('a', { class: 'btn small', href: `#/lesson/${n - 1}/${tab}` }, `‹ Bài ${n - 1}`) : h('span'),
      n < LESSON_COUNT ? h('a', { class: 'btn small', href: `#/lesson/${n + 1}/${tab}` }, `Bài ${n + 1} ›`) : h('span'),
    );
  }

  render();
  return undefined;
}
