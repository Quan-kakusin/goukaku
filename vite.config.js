// Vite chỉ gom và nén JS/CSS; code vẫn là JavaScript thuần (ES modules), không framework.
// public/ (logo, memes, audio) được chép nguyên vào dist/. Plugin nhỏ bên dưới lo danh sách ảnh meme.
import { defineConfig } from 'vite';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { memeList } from './scripts/memes.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(root, 'public');

function memesPlugin() {
  return {
    name: 'ja-paines-memes',
    // Dev: /memes/list.json đọc thư mục mỗi lần mở, thêm ảnh là thấy ngay
    configureServer(server) {
      server.middlewares.use('/memes/list.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.end(JSON.stringify(memeList(publicDir)));
      });
    },
    // Build: ghi danh sách ảnh vào dist (host tĩnh không đọc được thư mục)
    closeBundle() {
      const out = resolve(root, this.environment?.config?.build?.outDir ?? 'dist');
      mkdirSync(join(out, 'memes'), { recursive: true });
      writeFileSync(join(out, 'memes', 'list.json'), `${JSON.stringify(memeList(out))}\n`);
    },
  };
}

export default defineConfig({
  publicDir,
  plugins: [memesPlugin()],
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022', chunkSizeWarningLimit: 1000 },
  server: { host: '127.0.0.1', port: 8000, strictPort: true },
});
