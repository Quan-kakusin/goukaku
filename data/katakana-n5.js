// 59 từ katakana hay gặp trong đề N5 (danh sách do người học tra trên mạng; các nguồn ước khoảng 60 từ, không phải danh sách chính thức của JLPT).
// Mỗi mục: kana (từ chuẩn), alts (cách viết khác cũng đúng khi gõ), vi (nghĩa), en (từ gốc), group (nhóm học), note (lưu ý dễ nhầm).
// tests/katakana.test.mjs kiểm tra đủ 59 từ, không trùng, mỗi từ có nghĩa và từ gốc.

const k = (group, kana, vi, en, extra = {}) => ({ kana, vi, en, group, ...extra });

export const KATAKANA_GROUPS = [
  { id: 'hoc', label: 'Học tập・văn phòng' },
  { id: 'may', label: 'Máy móc・âm nhạc' },
  { id: 'ao', label: 'Quần áo' },
  { id: 'nha', label: 'Nhà cửa・nơi chốn' },
  { id: 'an', label: 'Ăn uống・bếp' },
  { id: 'khac', label: 'Đo lường・khác' },
];

export const KATAKANA = [
  k('hoc', 'ボールペン', 'bút bi', 'ball-point pen'),
  k('hoc', 'ペン', 'bút', 'pen'),
  k('hoc', 'ノート', 'vở, sổ tay', 'note(book)'),
  k('hoc', 'ページ', 'trang', 'page'),
  k('hoc', 'カレンダー', 'lịch', 'calendar'),
  k('hoc', 'コピー', 'sao chép, photocopy', 'copy'),
  k('hoc', 'テスト', 'bài kiểm tra', 'test'),
  k('hoc', 'クラス', 'lớp học', 'class'),
  k('hoc', 'ニュース', 'tin tức', 'news'),

  k('may', 'カメラ', 'máy ảnh', 'camera'),
  k('may', 'フィルム', 'cuộn phim', 'film'),
  k('may', 'ラジオ', 'radio, đài', 'radio'),
  k('may', 'ラジカセ', 'máy radio cát-xét', 'radio cassette', { alts: ['ラジオカセット'] }),
  k('may', 'テレビ', 'tivi', 'television'),
  k('may', 'テープ', 'băng (ghi âm), băng keo', 'tape'),
  k('may', 'テープレコーダー', 'máy ghi âm băng từ', 'tape recorder'),
  k('may', 'レコード', 'đĩa nhạc, đĩa than (cũng là kỷ lục)', 'record'),
  k('may', 'ギター', 'đàn ghi-ta', 'guitar'),
  k('may', 'ストーブ', 'lò sưởi', 'stove'),

  k('ao', 'シャツ', 'áo sơ mi, áo phông', 'shirt', { note: 'Dễ nhầm với ワイシャツ (áo sơ mi mặc với vest).' }),
  k('ao', 'ワイシャツ', 'áo sơ mi (mặc với vest)', 'white shirt', { note: 'Dễ nhầm với シャツ.' }),
  k('ao', 'セーター', 'áo len', 'sweater'),
  k('ao', 'コート', 'áo khoác ngoài', 'coat'),
  k('ao', 'スカート', 'cái váy', 'skirt'),
  k('ao', 'ネクタイ', 'cà vạt', 'necktie'),
  k('ao', 'ハンカチ', 'khăn tay', 'handkerchief'),
  k('ao', 'ポケット', 'túi (quần, áo)', 'pocket'),
  k('ao', 'ボタン', 'cúc áo; nút bấm', 'button'),
  k('ao', 'スリッパ', 'dép đi trong nhà', 'slipper'),

  k('nha', 'アパート', 'căn hộ, nhà chung cư nhỏ', 'apartment', { note: 'Dễ nhầm với デパート (cửa hàng bách hóa).' }),
  k('nha', 'ホテル', 'khách sạn', 'hotel'),
  k('nha', 'デパート', 'cửa hàng bách hóa', 'department store', { note: 'Dễ nhầm với アパート (căn hộ).' }),
  k('nha', 'レストラン', 'nhà hàng', 'restaurant'),
  k('nha', 'プール', 'hồ bơi', 'pool'),
  k('nha', 'トイレ', 'nhà vệ sinh', 'toilet'),
  k('nha', 'ドア', 'cửa ra vào', 'door'),
  k('nha', 'ベッド', 'giường ngủ', 'bed'),
  k('nha', 'テーブル', 'cái bàn', 'table'),
  k('nha', 'シャワー', 'vòi hoa sen, tắm vòi sen', 'shower'),
  k('nha', 'ポスト', 'hòm thư, thùng thư', 'post'),
  k('nha', 'エレベーター', 'thang máy', 'elevator', { note: 'Dễ nhầm với エスカレーター (thang cuốn).' }),

  k('an', 'コーヒー', 'cà phê', 'coffee'),
  k('an', 'バター', 'bơ', 'butter'),
  k('an', 'カレー', 'món cà ri', 'curry'),
  k('an', 'ナイフ', 'con dao', 'knife'),
  k('an', 'フォーク', 'cái nĩa', 'fork'),
  k('an', 'スプーン', 'cái thìa', 'spoon'),
  k('an', 'コップ', 'cái cốc, ly (thủy tinh, không quai)', 'cup (tiếng Hà Lan: kop)', { note: 'Dễ nhầm với カップ (tách, chén có quai).' }),
  k('an', 'カップ', 'tách, chén (có quai)', 'cup', { note: 'Dễ nhầm với コップ (cốc thủy tinh).' }),

  k('khac', 'メートル', 'mét', 'meter'),
  k('khac', 'キロメートル', 'ki-lô-mét (km)', 'kilometer', { alts: ['キロ'], note: 'Nói tắt là キロ. キロ còn là cân (kg).' }),
  k('khac', 'キログラム', 'ki-lô-gam, cân (kg)', 'kilogram', { alts: ['キロ'], note: 'Nói tắt là キロ. キロ còn là km.' }),
  k('khac', 'グラム', 'gam', 'gram'),
  k('khac', 'パーティー', 'bữa tiệc', 'party'),
  k('khac', 'スポーツ', 'thể thao', 'sport'),
  k('khac', 'ペット', 'thú cưng', 'pet'),
  k('khac', 'バス', 'xe buýt', 'bus'),
  k('khac', 'タクシー', 'xe taxi', 'taxi'),
  k('khac', 'マッチ', 'que diêm (cũng là trận đấu)', 'match'),
];
