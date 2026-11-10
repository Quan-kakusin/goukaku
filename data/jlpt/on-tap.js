// Bộ đề ÔN TẬP 25 bài (150 câu) để nhớ lại kiến thức trước khi làm các đề thi thử N5.
// Khác đề thi thử: không có chữ Hán nào (mọi chữ là kana), mỗi câu gắn một bài (`lesson`) để biết bài nào yếu, giờ làm rộng rãi, không quy ra điểm đậu/rớt của JLPT (`review: true`).
// Phần nghe không có file âm thanh: giọng đọc của trình duyệt đọc kịch bản (như đề số 3 đến 5).
// Soạn từng phần trong data/jlpt/on-tap/: vocab.js (45 câu), g1.js (40), b2.js (35), listen.js (30).

import vocab from './on-tap/vocab.js';
import g1 from './on-tap/g1.js';
import b2 from './on-tap/b2.js';
import listen from './on-tap/listen.js';

export default {
  id: 'on-tap-01',
  review: true,
  title: 'Ôn tập N5 · 25 bài',
  desc: 'Bộ đề ôn tập 150 câu bám theo 25 bài (không kanji, có phần nghe) để nhớ lại kiến thức trước khi làm đề thi thử.',
  parts: [
    {
      key: 'moji',
      name: '語彙',
      vi: 'Từ vựng',
      minutes: 60,
      intro: 'Chọn từ hợp ngữ cảnh và chọn câu cùng nghĩa, từ vựng của cả 25 bài, không có kanji. 45 câu. Giờ làm rộng rãi (60 phút), không cần vội.',
      sections: vocab.sections,
    },
    {
      key: 'bunpou-dokkai',
      name: '文法・読解',
      vi: 'Ngữ pháp và đọc hiểu',
      minutes: 120,
      intro: 'Điền từ, sắp xếp câu, điền vào đoạn văn và đọc hiểu, bám mẫu câu của 25 bài. 75 câu. Giờ làm rộng rãi (120 phút).',
      sections: [...g1.sections, ...b2.sections],
    },
    {
      key: 'choukai',
      name: '聴解',
      vi: 'Nghe hiểu',
      minutes: 60,
      listening: true,
      intro: 'Bốn dạng nghe như đề thi thử, 30 câu. Không có file âm thanh, app đọc kịch bản bằng giọng máy. Bấm nghe theo số lần quy định. Giờ làm rộng rãi (60 phút).',
      sections: listen.sections,
    },
  ],
};
