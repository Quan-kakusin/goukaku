// Bản đóng gói để deploy (npm run build = vite build) phải đủ file cho trình duyệt, không kèm test/tài liệu, và liệt kê đúng ảnh meme.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { memeList } from '../scripts/memes.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = join(root, 'public');

// Build vào thư mục tạm (không đụng tới dist/ của dự án); dùng lại cho các test bên dưới
let cached;
function buildOnce() {
  if (cached) return cached;
  const dir = mkdtempSync(join(tmpdir(), 'ja-build-'));
  const dist = join(dir, 'dist');
  execFileSync(process.execPath, [join(root, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', dist, '--emptyOutDir'], { cwd: root, stdio: 'pipe' });
  cached = { dir, dist };
  return cached;
}
test.after(() => cached && rmSync(cached.dir, { recursive: true, force: true }));

test('build tạo bản tĩnh đầy đủ: trang, JS/CSS đã gom, logo, meme, file nghe; không kèm tests/docs/scripts', () => {
  const { dist } = buildOnce();
  for (const f of ['index.html', 'logo.png', 'memes/list.json', 'audio/de-02/N5Q1.mp3', 'audio/de-02/c1-q1.jpg']) assert.ok(existsSync(join(dist, f)), `thiếu ${f}`);
  const assets = readdirSync(join(dist, 'assets'));
  assert.ok(assets.some(f => f.endsWith('.js')) && assets.some(f => f.endsWith('.css')), 'thiếu JS/CSS đã gom');
  for (const f of ['tests', 'docs', 'scripts', 'package.json', 'node_modules', 'js', 'css', 'data']) assert.ok(!existsSync(join(dist, f)), `không được đưa ${f} lên host`);
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(html, /\/assets\/index-[\w-]+\.js/);
  assert.match(html, /noindex/);
});

test('memes/list.json khớp thư mục public/memes và mọi file được liệt kê đều có thật', () => {
  const { dist } = buildOnce();
  const list = JSON.parse(readFileSync(join(dist, 'memes', 'list.json'), 'utf8'));
  assert.deepEqual(list, memeList(publicDir));
  assert.ok(list.dung.length > 0 && list.sai.length > 0, 'cần có ít nhất một meme đúng và một meme sai');
  for (const f of [...list.dung, ...list.sai]) assert.ok(existsSync(join(dist, f)), `thiếu ${f}`);
});

test('memeList chỉ lấy file ảnh, sắp theo tên, thiếu thư mục thì trả mảng rỗng', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ja-memes-'));
  try {
    assert.deepEqual(memeList(dir), { dung: [], sai: [] });
    mkdirSync(join(dir, 'memes', 'dung'), { recursive: true });
    for (const f of ['b.PNG', 'a.jpg', 'ghi-chu.txt', 'c.webp']) writeFileSync(join(dir, 'memes', 'dung', f), 'x');
    assert.deepEqual(memeList(dir), { dung: ['memes/dung/a.jpg', 'memes/dung/b.PNG', 'memes/dung/c.webp'], sai: [] });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('vercel.json và package.json khớp: build bằng vite, kết quả ở dist', () => {
  const cfg = JSON.parse(readFileSync(join(root, 'vercel.json'), 'utf8'));
  assert.equal(cfg.outputDirectory, 'dist');
  assert.equal(cfg.buildCommand, 'npm run build');
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.build, 'vite build');
  assert.ok(pkg.devDependencies.vite, 'vite phải nằm trong devDependencies');
  assert.equal(Object.keys(pkg.dependencies ?? {}).length, 0, 'app không có thư viện chạy thật, chỉ công cụ build');
});
