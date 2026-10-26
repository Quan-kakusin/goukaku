// Thẻ flash: lật thẻ, tự đánh giá "nhớ" hoặc "chưa nhớ", xem kết quả cuối lượt. Không lưu theo dõi từng từ.

import { h, show, fill, meme, ring, speakButton, wordsTabs } from '../ui.js';
import { romajiOf } from '../romaji.js';
import { scoreFlash } from '../words.js';
import { shuffle } from '../questions.js';
import { encouragement, praise, miss } from '../insights.js';
import { wordSetup } from './word-setup.js';

export function mount(root) {
  let onKey = null;
  const stopKeys = () => {
    if (onKey) document.removeEventListener('keydown', onKey);
    onKey = null;
  };

  // ---------- Chọn bộ từ ----------
  function setup() {
    stopKeys();
    const front = h(
      'select',
      { id: 'fc-front' },
      h('option', { value: 'jp' }, 'Tiếng Nhật (đoán nghĩa)'),
      h('option', { value: 'vi' }, 'Tiếng Việt (nhớ lại từ tiếng Nhật)'),
    );
    show(
      root,
      wordsTabs('flash'),
      h('h1', null, 'Thẻ flash'),
      wordSetup({
        intro: 'Lật thẻ để xem đáp án, rồi tự đánh giá mình nhớ hay chưa. Cuối lượt có thống kê và có thể học lại những thẻ chưa nhớ.',
        extra: [h('div', { class: 'field' }, h('label', { for: 'fc-front' }, 'Mặt trước của thẻ'), front)],
        startLabel: 'Bắt đầu lật thẻ',
        onStart: (words, info) => session(words, { front: front.value, ...info }),
      }),
    );
  }

  // ---------- Một lượt ----------
  function session(words, opts) {
    const results = [];
    let idx = 0;
    let flipped = false;
    const live = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
    const barFill = h('div', { class: 'progress-fill' });
    const card = h('div', { class: 'flashcard' });
    const controls = h('div', { class: 'row fc-actions' });
    const footBtn = h('button', { class: 'btn small', type: 'button', onclick: () => (results.length ? finish() : setup()) }, 'Chọn lại bộ từ');

    const frontIsJp = opts.front === 'jp';
    const jpBlock = w => [h('div', { class: 'fc-word', lang: 'ja' }, w.word), h('div', { class: 'fc-sub' }, speakButton(w.kana), h('span', { class: 'romaji' }, romajiOf(w)))];
    const viBlock = w => [h('div', { class: 'fc-meaning' }, w.vi)];

    function answer(known) {
      results.push({ word: words[idx], known });
      idx += 1;
      flipped = false;
      if (idx >= words.length) return finish();
      return draw();
    }

    function finish() {
      stopKeys();
      result(results, opts, words);
    }

    function draw() {
      const w = words[idx];
      barFill.style.width = `${(idx / words.length) * 100}%`;
      footBtn.textContent = results.length ? 'Dừng và xem kết quả' : 'Chọn lại bộ từ';
      const faceFront = frontIsJp ? jpBlock(w) : viBlock(w);
      const faceBack = frontIsJp ? viBlock(w) : jpBlock(w);
      fill(
        card,
        h('div', { class: 'card-top' }, h('span', { class: 'chip' }, `Thẻ ${idx + 1}/${words.length}`), h('span', { class: 'chip' }, flipped ? 'Mặt sau' : 'Mặt trước')),
        h('div', { class: 'fc-face' }, ...faceFront),
        flipped && h('div', { class: 'fc-face back' }, ...faceBack),
        flipped && w.ex && h('div', { class: 'fc-example' }, h('div', { lang: 'ja' }, w.ex), h('div', { class: 'muted' }, w.exVi)),
      );
      controls.replaceChildren(
        ...(flipped
          ? [
              h('button', { class: 'btn', type: 'button', onclick: () => answer(false) }, h('kbd', null, '1'), '✗ Chưa nhớ'),
              h('button', { class: 'btn primary', type: 'button', onclick: () => answer(true) }, h('kbd', null, '2'), '✓ Đã nhớ'),
            ]
          : [h('button', { class: 'btn primary', type: 'button', onclick: flip }, h('kbd', null, 'Space'), 'Lật thẻ')]),
      );
      controls.querySelector('button.primary').focus();
      live.textContent = flipped ? `Mặt sau: ${frontIsJp ? w.vi : w.kana}` : `Thẻ ${idx + 1} trên ${words.length}. ${frontIsJp ? w.kana : w.vi}`;
    }

    function flip() {
      flipped = true;
      draw();
    }

    onKey = e => {
      if (e.ctrlKey || e.metaKey || e.altKey || (e.target instanceof Element && e.target.closest('input, select, textarea'))) return;
      const onButton = e.target instanceof Element && e.target.closest('button, a');
      if (!flipped && (e.key === ' ' || e.key === 'Enter') && !onButton) {
        e.preventDefault();
        flip();
      } else if (flipped && (e.key === '1' || e.key === 'ArrowLeft')) {
        e.preventDefault();
        answer(false);
      } else if (flipped && (e.key === '2' || e.key === 'ArrowRight')) {
        e.preventDefault();
        answer(true);
      }
    };
    document.addEventListener('keydown', onKey);

    show(
      root,
      wordsTabs('flash'),
      h('div', { class: 'exam-head' }, h('div', null, h('p', { class: 'eyebrow' }, `Thẻ flash · ${opts.label}`), h('h1', null, 'Lật thẻ'))),
      h('div', { class: 'progress' }, barFill),
      card,
      controls,
      h('div', { class: 'row session-foot' }, footBtn),
      live,
    );
    draw();
  }

  // ---------- Kết quả ----------
  function result(results, opts, words) {
    const g = scoreFlash(results);
    const unknown = results.filter(r => !r.known).map(r => r.word);
    show(
      root,
      wordsTabs('flash'),
      h(
        'section',
        { class: 'result-hero' },
        ring(g.percent / 100, { label: `${g.known}/${g.total}`, sub: 'đã nhớ', description: `Đã nhớ ${g.known} trên ${g.total} thẻ` }),
        h('div', null, h('p', { class: 'eyebrow' }, `Thẻ flash · ${opts.label}`), h('h1', null, `Nhớ ${g.percent}% số thẻ`), h('p', { class: 'muted' }, encouragement(g.percent / 100))),
        meme(g.percent >= 70 ? praise(g.known) : miss(g.known)),
      ),
      h(
        'div',
        { class: 'row result-actions' },
        h('button', { class: 'btn primary', type: 'button', disabled: unknown.length === 0, onclick: () => session(unknown, { ...opts, label: `${opts.label} · thẻ chưa nhớ` }) }, `Học lại thẻ chưa nhớ (${unknown.length})`),
        h('button', { class: 'btn', type: 'button', onclick: () => session(opts.shuffle ? shuffle(words) : words, opts) }, 'Làm lại cả bộ'),
        h('button', { class: 'btn', type: 'button', onclick: setup }, 'Chọn bộ từ khác'),
      ),
      unknown.length > 0 &&
        h(
          'section',
          { class: 'panel' },
          h('h2', null, 'Thẻ chưa nhớ'),
          h('ul', { class: 'word-miss' }, ...unknown.map(w => h('li', null, speakButton(w.kana), h('span', { class: 'vword', lang: 'ja' }, w.word), h('span', { class: 'romaji' }, romajiOf(w)), h('span', { class: 'muted' }, w.vi)))),
        ),
    );
  }

  setup();
  return stopKeys;
}
