// Lời nhận xét và lời khen. Hàm thuần nên test được.

// Nhận xét theo tỉ lệ đúng
export function encouragement(fraction) {
  if (fraction >= 0.9) return 'Xuất sắc! Gigachad chính là bạn. 🗿';
  if (fraction >= 0.7) return 'Đạt rồi, stonks! 📈 Xem lại các câu sai để nhớ lâu hơn.';
  if (fraction >= 0.5) return 'Gần đạt rồi, thêm chút nữa là chốt đơn! Đọc kỹ giải thích các câu sai rồi thử lại nhé.';
  return 'Đừng nản nhé, ai cũng có lúc mặt Pikachu ngạc nhiên. 😮 Đọc lại bài, xem giải thích từng câu rồi làm lại.';
}

// Meme sau mỗi câu, xoay vòng để không lặp lại ngay. Mặc định là ảnh trong memes/dung (khi đúng) và memes/sai (khi sai).
// Thêm hoặc bớt ảnh trong hai thư mục đó: loadMemes() đọc lại danh sách (dev server của Vite và bản build đều có danh sách); không đọc được thì dùng các ảnh dưới đây.
const memes = (dir, prefix, alt) => Array.from({ length: 5 }, (_, i) => ({ src: `memes/${dir}/${prefix}-${i + 1}.png`, alt }));
export const PRAISE = memes('dung', 'dung', 'Meme khi trả lời đúng');
export const MISS = memes('sai', 'sai', 'Meme khi trả lời sai');
export const praise = index => PRAISE[index % PRAISE.length];
export const miss = index => MISS[index % MISS.length];

// Đọc danh sách ảnh người dùng bỏ vào memes/dung và memes/sai (dev server hoặc bản build trả về). Không đọc được hoặc thư mục trống thì giữ bộ mặc định.
export async function loadMemes() {
  try {
    const res = await fetch('memes/list.json', { cache: 'no-cache' });
    if (!res.ok) return;
    const lists = await res.json();
    for (const [target, key, alt] of [[PRAISE, 'dung', 'Meme khi trả lời đúng'], [MISS, 'sai', 'Meme khi trả lời sai']]) {
      const files = Array.isArray(lists[key]) ? lists[key].filter(f => typeof f === 'string') : [];
      if (files.length) target.splice(0, target.length, ...files.map(src => ({ src: encodeURI(src), alt })));
    }
  } catch {
    // giữ bộ mặc định
  }
}
