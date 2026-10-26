// Điều phối các màn hình của một lần làm đề: #/exam/run (đang làm) và #/exam/result/<id> (kết quả).
import { h, show } from '../ui.js';
import { mount as mountRun } from './exam-run.js';
import { mount as mountResult } from './exam-result.js';

export function mount(root, params = []) {
  const [page, ...rest] = params;
  if (page === 'run') return mountRun(root);
  if (page === 'result') return mountResult(root, rest);
  show(root, h('h1', null, 'Không tìm thấy trang'), h('a', { class: 'btn primary', href: '#/exams' }, 'Về Thi thử N5'));
  return undefined;
}
