// Gõ romaji "chỉ từ vựng chính": những mục trong từ vựng của 25 bài KHÔNG phải từ vựng chính để luyện gõ.
//   1. Trợ từ, từ nối ngắn (が, から, まで, と, だけ, でも...) và từ cảm thán (あ, えっ, へえ, はい...).
//   2. Hậu tố và đơn vị đếm (さん, じん, さい, ふん, にん, がつ, ねん...): đã có bộ riêng ở Gõ romaji → Số đếm・ngày tháng.
//   3. Câu và cụm câu dài (lời chào, mẫu câu, lời mời: どうぞよろしくおねがいします, それはおもしろいですね...).
// Động từ (べんきょうします, たべます), danh từ, tính từ, trạng từ và các từ để hỏi (なに, どこ, いつ) vẫn giữ.
// tests/vocab-skip.test.mjs kiểm tra danh sách này.

export const FUNCTION_WORDS = new Set(['が', 'から', 'まで', 'と', 'だけ', 'でも', 'けど', 'では', 'じゃ', 'や', 'あ', 'ああ', 'えっ', 'ええ', 'へえ', 'さあ', 'うん', 'はい', 'そう']);

export const SUFFIX_WORDS = new Set(['さん', 'くん', 'じん', 'さい', 'ご', 'かい', 'えん', 'せん', 'まん', 'じ', 'ふん', 'はん', 'ねん', 'がつ', 'にち', 'にん', 'だい', 'まい', 'ばん', 'め', 'ごろ', 'かた', 'けん']);

// Câu / cụm câu: kết thúc kiểu câu (です + か/ね/よ/が, ください, ございます), lời chào cố định, hoặc nằm trong danh sách riêng
const SENTENCE_RE = /(ですか|ですね|ですよ|ですが|ください|ございます|ございました|いらっしゃいませ|いらっしゃい$|ありがとう|よろしく|おねがいします|しつれいします|すみません|ごちそうさま|いただきます|いってきます|いってらっしゃい|かしこまりました|わかりました|そうしましょう|どういたしまして|おかえりなさい|おせわになり|ひさしぶり|おめでとう|おげんきで|いかがですか|はいかがです|ませんか$|ましたか$)/;
const SENTENCES = new Set(['こちらはさんです', 'もうです', 'からきました', 'しつれいですが', 'じゃまたあした', 'ざんねんですが', 'こまかいおかね', 'つかれました', 'のどがかわきます', 'おなかがすきます', 'おなかがいっぱいです', 'そろそろしつれいします', 'いいおてんきですね', 'わあすごいひとですね', 'どうもすみません', 'もうかえらないと', 'ごちゅうもんは', 'まだまだです']);

export const isSentence = kana => SENTENCE_RE.test(kana) || SENTENCES.has(kana);

// w: từ trong bộ từ vựng. Từ riêng do người dùng thêm (lesson 0) luôn giữ lại.
export function isMainWord(w) {
  if (!w.lesson) return true;
  return !FUNCTION_WORDS.has(w.kana) && !SUFFIX_WORDS.has(w.kana) && !isSentence(w.kana);
}
