// Danh sách ảnh meme người dùng bỏ vào public/memes/dung (trả lời đúng) và public/memes/sai (trả lời sai).
// Dùng chung cho dev server (trả về khi mở /memes/list.json) và lúc build (ghi ra dist/memes/list.json).
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const IMAGE = /\.(png|jpe?g|gif|webp|svg)$/i;

// publicDir: thư mục public/ của dự án. Kết quả: { dung: ['memes/dung/a.png', ...], sai: [...] }
export function memeList(publicDir) {
  const list = {};
  for (const key of ['dung', 'sai']) {
    const folder = join(publicDir, 'memes', key);
    const files = existsSync(folder) ? readdirSync(folder).filter(f => IMAGE.test(f)).sort() : [];
    list[key] = files.map(f => `memes/${key}/${f}`);
  }
  return list;
}
