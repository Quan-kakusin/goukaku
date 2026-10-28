// Trang "Bài học": chọn một trong 25 bài. Hai mục: Bài học (đọc) và Bài tập (làm), mục nào cũng chọn bài từ danh sách này.
// Đường dẫn: #/lessons (Bài học) và #/lessons/exercise (Bài tập).

import { h, show, icon, ICON } from '../ui.js';
import { LESSONS, LESSON_COUNT } from '../../data/lessons.js';
import { getState } from '../storage.js';
import { getDeck, lessonWords } from '../deck.js';
import { exerciseCatalog, allIds } from '../lesson-exercises.js';

export function lessonMeta(l, wordCount, score) {
  const bits = [`${wordCount} từ`, `${l.grammar.length} mẫu câu`];
  if (score) bits.push(`điểm đề cao nhất ${score.best}%`);
  return bits.join(' · ');
}

export function mount(root, params = []) {
  const s = getState();
  const deck = getDeck();
  const practice = params[0] === 'exercise';

  const row = l => {
    const words = lessonWords(deck, l.n).length;
    const meta = practice ? `${allIds(exerciseCatalog(l.n, deck)).length} câu hỏi · ${l.grammar.length} mẫu câu${s.lessons[l.n] ? ` · điểm đề cao nhất ${s.lessons[l.n].best}%` : ''}` : lessonMeta(l, words, s.lessons[l.n]);
    return h(
      'a',
      { class: 'lesson-row', href: `#/lesson/${l.n}/${practice ? 'exercise' : 'overview'}`, 'aria-label': `Bài ${l.n}: ${l.title}. ${meta}` },
      h('span', { class: 'lesson-num', 'aria-hidden': 'true' }, String(l.n)),
      h(
        'div',
        { class: 'lesson-main' },
        h('div', { class: 'lesson-title' }, l.title),
        h('div', { class: 'lesson-jp', lang: 'ja' }, l.jp),
        h('div', { class: 'muted' }, meta),
      ),
      icon(...ICON.chevron),
    );
  };

  show(
    root,
    h('h1', null, 'Giáo trình Minna no Nihongo'),
    h(
      'nav',
      { class: 'tabs mode-tabs', 'aria-label': 'Chọn Bài học hoặc Bài tập' },
      h('a', { href: '#/lessons', 'aria-current': practice ? undefined : 'page' }, 'Bài học'),
      h('a', { href: '#/lessons/exercise', 'aria-current': practice ? 'page' : undefined }, 'Bài tập'),
    ),
    h('p', { class: 'muted' }, practice ? `${LESSON_COUNT} bài. Mỗi bài có nhiều dạng bài tập bám theo từ vựng và ngữ pháp của bài đó: điền trợ từ, sắp xếp câu, công thức, lỗi hay gặp...` : `${LESSON_COUNT} bài. Chọn một bài để xem hướng dẫn, từ vựng và ngữ pháp. Muốn luyện thì sang mục Bài tập.`),
    h('ul', { class: 'lesson-list' }, ...LESSONS.map(l => h('li', null, row(l)))),
  );
}
