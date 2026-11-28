// Kanji hay thi: 81 từ viết bằng chữ Hán nên thuộc trước kỳ thi.
//  - 71 từ đầu chọn theo tần suất đếm trên 8 đề lấy từ ngoài (3 đề PDF "Nhật Ngữ Thành Công" số 2-4 và đề web số 2, 6-9):
//    từ bị hỏi đọc/viết ở ít nhất 2 đề (star: true, 31 từ) và từ xuất hiện ở ít nhất 5 đề (40 từ). Số đếm do app đếm trên bản chép tay, có thể lệch nhẹ.
//  - 10 từ phương hướng còn lại (上 下 左 右 後ろ 東 西 南 入口 出口) thêm cho đủ cặp.
// Mỗi dòng: [từ, cách đọc, nghĩa, true nếu hay bị hỏi].

const group = (name, rows) => rows.map(([word, kana, vi, star = false]) => ({ word, kana, vi, group: name, star }));

export const KANJI_THI = [
  ...group('Thời gian', [
    ['火曜日', 'かようび', 'thứ Ba', true], ['半分', 'はんぶん', 'một nửa', true], ['日曜日', 'にちようび', 'Chủ nhật'],
    ['今日', 'きょう', 'hôm nay'], ['今', 'いま', 'bây giờ'], ['朝', 'あさ', 'buổi sáng'], ['毎朝', 'まいあさ', 'mỗi sáng'],
    ['昼', 'ひる', 'buổi trưa'], ['午後', 'ごご', 'buổi chiều'], ['先週', 'せんしゅう', 'tuần trước'], ['来週', 'らいしゅう', 'tuần sau'],
    ['時間', 'じかん', 'thời gian, tiếng'], ['休み', 'やすみ', 'ngày nghỉ'],
  ]),
  ...group('Người', [
    ['男', 'おとこ', 'nam', true], ['父', 'ちち', 'bố', true], ['名前', 'なまえ', 'tên', true], ['人', 'ひと', 'người'],
    ['私', 'わたし', 'tôi'], ['子ども', 'こども', 'trẻ con'], ['友だち', 'ともだち', 'bạn bè'], ['先生', 'せんせい', 'thầy cô'],
    ['学生', 'がくせい', 'học sinh, sinh viên'],
  ]),
  ...group('Vị trí, phương hướng', [
    ['上', 'うえ', 'trên'], ['下', 'した', 'dưới'], ['右', 'みぎ', 'bên phải'], ['左', 'ひだり', 'bên trái'],
    ['前', 'まえ', 'trước'], ['後ろ', 'うしろ', 'sau'], ['中', 'なか', 'bên trong'], ['外', 'そと', 'bên ngoài', true],
    ['間', 'あいだ', 'giữa, khoảng', true], ['近く', 'ちかく', 'gần'], ['北', 'きた', 'phía bắc', true], ['南', 'みなみ', 'phía nam'],
    ['東', 'ひがし', 'phía đông'], ['西', 'にし', 'phía tây'], ['入口', 'いりぐち', 'lối vào'], ['出口', 'でぐち', 'lối ra'],
  ]),
  ...group('Nơi chốn', [
    ['学校', 'がっこう', 'trường học', true], ['会社', 'かいしゃ', 'công ty', true], ['銀行', 'ぎんこう', 'ngân hàng', true],
    ['店', 'みせ', 'cửa hàng'], ['屋', 'や', 'tiệm'], ['国', 'くに', 'đất nước'], ['日本', 'にほん', 'Nhật Bản'],
  ]),
  ...group('Thiên nhiên, đồ vật', [
    ['雨', 'あめ', 'mưa', true], ['天気', 'てんき', 'thời tiết', true], ['空', 'そら', 'bầu trời', true], ['魚', 'さかな', 'cá', true],
    ['動物', 'どうぶつ', 'động vật', true], ['新聞', 'しんぶん', 'báo', true], ['電車', 'でんしゃ', 'tàu điện', true],
    ['水', 'みず', 'nước'], ['お金', 'おかね', 'tiền'], ['日本語', 'にほんご', 'tiếng Nhật'],
  ]),
  ...group('Động từ', [
    ['書く', 'かく', 'viết', true], ['読む', 'よむ', 'đọc'], ['見る', 'みる', 'xem, nhìn', true], ['言う', 'いう', 'nói', true],
    ['飲む', 'のむ', 'uống', true], ['食べる', 'たべる', 'ăn'], ['行く', 'いく', 'đi'], ['来る', 'くる', 'đến'], ['帰る', 'かえる', 'về'],
    ['出る', 'でる', 'ra, rời đi'], ['走る', 'はしる', 'chạy', true], ['立つ', 'たつ', 'đứng', true], ['休む', 'やすむ', 'nghỉ', true],
    ['買う', 'かう', 'mua'], ['売る', 'うる', 'bán'], ['作る', 'つくる', 'làm, nấu'], ['会う', 'あう', 'gặp'],
  ]),
  ...group('Tính từ và từ khác', [
    ['小さい', 'ちいさい', 'nhỏ', true], ['大きい', 'おおきい', 'to'], ['高い', 'たかい', 'cao, đắt', true], ['安い', 'やすい', 'rẻ', true],
    ['多い', 'おおい', 'nhiều', true], ['少ない', 'すくない', 'ít', true], ['少し', 'すこし', 'một chút'], ['暗い', 'くらい', 'tối', true],
    ['好き', 'すき', 'thích'],
  ]),
];

export const KANJI_THI_GROUPS = [...new Set(KANJI_THI.map(w => w.group))];
