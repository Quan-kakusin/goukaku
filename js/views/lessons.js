// Trang "Bài học": chọn một trong 25 bài của giáo trình.

import { h, show, icon, ICON } from '../ui.js';
import { LESSONS, LESSON_COUNT } from '../../data/lessons.js';
import { getState } from '../storage.js';
import { getDeck, lessonWords } from '../deck.js';

export function lessonMeta(l, wordCount, score) {
  const bits = [`${wordCount} từ`, `${l.grammar.length} mẫu câu`];
  if (score) bits.push(`điểm đề cao nhất ${score.best}%`);
  return bits.join(' · ');
}

export function mount(root) {
  const s = getState();
  const deck = getDeck();

  const row = l => {
    const meta = lessonMeta(l, lessonWords(deck, l.n).length, s.lessons[l.n]);
    return h(
      'a',
      { class: 'lesson-row', href: `#/lesson/${l.n}`, 'aria-label': `Bài ${l.n}: ${l.title}. ${meta}` },
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
    h('p', { class: 'muted' }, `${LESSON_COUNT} bài. Chọn một bài để xem hướng dẫn, từ vựng, ngữ pháp và luyện tập.`),
    h('ul', { class: 'lesson-list' }, ...LESSONS.map(l => h('li', null, row(l)))),
  );
}
