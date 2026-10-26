// Đọc tiếng Nhật bằng Web Speech API của trình duyệt (không cần file âm thanh).

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
let voice = null;

function pickVoice() {
  const voices = speechSynthesis.getVoices();
  voice = voices.find(v => v.lang === 'ja-JP') ?? voices.find(v => v.lang.startsWith('ja')) ?? null;
}

if (supported) {
  pickVoice();
  // Danh sách giọng thường nạp muộn nên phải nghe sự kiện này
  speechSynthesis.addEventListener('voiceschanged', pickVoice);
}

// Trả về false nếu máy chưa có giọng tiếng Nhật
export function speak(text) {
  if (!supported || !voice) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.voice = voice;
  u.rate = 0.9;
  speechSynthesis.speak(u);
  return true;
}

export const hasJapaneseVoice = () => supported && voice !== null;

// Đọc một đoạn hội thoại: lines = [[người nói, câu], ...]. Nữ giọng cao hơn, nam thấp hơn, người dẫn ('ナ') giữa.
// Trả về { stop, done }: done là Promise kết thúc khi đọc hết hoặc bị dừng.
const PITCH = { 女: 1.25, 男: 0.8, ナ: 1 };
export function speakScript(lines, { rate = 0.85 } = {}) {
  if (!supported || !voice) return { stop() {}, done: Promise.resolve(false) };
  speechSynthesis.cancel();
  let stopped = false;
  const done = new Promise(resolve => {
    const next = i => {
      if (stopped || i >= lines.length) {
        resolve(!stopped);
        return;
      }
      const [who, line] = lines[i];
      const u = new SpeechSynthesisUtterance(line);
      u.lang = 'ja-JP';
      u.voice = voice;
      u.rate = rate;
      u.pitch = PITCH[who] ?? 1;
      u.onend = () => setTimeout(() => next(i + 1), 450);
      u.onerror = () => resolve(false);
      speechSynthesis.speak(u);
    };
    next(0);
  });
  return {
    stop() {
      stopped = true;
      speechSynthesis.cancel();
    },
    done,
  };
}
