// Ghép 25 file bài (data/minna/bai-NN.js) thành dữ liệu dùng chung. Muốn thêm nội dung, sửa trực tiếp file của bài đó.
import bai01 from './minna/bai-01.js';
import bai02 from './minna/bai-02.js';
import bai03 from './minna/bai-03.js';
import bai04 from './minna/bai-04.js';
import bai05 from './minna/bai-05.js';
import bai06 from './minna/bai-06.js';
import bai07 from './minna/bai-07.js';
import bai08 from './minna/bai-08.js';
import bai09 from './minna/bai-09.js';
import bai10 from './minna/bai-10.js';
import bai11 from './minna/bai-11.js';
import bai12 from './minna/bai-12.js';
import bai13 from './minna/bai-13.js';
import bai14 from './minna/bai-14.js';
import bai15 from './minna/bai-15.js';
import bai16 from './minna/bai-16.js';
import bai17 from './minna/bai-17.js';
import bai18 from './minna/bai-18.js';
import bai19 from './minna/bai-19.js';
import bai20 from './minna/bai-20.js';
import bai21 from './minna/bai-21.js';
import bai22 from './minna/bai-22.js';
import bai23 from './minna/bai-23.js';
import bai24 from './minna/bai-24.js';
import bai25 from './minna/bai-25.js';

export const LESSON_COUNT = 25;

const FILES = [bai01, bai02, bai03, bai04, bai05, bai06, bai07, bai08, bai09, bai10, bai11, bai12, bai13, bai14, bai15, bai16, bai17, bai18, bai19, bai20, bai21, bai22, bai23, bai24, bai25];

// Bài học và bài tập chỉ hiển thị kana: `word` là cách đọc, chữ Hán gốc giữ ở `kanji` (dùng để tra cứu).
// id từ vựng giữ dạng n5:<chữ gốc> để sổ lỗi và lịch sử đề đã lưu không bị mất.
export const LESSONS = FILES.map((file, i) => {
  const n = i + 1;
  return {
    n,
    ...file.meta,
    vocab: file.vocab.map(([word, kana, vi, ex = '', exVi = '', romaji]) => ({
      id: `n5:${word}`,
      lesson: n,
      word: kana,
      kanji: word,
      kana,
      vi,
      ex,
      exVi,
      ...(romaji && { romaji }),
    })),
    grammar: file.grammar.map(p => ({ ...p, lesson: n })),
  };
});

export const VOCAB = LESSONS.flatMap(l => l.vocab);
export const GRAMMAR = LESSONS.flatMap(l => l.grammar);
export const getLesson = n => LESSONS[n - 1];
