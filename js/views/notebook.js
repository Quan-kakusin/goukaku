import { h, icon, ICON, show, testTabs } from '../ui.js';
import { getState } from '../storage.js';
import { getAllWords, lessonTitle } from '../deck.js';
import { resolveQuestion, TYPE_LABEL, KINDS } from '../questions.js';
import { pickForReview, removeMistake, RESOLVE_AFTER } from '../mistakes.js';
import { launchFromIds } from './launch.js';

const SESSION_SIZE = 20;

export function mount(root) {
  const s = getState();
  const deck = getAllWords(); // gồm cả từ gợi ý đang bị ẩn, để không làm mất mục trong sổ
  const entries = [];
  for (const [id, m] of Object.entries(s.mistakes)) {
    const q = resolveQuestion(id, { deck });
    if (q) entries.push({ id, m, q });
    else removeMistake(id); // nguồn đã mất (vd từ riêng đã xóa)
  }
  entries.sort((a, b) => b.m.wrong - a.m.wrong || a.m.last - b.m.last);

  const heading = h('h1', { tabindex: '-1' }, 'Sổ lỗi sai');
  const byType = Object.entries(TYPE_LABEL)
    .map(([type, label]) => [label, entries.filter(e => e.m.type === type).length])
    .filter(([, n]) => n > 0);
  const review = () =>
    launchFromIds({ ids: pickForReview(getState().mistakes, SESSION_SIZE), title: 'Ôn sổ lỗi sai', mode: 'practice', record: false });

  show(
    root,
    testTabs('notebook'),
    heading,
    entries.length
      ? h(
          'div',
          null,
          h(
            'div',
            { class: 'panel' },
            h('p', null, `${entries.length} mục cần ôn.`, ' ', ...byType.map(([label, n]) => h('span', { class: 'chip' }, `${label}: ${n}`))),
            h('p', { class: 'muted' }, `Câu sai khi làm đề tự vào đây. Trả lời đúng ${RESOLVE_AFTER} lần liên tiếp thì mục được gỡ khỏi sổ. Ưu tiên câu sai nhiều nhất.`),
            h('button', { class: 'btn primary', type: 'button', onclick: review }, `Ôn ${Math.min(SESSION_SIZE, entries.length)} câu`),
          ),
          h(
            'ul',
            { class: 'nb-list' },
            ...entries.map(({ id, m, q }) =>
              h(
                'li',
                { class: 'nb-row' },
                h('span', { class: 'chip' }, KINDS[q.kind].short),
                q.lesson && h('span', { class: 'chip' }, lessonTitle(q.lesson)),
                h(
                  'div',
                  { class: 'nb-main' },
                  h('div', { lang: q.promptLang }, q.prompt),
                  h('div', { class: 'muted' }, `Đáp án: ${q.answer} · sai ${m.wrong} lần · cần đúng thêm ${RESOLVE_AFTER - m.streak} lần liên tiếp`),
                ),
                h(
                  'button',
                  {
                    class: 'icon-btn',
                    type: 'button',
                    title: 'Bỏ khỏi sổ',
                    'aria-label': `Bỏ "${q.prompt}" khỏi sổ lỗi sai`,
                    onclick: () => {
                      removeMistake(id);
                      mount(root);
                      root.querySelector('h1').focus();
                    },
                  },
                  icon(...ICON.close),
                ),
              ),
            ),
          ),
        )
      : h(
          'div',
          { class: 'done-box' },
          h('div', { class: 'glyph' }, icon(...ICON.check)),
          h('p', null, h('strong', null, 'Sổ lỗi sai đang trống')),
          h('p', { class: 'muted' }, 'Câu sai khi làm đề (từ vựng, ngữ pháp, kanji) sẽ tự được ghi vào đây để bạn ôn lại.'),
          h('div', { class: 'row' }, h('a', { class: 'btn primary', href: '#/lessons/exercise' }, 'Bài tập theo bài'), h('a', { class: 'btn', href: '#/exams' }, 'Thi thử N5')),
        ),
  );
}
