// Bảng kana. Katakana sinh từ hiragana bằng cách cộng 0x60 vào mã ký tự.

export const ROMAJI = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'wo', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo',
  ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo',
  りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo',
  ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  // Kana nhỏ đứng riêng (chỉ để toRomaji không bỏ sót)
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o', ゃ: 'ya', ゅ: 'yu', ょ: 'yo',
};

// Cách gõ khác cũng được chấp nhận khi luyện kana
export const ALT_ROMAJI = { ぢ: ['di'], づ: ['du'], を: ['o'] };

export const KANA_GROUPS = {
  basic: {
    label: 'Âm cơ bản',
    cols: 5,
    rows: [
      ['あ', 'い', 'う', 'え', 'お'],
      ['か', 'き', 'く', 'け', 'こ'],
      ['さ', 'し', 'す', 'せ', 'そ'],
      ['た', 'ち', 'つ', 'て', 'と'],
      ['な', 'に', 'ぬ', 'ね', 'の'],
      ['は', 'ひ', 'ふ', 'へ', 'ほ'],
      ['ま', 'み', 'む', 'め', 'も'],
      ['や', null, 'ゆ', null, 'よ'],
      ['ら', 'り', 'る', 'れ', 'ろ'],
      ['わ', null, null, null, 'を'],
      ['ん'],
    ],
  },
  dakuten: {
    label: 'Âm đục và bán đục',
    cols: 5,
    rows: [
      ['が', 'ぎ', 'ぐ', 'げ', 'ご'],
      ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'],
      ['だ', 'ぢ', 'づ', 'で', 'ど'],
      ['ば', 'び', 'ぶ', 'べ', 'ぼ'],
      ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'],
    ],
  },
  yoon: {
    label: 'Âm ghép',
    cols: 3,
    rows: [
      ['きゃ', 'きゅ', 'きょ'],
      ['しゃ', 'しゅ', 'しょ'],
      ['ちゃ', 'ちゅ', 'ちょ'],
      ['にゃ', 'にゅ', 'にょ'],
      ['ひゃ', 'ひゅ', 'ひょ'],
      ['みゃ', 'みゅ', 'みょ'],
      ['りゃ', 'りゅ', 'りょ'],
      ['ぎゃ', 'ぎゅ', 'ぎょ'],
      ['じゃ', 'じゅ', 'じょ'],
      ['びゃ', 'びゅ', 'びょ'],
      ['ぴゃ', 'ぴゅ', 'ぴょ'],
    ],
  },
};

const shift = (s, from, to, delta) =>
  [...s]
    .map(ch => {
      const c = ch.codePointAt(0);
      return c >= from && c <= to ? String.fromCodePoint(c + delta) : ch;
    })
    .join('');

export const toKatakana = s => shift(s, 0x3041, 0x3096, 0x60);
export const toHiragana = s => shift(s, 0x30a1, 0x30f6, -0x60);

// Danh sách ký tự để luyện: scripts ⊆ ['hira','kata'], groups ⊆ khóa của KANA_GROUPS
export function buildKanaSet(scripts, groups) {
  const out = [];
  for (const g of groups) {
    for (const hira of KANA_GROUPS[g].rows.flat()) {
      if (!hira) continue;
      for (const script of scripts) {
        out.push({
          char: script === 'kata' ? toKatakana(hira) : hira,
          hira,
          script,
          romaji: ROMAJI[hira],
          alts: ALT_ROMAJI[hira] ?? [],
        });
      }
    }
  }
  return out;
}
