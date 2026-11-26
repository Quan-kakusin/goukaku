// Đề thi thử JLPT N5 số 2: đề chép từ file PDF của người học (文字 · 文法 · 読解) kèm bảng đáp án.
// Phần nghe 聴解: 4 file âm thanh (audio/de-02/N5Q1-4.mp3, mỗi file một もんだい) kèm hình đề cắt từ file PDF (audio/de-02/c1-q*.jpg, c3-q*.jpg).
//  - Đáp án phần nghe lấy từ bảng 正答表. Lời chép và lời giải từng câu nghe ở de-02-nghe.js.
//  - Nội dung chép từ ảnh scan nên có thể sai sót nhỏ; riêng đáp án nhiễu của 問題2 (chữ Hán na ná nhau) ảnh mờ nên có chỗ phải dựng lại.
//  - Câu hỏi dựa vào hình minh họa được mô tả bằng chữ trong dấu [ ].
//  - Phần giải thích và bản dịch tiếng Việt do app soạn.

import NGHE from './de-02-nghe.js';

const Q = (prompt, choices, answer, explain, extra = {}) => ({ prompt, choices, answer, explain, ...extra });

// Câu nghe: prompt là số thứ tự "Nばん"; choices là chữ in trên đề, hoặc chỉ số 1-4 (bare) khi lựa chọn là hình / chỉ nghe
const AUDIO = 'audio/de-02';
const L = (n, choices, answer, extra = {}) => Q(`${n}ばん`, choices, answer, '', extra); // lời giải gắn ở cuối phần này, lấy từ de-02-nghe.js
const pics = (n, image, answer, count = 4) => L(n, Array.from({ length: count }, (_, i) => String(i + 1)), answer, { bare: true, image: `${AUDIO}/${image}` });

const choukaiSections = [
  {
    id: 'c1',
    kind: 'choukai',
    mondai: '問題1',
    title: 'Nghe câu hỏi rồi chọn',
    audioSrc: `${AUDIO}/N5Q1.mp3`,
    instr: 'もんだい1では、はじめに しつもんを きいて ください。それから はなしを きいて、もんだいようしの 1から4の なかから、いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Nghe câu hỏi trước, rồi nghe hội thoại, chọn đáp án đúng nhất trong 1-4 (nhìn hình hoặc chọn chữ).',
    questions: [
      pics(1, 'c1-q1.jpg', 2),
      L(2, ['1かい', '2かい', '3かい', '4かい'], 2),
      pics(3, 'c1-q3.jpg', 3),
      pics(4, 'c1-q4.jpg', 3),
      pics(5, 'c1-q5.jpg', 1),
      pics(6, 'c1-q6.jpg', 4),
      L(7, ['1ばん', '3ばん', '5ばん', '7ばん'], 4),
    ],
  },
  {
    id: 'c2',
    kind: 'choukai',
    mondai: '問題2',
    title: 'Nghe câu hỏi rồi chọn',
    audioSrc: `${AUDIO}/N5Q2.mp3`,
    instr: 'もんだい2では、はじめに しつもんを きいて ください。それから はなしを きいて、もんだいようしの 1から4の なかから、いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Nghe câu hỏi trước, rồi nghe hội thoại, chọn đáp án đúng nhất trong 1-4 (các đáp án in bằng chữ).',
    questions: [
      L(1, ['1じかん', '2じかん', '3じかん', '4じかん'], 4),
      L(2, ['512-7733', '512-7734', '512-7743', '512-7744'], 3),
      L(3, ['りょうしん', 'あね', 'いもうと', 'おとうと'], 2),
      L(4, ['しょくどう', 'きっさてん', 'パンや', 'きょうしつ'], 4),
      L(5, ['くろい ボールペン', 'あかい ボールペン', 'くろい えんぴつ', 'あかい えんぴつ'], 1),
      L(6, ['こうえん', 'えき', 'きっさてん', 'レストラン'], 3),
    ],
  },
  {
    id: 'c3',
    kind: 'choukai',
    mondai: '問題3',
    title: 'Nhìn tranh, chọn câu nói',
    audioSrc: `${AUDIO}/N5Q3.mp3`,
    instr: 'もんだい3では、えを みながら しつもんを きいて ください。➡(やじるし)の ひとは なんと いいますか。1から3の なかから、いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Nhìn tranh và nghe: người có mũi tên sẽ nói gì? Chọn đáp án đúng nhất trong 1-3 (các lựa chọn chỉ có trong file nghe).',
    questions: [pics(1, 'c3-q1.jpg', 1, 3), pics(2, 'c3-q2.jpg', 3, 3), pics(3, 'c3-q3.jpg', 2, 3), pics(4, 'c3-q4.jpg', 3, 3), pics(5, 'c3-q5.jpg', 2, 3)],
  },
  {
    id: 'c4',
    kind: 'choukai',
    mondai: '問題4',
    title: 'Nghe câu, chọn câu trả lời',
    audioSrc: `${AUDIO}/N5Q4.mp3`,
    instr: 'もんだい4は、えなどが ありません。ぶんを きいて、1から3の なかから、いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Không có tranh. Nghe một câu rồi chọn câu đáp lại đúng nhất trong 1-3 (các lựa chọn chỉ có trong file nghe).',
    questions: [1, 1, 2, 3, 3, 1].map((a, i) => L(i + 1, ['1', '2', '3'], a, { bare: true })),
  },
];

// Gắn lời chép (script) và lời giải của từng câu nghe
for (const s of choukaiSections) s.questions.forEach((raw, i) => Object.assign(raw, NGHE[`${s.id}-${i + 1}`]));

const mojiSections = [
  {
    id: 'm1',
    kind: 'moji',
    mondai: '問題1',
    title: 'Cách đọc kanji',
    instr: '【　】の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Chọn cách đọc bằng hiragana đúng của từ gạch chân.',
    questions: [
      Q('【先週】 デパートに かいものに いきました。', ['せんしゅ', 'せんしゅう', 'ぜんしゅ', 'ぜんしゅう'], 2, 'Câu nghĩa: tuần trước tôi đã đi mua đồ ở cửa hàng bách hóa. 先週 đọc là せんしゅう (tuần trước): 先 đọc せん (không đục thành ぜん), 週 đọc しゅう với âm kéo dài, phải có う ở cuối. Vì vậy せんしゅ thiếu trường âm là sai, còn ぜんしゅ và ぜんしゅう đều sai vì đọc 先 thành ぜん.'),
      Q('ごはんの 【後】で さんぽします。', ['つぎ', 'うしろ', 'まえ', 'あと'], 4, 'Câu nghĩa: sau bữa cơm thì đi dạo. 後 đọc là あと (sau, sau khi), ごはんの あとで = sau khi ăn cơm. Các đáp án khác là từ dễ nhầm: つぎ (次) là kế tiếp, うしろ (後ろ) là phía sau về vị trí, まえ (前) là trước, trái nghĩa với あと.'),
      Q('もう いちど 【言って】 ください。', ['いって', 'きって', 'まって', 'たって'], 1, 'Câu nghĩa: xin hãy nói lại một lần nữa. 言って đọc là いって, thể て của 言う (nói), động từ nhóm う đổi う thành って. Các đáp án khác là thể て của động từ khác: きって (切って, cắt), まって (待って, đợi), たって (立って, đứng), không phải chữ 言.'),
      Q('ちかくに 【山】が あります。', ['かわ', 'やま', 'いけ', 'うみ'], 2, 'Câu nghĩa: gần đây có núi. 山 đọc là やま (núi), chữ vẽ hình ba ngọn núi. Ba đáp án kia là các danh từ chỉ thiên nhiên dễ lẫn: かわ (川, sông), いけ (池, ao), うみ (海, biển), đều không phải 山.'),
      Q('この ホテルは へやが 【多い】です。', ['すくない', 'おおい', 'せまい', 'ひろい'], 2, 'Câu nghĩa: khách sạn này có nhiều phòng. 多い đọc là おおい (nhiều). Các đáp án khác: すくない (少ない, ít) là trái nghĩa, せまい (狭い, chật hẹp) và ひろい (広い, rộng) nói về diện tích chứ không phải số lượng, nên không đọc cho chữ 多.'),
      Q('ともだちと いっしょに 【学校】に いきます。', ['がこう', 'がこお', 'がっこう', 'がっこお'], 3, 'Câu nghĩa: tôi đi đến trường cùng bạn. 学校 đọc là がっこう (trường học): 学 vốn là がく, trước âm こ thì く biến thành âm ngắt っ nên thành がっ, còn 校 đọc こう và kéo dài bằng う (không viết お). Vì vậy がこう thiếu っ, còn がこお và がっこお sai ở phần kéo dài.'),
      Q('えんぴつが 【六本】 あります。', ['ろくぼん', 'ろくぽん', 'ろっぼん', 'ろっぽん'], 4, 'Câu nghĩa: có sáu cây bút chì. 六本 đọc là ろっぽん (sáu vật dài mảnh). Cả hai chữ đều biến âm: 六 thành ろっ, rồi 本 thành ぽん sau âm ngắt. Quy tắc nhớ: 1, 6, 8, 10 đi với ぽん (いっぽん, ろっぽん, はっぽん), còn 3 đi với ぼん (さんぼん). Vì vậy ろくぼん, ろくぽん, ろっぼん đều sai.'),
      Q('この 【新聞】は いくらですか。', ['しんむん', 'しんぶん', 'しむん', 'しぶん'], 2, 'Câu nghĩa: tờ báo này giá bao nhiêu. 新聞 đọc là しんぶん (báo): 新 đọc しん (có ん), 聞 trong từ này đọc ぶん. しんむん sai vì đọc 聞 thành むん, còn しむん và しぶん thì thiếu ん của 新.'),
      Q('この カメラは 【安い】です。', ['たかい', 'やすい', 'おもい', 'かるい'], 2, 'Câu nghĩa: chiếc máy ảnh này rẻ. 安い đọc là やすい (rẻ). たかい (高い) là đắt hoặc cao, trái nghĩa với 安い. おもい (重い, nặng) và かるい (軽い, nhẹ) nói về trọng lượng chứ không nói về giá.'),
      Q('かさは 【外】に あります。', ['いえ', 'なか', 'そと', 'にわ'], 3, 'Câu nghĩa: cái ô ở bên ngoài. 外 đọc là そと (bên ngoài), trái nghĩa với なか (中, bên trong). いえ (家) là nhà, にわ (庭) là vườn, đều không phải cách đọc của 外.'),
    ],
  },
  {
    id: 'm2',
    kind: 'moji',
    mondai: '問題2',
    title: 'Viết kanji',
    looseChoices: true,
    instr: '【　】の ことばは どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Chọn cách viết đúng (katakana hoặc kanji) của từ gạch chân. Đáp án nhiễu là chữ na ná nhau.',
    questions: [
      Q('けさ 【しゃわー】を あびました。', ['シャワー', 'シャウー', 'ツャワー', 'ツャウー'], 1, 'Câu nghĩa: sáng nay tôi đã tắm vòi sen. しゃわー viết là シャワー (shower, vòi hoa sen). Dễ nhầm hai cặp chữ: シ có hai nét ngắn nằm ngang và nét dài hất lên, còn ツ hai nét ngắn đứng và nét dài kéo xuống; ワ không có nét chấm trên đầu, còn ウ thì có. Vì vậy ツ ở đầu từ và ウ ở giữa đều sai.'),
      Q('コーヒーを 【のみました】。', ['飯みました', '飲みました', '餃みました', '飮みました'], 2, 'Câu nghĩa: tôi đã uống cà phê. のみました viết là 飲みました (đã uống), từ 飲む, gồm bộ 食 (ăn) và 欠 (há miệng). 飯 đọc めし hoặc はん (cơm, như ごはん), 餃 là chữ trong 餃子 (ぎょうざ) và không mang nghĩa uống. 飮 là dạng viết sai, không dùng.'),
      Q('あたらしい 【くるま】を かいました。', ['卓', '草', '車', '軍'], 3, 'Câu nghĩa: tôi đã mua chiếc xe hơi mới. くるま viết là 車 (xe), chữ vẽ hình bánh xe nhìn từ trên. Các chữ nhiễu có hình gần giống: 軍 (ぐん, quân đội) có thêm nét mái che ở trên, 草 (くさ, cỏ) có bộ cỏ, 卓 (たく, cái bàn) có phần 卜 ở trên, không chữ nào đọc là くるま.'),
      Q('この ぼうしは 【1000えん】です。', ['1000内', '1000用', '1000冊', '1000円'], 4, 'Câu nghĩa: cái mũ này giá 1000 yên. えん viết là 円 (yên, đơn vị tiền Nhật), đứng sau số tiền. Các chữ nhiễu có nghĩa khác: 内 (うち, ない) là bên trong, 用 (よう) là dùng hoặc việc, 冊 (さつ) là đơn vị đếm sách, đều không dùng để chỉ tiền.'),
      Q('しゅくだいが 【はんぶん】 おわりました。', ['羊分', '年分', '丰分', '半分'], 4, 'Câu nghĩa: bài tập về nhà đã xong một nửa. はんぶん viết là 半分 (một nửa). 半 có hai nét chấm trên đầu, hai nét ngang và một nét sổ xuyên qua; 羊 (ひつじ, con cừu) có ba nét ngang nên dễ nhầm. 年 là ねん (năm), 丰 không phải chữ dùng ở đây. 分 trong từ này đọc là ぶん.'),
      Q('わたしの うちに 【きませんか】。', ['来ませんか', '采ませんか', '木ませんか', '未ませんか'], 1, 'Câu nghĩa: bạn có đến nhà tôi không? (lời mời). きませんか viết là 来ませんか, từ 来る (đến). 木 là き (cây) nhưng không có nghĩa đến, 来 khác 木 ở hai nét chấm hai bên. 未 là み (chưa), còn 采 không phải chữ chỉ việc đến, nên đều sai.'),
      Q('きのう たなかさんと 【あいました】。', ['見いました', '書いました', '会いました', '話いました'], 3, 'Câu nghĩa: hôm qua tôi đã gặp anh Tanaka. あいました viết là 会いました (đã gặp), từ 会う, mẫu 人と 会う = gặp ai. Các đáp án khác là chữ đúng nhưng đọc khác: 見 (み, nhìn), 書 (か, viết), 話 (はな, nói chuyện), không chữ nào đọc là あ(う).'),
      Q('いもうとと 【おなじ】 ふくを かいました。', ['同じ', '回じ', '司じ', '固じ'], 1, 'Câu nghĩa: tôi đã mua quần áo giống của em gái. おなじ viết là 同じ (giống nhau). 同 có khung 冂 bên ngoài và 一口 bên trong. Các chữ nhiễu: 回 (かい, まわる: lần, quay) là hai ô vuông lồng nhau, 固 (かたい: cứng) là khung 囗 bọc chữ 古, 司 (し: phụ trách) có hình khác, nên không đọc là おなじ.'),
    ],
  },
  {
    id: 'm3',
    kind: 'moji',
    mondai: '問題3',
    title: 'Từ hợp ngữ cảnh',
    instr: '（　　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Chọn từ thích hợp điền vào chỗ trống.',
    questions: [
      Q('わたしの へやは この （　　）の 2かいです。', ['エレベーター', 'プール', 'エアコン', 'アパート'], 4, 'Câu nghĩa: phòng của tôi ở tầng 2 của căn hộ này. Chọn アパート (căn hộ, nhà chung cư nhỏ) vì là tòa nhà có nhiều tầng và nhiều phòng. エレベーター là thang máy (đi lên tầng chứ không có tầng 2 của nó), プール là bể bơi, エアコン là máy điều hòa, đều không hợp với 2かい.'),
      Q('さとうさんは ギターを じょうずに （　　）。', ['うたいます', 'ききます', 'ひきます', 'あそびます'], 3, 'Câu nghĩa: anh Sato chơi đàn ghi-ta rất giỏi. Nhạc cụ dây hoặc piano đi với ひきます (gảy, đàn): ギターを ひきます. うたいます là hát, ききます là nghe, あそびます là chơi đùa (vui chơi), không dùng cho việc chơi nhạc cụ.'),
      Q('テーブルに おさらと はしを （　　） ください。', ['ならべて', 'とって', 'たべて', 'あらって'], 1, 'Câu nghĩa: hãy bày đĩa và đũa lên bàn. ならべる (並べる) là xếp, bày ra thành hàng. Các đáp án khác không hợp với đĩa và đũa: とって (とる, lấy), たべて (たべる, ăn), あらって (あらう, rửa) đều có nghĩa khác, không phải bày ra bàn.'),
      Q('けさ そうじを したから へやは （　　）です。', ['きれい', 'きたない', 'あかるい', 'くらい'], 1, 'Câu nghĩa: vì sáng nay đã dọn dẹp nên phòng sạch sẽ. きれい (sạch sẽ, đẹp) là kết quả hợp lý của việc そうじ (dọn dẹp). きたない là bẩn nên mâu thuẫn, あかるい (sáng) và くらい (tối) nói về ánh sáng chứ không nói về việc dọn dẹp.'),
      Q('きょうは 500（　　） およぎました。', ['ど', 'ばん', 'メートル', 'グラム'], 3, 'Câu nghĩa: hôm nay tôi đã bơi 500 mét. Số 500 đi với đơn vị khoảng cách メートル (mét). ど (度) là độ hoặc lần (nhiệt độ, số lần), ばん (番) là số thứ tự, グラム là gam (khối lượng); không dùng để đo quãng đường bơi.'),
      Q('えきから たいしかんまでの （　　）を かいて ください。', ['しゃしん', 'ちず', 'てがみ', 'きっぷ'], 2, 'Câu nghĩa: hãy vẽ bản đồ từ ga đến đại sứ quán. Chọn ちず (bản đồ) vì nó chỉ đường đi từ nơi này đến nơi kia. しゃしん là ảnh, てがみ là thư, きっぷ là vé; không thể 「vẽ」 một cái vé hay thư để chỉ đường từ ga đến đại sứ quán.'),
      Q('うるさいから テレビを （　　） ください。', ['けして', 'つけて', 'しめて', 'あけて'], 1, 'Câu nghĩa: ồn quá nên hãy tắt tivi đi. けす (消す) là tắt, hợp với うるさい (ồn ào). つける (bật) có nghĩa ngược lại nên làm ồn hơn, しめる là đóng, あける là mở, hai từ này dùng cho cửa hoặc cửa sổ chứ không dùng cho tivi.'),
      Q('きょうは （　　）が ふって います。', ['くもり', 'はれ', 'かぜ', 'ゆき'], 4, 'Câu nghĩa: hôm nay tuyết đang rơi. ふる (rơi) đi với ゆき (tuyết) hoặc あめ (mưa). くもり (trời nhiều mây) và はれ (trời nắng) là trạng thái thời tiết nên không đi với ふって います; かぜ (gió) đi với ふく (thổi) chứ không phải ふる.'),
      Q('[Hình: một hộp đựng 5 quả táo] はこに りんごが （　　） あります。', ['よっつ', 'いつつ', 'むっつ', 'ななつ'], 2, 'Câu nghĩa: trong hộp có năm quả táo. Cách đếm đồ vật thông thường: ひとつ (1), ふたつ (2), みっつ (3), よっつ (4), いつつ (5), むっつ (6), ななつ (7). Hình có 5 quả nên chọn いつつ; よっつ là 4, むっつ là 6, ななつ là 7.'),
      Q('[Hình: cái bàn, kính đặt trên mặt bàn, túi xách để dưới bàn, ô nằm dưới sàn bên cạnh ghế] めがねは つくえの （　　）に あります。', ['そば', 'よこ', 'した', 'うえ'], 4, 'Câu nghĩa: kính ở trên bàn. Trong hình kính đặt trên mặt bàn nên chọn うえ (trên). した (dưới) mô tả túi xách để dưới bàn, còn そば (bên cạnh, gần) và よこ (bên cạnh, bên hông) không đúng vị trí của kính (kính nằm trên mặt bàn).'),
    ],
  },
  {
    id: 'm4',
    kind: 'moji',
    mondai: '問題4',
    title: 'Câu cùng nghĩa',
    instr: '【　】の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Chọn câu có nghĩa gần giống với câu gạch chân.',
    questions: [
      Q('【まいばん くにの かぞくに でんわします。】', ['よるは ときどき くにの かぞくに でんわします。', 'あさは ときどき くにの かぞくに でんわします。', 'よるは いつも くにの かぞくに でんわします。', 'あさは いつも くにの かぞくに でんわします。'], 3, 'Câu nghĩa: mỗi tối tôi gọi điện cho gia đình ở quê. まいばん (mỗi tối) tương đương よるは いつも (buổi tối lúc nào cũng). ときどき là thỉnh thoảng nên ít hơn mỗi tối, còn あさ là buổi sáng nên sai thời gian.'),
      Q('【この まちには ゆうめいな たてものが あります。】', ['この まちには ゆうめいな ビルが あります。', 'この まちには ゆうめいな おちゃが あります。', 'この まちには ゆうめいな ケーキが あります。', 'この まちには ゆうめいな こうえんが あります。'], 1, 'Câu nghĩa: thành phố này có công trình nổi tiếng. たてもの (建物) là tòa nhà, công trình xây dựng, gần nghĩa với ビル (tòa nhà cao tầng). おちゃ là trà, ケーキ là bánh, こうえん là công viên, đều không phải công trình xây dựng, nên không thay được たてもの.'),
      Q('【その えいがは おもしろくなかったです。】', ['その えいがは たのしかったです。', 'その えいがは つまらなかったです。', 'その えいがは みじかかったです。', 'その えいがは ながかったです。'], 2, 'Câu nghĩa: bộ phim đó không thú vị. おもしろくなかった (không thú vị) gần nghĩa với つまらなかった (chán). たのしかった (vui) có nghĩa ngược lại; みじかかった (ngắn) và ながかった (dài) nói về độ dài chứ không đánh giá hay dở.'),
      Q('【たんじょうびは 6がつ15にちです。】', ['6がつ15にちに けっこんしました。', '6がつ15にちに テストが はじまりました。', '6がつ15にちに うまれました。', '6がつ15にちに くにへ かえりました。'], 3, 'Câu nghĩa: sinh nhật là ngày 15 tháng 6. たんじょうび (sinh nhật) tương đương 6がつ15にちに うまれました (sinh vào ngày 15 tháng 6). Các câu khác khác hẳn: けっこんしました (đã kết hôn), はじまりました (bắt đầu), かえりました (đã về nước).'),
      Q('【にねんまえに きょうとへ いきました。】', ['きのう きょうとへ いきました。', 'おととい きょうとへ いきました。', 'きょねん きょうとへ いきました。', 'おととし きょうとへ いきました。'], 4, 'Câu nghĩa: hai năm trước tôi đã đi Kyoto. にねんまえ (hai năm trước) là おととし. Phân biệt các từ gần giống: きのう (hôm qua), おととい (hôm kia) tính theo ngày; きょねん (năm ngoái) là một năm trước, おととし là hai năm trước. Dễ nhầm おととい với おととし.'),
    ],
  },
];

const bunpouSections = [
  {
    id: 'g1',
    kind: 'bunpou',
    mondai: '問題1',
    title: 'Điền từ vào câu',
    instr: '（　　）に 何を 入れますか。1・2・3・4から いちばん いい ものを 一つ えらんで ください。',
    instrVi: 'Chọn từ thích hợp nhất để điền vào chỗ trống.',
    questions: [
      Q('日本（　　）ラーメンは おいしいです。', ['に', 'の', 'を', 'へ'], 2,
        'Câu nghĩa: mì ramen của Nhật rất ngon. Danh từ + の + danh từ: 日本の ラーメン (ramen của Nhật), の nối hai danh từ để bổ nghĩa. に (nơi chốn, thời điểm), を (tân ngữ), へ (hướng đi) không nối được hai danh từ như vậy nên câu sai.'),
      Q('わたしには きょうだいが 二人 います。弟（　　）妹です。', ['は', 'も', 'と', 'か'], 3,
        'Câu nghĩa: tôi có hai anh chị em, là em trai và em gái. と dùng để liệt kê đầy đủ: 弟と妹 (em trai và em gái), hợp với 二人 (hai người). か là hoặc nên mâu thuẫn, も là cũng, は nêu chủ đề; 弟は妹です hay 弟も妹です đều không đúng nghĩa.'),
      Q('山下「田中さん（　　）きのう どこかに 出かけましたか。」田中「いいえ、いえに いました。」', ['で', 'は', 'を', 'に'], 2,
        'Câu nghĩa: Yamashita hỏi: còn anh Tanaka thì hôm qua có đi đâu không? は nêu chủ đề của câu hỏi (còn Tanaka thì sao). で (nơi diễn ra hành động), を (tân ngữ) và に (đích đến, thời điểm) không đứng sau tên người trong vai trò chủ đề như vậy.'),
      Q('（タクシーで）A「つぎの かどを 右（　　）まがって ください。」B「わかりました。」', ['が', 'や', 'か', 'に'], 4,
        'Câu nghĩa: hãy rẽ phải ở góc tiếp theo. 右に まがる: に chỉ hướng rẽ (rẽ phải). が là trợ từ chủ ngữ, や dùng liệt kê (A や B), か là hoặc hay nghi vấn; ba trợ từ này đều không chỉ hướng đi.'),
      Q('きのう、わたしは ひとり（　　）えいがを 見に 行きました。', ['が', 'を', 'で', 'は'], 3,
        'Câu nghĩa: hôm qua tôi đã đi xem phim một mình. ひとりで = một mình. Trợ từ で chỉ cách thức hoặc số người cùng làm: ひとりで, ふたりで (hai người). が, を, は lần lượt là chủ ngữ, tân ngữ và chủ đề nên không diễn tả được 「một mình」.'),
      Q('山下「今日 パーティーが ありますから、田中さん（　　）来て ください。」田中「ありがとうございます。」', ['に', 'も', 'や', 'で'], 2,
        'Câu nghĩa: hôm nay có tiệc nên anh Tanaka cũng đến nhé. も = cũng: 田中さんも 来て ください (mời cả anh Tanaka, ngoài những người khác). に, や, で không hợp: に chỉ đích hay thời điểm, や dùng liệt kê nhiều danh từ, で chỉ nơi hay phương tiện, không tạo thành lời mời đúng nghĩa.'),
      Q('田中「この ぼうしは 山田さん（　　）ですか。」山田「はい。」', ['や', 'は', 'の', 'か'], 3,
        'Câu nghĩa: cái mũ này là của anh Yamada phải không? 山田さんの です: の ở cuối thay cho danh từ đã biết (cái mũ), nghĩa là 「của anh Yamada」. や chỉ dùng để liệt kê, は nêu chủ đề nên không tạo ý sở hữu, còn か thì thừa vì câu đã có ですか ở cuối.'),
      Q('駅まで タクシーで 1000円（　　）です。', ['ぐらい', 'など', 'ごろ', 'も'], 1,
        'Câu nghĩa: đi taxi đến ga khoảng 1000 yên. ぐらい đứng sau số lượng hay tiền = khoảng: 1000円ぐらい. ごろ chỉ dùng với thời điểm (3時ごろ), など là 「v.v.」 (liệt kê), も thêm sắc thái 「tận 1000 yên」 chứ không diễn tả ước chừng.'),
      Q('A「さようなら。」B「さようなら。また（　　）。」', ['おととい', '今日', '来週', '今月'], 3,
        'Câu nghĩa: chào tạm biệt rồi hẹn: hẹn gặp lại tuần sau nhé. また 来週 (hẹn tuần sau gặp lại) là cách nói tự nhiên khi chia tay. おととい (hôm kia) là quá khứ nên không thể gặp lại, 今日 (hôm nay) đang là lúc chia tay, còn 今月 (tháng này) không phải cách hẹn thông thường.'),
      Q('わたしの 母は 50さいです。父は 55さいです。母は 父（　　）5さい わかいです。', ['から', 'まで', 'より', 'のほうが'], 3,
        'Câu nghĩa: mẹ tôi 50 tuổi, bố 55 tuổi, mẹ trẻ hơn bố 5 tuổi. Mẫu so sánh: A は B より ～ (A ～ hơn B), vậy 母は 父より 5さい わかい. から (từ), まで (đến) không dùng để so sánh; のほうが cần cấu trúc 「AのほうがBより」 nên không điền được vào chỗ này.'),
      Q('子ども「いただきます。」母「あ、食べる（　　）手を あらいましょう。」', ['まえに', 'のまえに', 'あとに', 'のあとに'], 1,
        'Câu nghĩa: con nói itadakimasu, mẹ nói: hãy rửa tay trước khi ăn. Động từ thể từ điển + まえに = trước khi ～: 食べる まえに. のまえに chỉ đi với danh từ (ごはんの まえに). あと (sau) trái nghĩa: sau khi ăn thì không còn cần rửa tay trước nữa, và dạng đúng khi dùng あと phải là 食べた あとで.'),
      Q('A「東京でも 雪が ふりますか。」B「ええ、ふりますよ。でも、きょねんは あまり（　　）。」', ['ふりませんでした', 'ふりません', 'ふりました', 'ふります'], 1,
        'Câu nghĩa: ở Tokyo cũng có tuyết rơi à? Có chứ, nhưng năm ngoái không rơi mấy. きょねん (năm ngoái) là quá khứ, あまり đi với phủ định nên chọn ふりませんでした (quá khứ phủ định). ふりません là phủ định hiện tại, ふりました và ふります là khẳng định nên không đi với あまり.'),
      Q('（川で）A「見て ください。小さな 魚が たくさん（　　）よ。」B「ほんとうですね。30ぴきぐらい いますね。」', ['およぎます', 'およぎません', 'およぎました', 'およいで います'], 4,
        'Câu nghĩa: nhìn kìa, nhiều cá nhỏ đang bơi. Đang nhìn thấy cá bơi ngay lúc nói nên dùng ～て います (đang bơi): およいで います. およぎます (sẽ bơi, thói quen), およぎません (không bơi), およぎました (đã bơi xong) đều không diễn tả hành động đang diễn ra trước mắt.'),
      Q('中川「山田さんの その カメラは いいですね。どこで かいましたか。」山田「いえ、これは 兄に（　　）。」', ['あげました', 'もらいました', 'うりました', 'かいました'], 2,
        'Câu nghĩa: cái máy ảnh này tôi nhận từ anh trai. Người nhận + 人に + もらいました (nhận từ ai): に chỉ nguồn nhận. あげました là cho (hướng ngược lại, và に sẽ thành người nhận), うりました là bán, かいました là mua, nhưng Yamada đã phủ định bằng いえ nên không phải 「mua」.'),
      Q('たまごりょうりの じょうずな 作りかたを（　　）読みました。', ['何に', '何も', '何かへ', '何かで'], 4,
        'Câu nghĩa: cách làm món trứng ngon, tôi đã đọc ở đâu đó. 何かで 読みました (đã đọc ở đâu đó): 何か là một thứ nào đó chưa xác định (sách, báo, mạng), で chỉ nơi hoặc phương tiện thông tin. 何に (đọc vào cái gì) và 何かへ (hướng đến) không hợp; 何も cần phủ định (何も読みませんでした).'),
      Q('（電話で）本田「はい、本田です。」北山「あ、北山花子です。すみません、（　　）。」本田「はい。ちょっと まって くださいね。」', ['ひろこさんを おねがいします', 'ひろこさんを ください', 'ひろこさんと 話しますか', 'ひろこさんと 話しませんか'], 1,
        'Trên điện thoại xin gặp ai: ～さんを おねがいします (cho tôi gặp/nói chuyện với Hiroko). Câu 2 là "xin hãy đưa cho tôi Hiroko" (không tự nhiên), câu 3, 4 là hỏi/rủ nhau nói chuyện, sai ngữ cảnh.'),
    ],
  },
  {
    id: 'g2',
    kind: 'bunpou',
    mondai: '問題2',
    title: 'Sắp xếp câu (★)',
    sort: true,
    keepOrder: true,
    instr: '★ に 入る ものは どれですか。1・2・3・4から いちばん いい ものを 一つ えらんで ください。',
    instrVi: 'Sắp xếp 4 phương án thành câu đúng, chọn phương án nằm ở ô có dấu ★.',
    questions: [
      Q('（店で）田中「すみません。くだもの ＿ ＿ ★ ＿ か。」店の 人「こちらです。」', ['どこ', 'あります', 'は', 'に'], 4,
        'Câu hoàn chỉnh: くだものは どこに ありますか (thứ tự 3 1 4 2), nghĩa 「xin lỗi, trái cây ở đâu vậy ạ?」. Logic: くだもの là chủ đề nên có は theo sau, hỏi nơi chốn dùng どこ, に chỉ nơi tồn tại đi trước あります (có, ở), cuối cùng là か. Ô ★ (ô thứ ba) là に.'),
      Q('A「山下さんは？」B「となりの へやで ＿ ＿ ★ ＿ して います。」', ['れんしゅう', 'の', 'ギター', 'を'], 1,
        'Câu hoàn chỉnh: ギターの れんしゅうを して います (thứ tự 3 2 1 4), nghĩa 「(anh ấy) đang luyện tập đàn ghi-ta ở phòng bên cạnh」. Logic: ギター + の + れんしゅう (việc luyện tập ghi-ta), を là tân ngữ của して います (đang làm). Ô ★ (ô thứ ba) là れんしゅう.'),
      Q('A「会社 ＿ ＿ ★ ＿ 行って いますか。」B「わたしは あるいて 行って います。」', ['で', 'は', 'へ', '何'], 4,
        'Câu hoàn chỉnh: 会社へは 何で 行って いますか (thứ tự 3 2 4 1), nghĩa 「bạn đi đến công ty bằng gì?」. Logic: 会社へ chỉ hướng đến, は nêu chủ đề, 何で hỏi phương tiện (người kia trả lời 「đi bộ」). Ô ★ (ô thứ ba) là 何.'),
      Q('山田「ジョンさん、しゅくだいは ぜんぶ おわりましたか。」ジョン「いいえ、まだです。ここ ＿ ＿ ★ ＿、さいごの もんだいが むずかしいです。」', ['は', 'かんたんでした', 'が', 'まで'], 2,
        'Câu hoàn chỉnh: ここまでは かんたんでしたが、さいごの もんだいが むずかしいです (thứ tự 4 1 2 3), nghĩa 「đến đây thì dễ, nhưng bài cuối thì khó」. Logic: ここ + まで (đến đây) + は (đối chiếu), かんたんでした (đã dễ), が (nhưng) nối hai vế tương phản. Ô ★ (ô thứ ba) là かんたんでした.'),
      Q('（本屋で）ヤン「わたしは この 本を 買います。アンナさんは どんな 本が いいですか。」アンナ「わたしは もう 少し ＿ ＿ ★ ＿ が いいです。」', ['本', 'かんたんな', 'が', '日本語'], 2,
        'Câu hoàn chỉnh: もう 少し 日本語が かんたんな 本が いいです (thứ tự 4 3 2 1), nghĩa 「tôi muốn cuốn sách có tiếng Nhật dễ hơn một chút」. Logic: 日本語が là chủ ngữ của mệnh đề bổ nghĩa, かんたんな (tính từ đuôi な) bổ nghĩa cho danh từ 本. Ô ★ (ô thứ ba) là かんたんな.'),
    ],
  },
  {
    id: 'g3',
    kind: 'bunpou',
    mondai: '問題3',
    title: 'Điền vào đoạn văn',
    instr: '【22】から【26】に 何を 入れますか。ぶんしょうの いみを かんがえて、1・2・3・4から いちばん いい ものを 一つ えらんで ください。',
    instrVi: 'Dựa vào nghĩa của đoạn văn, chọn từ thích hợp điền vào các chỗ trống 22 đến 26.',
    passage: '日本で べんきょうして いる 学生が 「すきな 店」の ぶんしょうを 書いて、クラスの みんなの 前で 読みました。\n\n(1) ケンさんの ぶんしょう\nわたしは すしが すきです。日本には たくさん すし屋が ありますね。わたしの 国には すし屋が ありませんから、今 とても うれしいです。日本に 【22】、いろいろな 店で 食べました。学校の 前の 店は、安くて おいしいです。すしが すきな 人は、いっしょに 【23】。\n\n(2) ミンジさんの ぶんしょう\nわたしは えきの ちかくの 本屋が すきです。えきの ちかくの 本屋【24】 大きい お店です。外国の 本も 売って います。わたしの 国のも 【25】。そして、わたしが すきな りょうりの 本も 多いです。【26】、本は いつも えきの ちかくの 本屋で 買います。みなさんは すきな 本屋が ありますか。',
    passageVi: 'Một học sinh đang học ở Nhật viết bài văn "Quán tôi thích" rồi đọc trước cả lớp.\n\n(1) Bài văn của Ken\nTôi thích sushi. Ở Nhật có rất nhiều tiệm sushi nhỉ. Ở nước tôi không có tiệm sushi nên bây giờ tôi rất vui. Sau khi đến Nhật, tôi đã ăn ở nhiều quán khác nhau. Quán trước trường vừa rẻ vừa ngon. Ai thích sushi thì cùng đi (ăn) nhé?\n\n(2) Bài văn của Minji\nTôi thích hiệu sách gần nhà ga. Hiệu sách gần nhà ga là một cửa hàng lớn. Họ cũng bán sách nước ngoài. Có cả sách của nước tôi nữa. Hơn nữa, sách nấu ăn mà tôi thích cũng nhiều. Vì vậy, sách tôi luôn mua ở hiệu sách gần nhà ga. Các bạn có hiệu sách nào mình thích không?',
    questions: [
      Q('【22】に はいる ものは どれですか。', ['行くから', '行ってから', '来るから', '来てから'], 4,
        'Ken đang ở Nhật nên dùng 来る (đến chỗ người nói), loại 1 và 2. ～てから = "sau khi ～": 日本に 来てから、いろいろな 店で 食べました (sau khi đến Nhật đã ăn ở nhiều quán). 来るから là "vì sẽ đến", sai nghĩa.'),
      Q('【23】に はいる ものは どれですか。', ['行きましたか', '行きませんか', '行って いましたか', '行って いませんか'], 2,
        'Cuối bài Ken mời người thích sushi: すしが すきな 人は、いっしょに 行きませんか (ai thích sushi thì cùng đi nhé?). ～ませんか là mẫu rủ rê, mời mọc. 行きましたか (đã đi chưa) và 行って いましたか (đã đang đi) là hỏi quá khứ; 行って いませんか (chưa đi à) cũng là hỏi trạng thái chứ không phải lời mời.'),
      Q('【24】に はいる ものは どれですか。', ['か', 'と', 'の', 'は'], 4,
        'Câu 「えきの ちかくの 本屋は 大きい お店です」: は nêu chủ đề (hiệu sách gần ga thì là cửa hàng lớn). の làm 本屋の 大きい お店 thành một cụm danh từ nên câu không có vị ngữ, と (và) và か (hoặc) đều không nối chủ đề với vị ngữ, nên cả ba đều khiến câu sai ngữ pháp.'),
      Q('【25】に はいる ものは どれですか。', ['います', '読みます', 'あります', 'します'], 3,
        'Ở trên nói 「外国の 本も 売って います」, nên 「わたしの 国のも あります」 nghĩa là cũng có (sách) của nước tôi. Sách là vật vô tri nên dùng あります, không dùng います (người, động vật). 読みます (đọc) sai mạch vì đang tả hiệu sách, します (làm) không có nghĩa phù hợp.'),
      Q('【26】に はいる ものは どれですか。', ['だから', 'では', 'それから', 'でも'], 1,
        'Câu trước nêu lý do: hiệu sách lớn, có sách nước ngoài, có sách nước tôi, nhiều sách nấu ăn. Kết quả là 「本は いつも…で 買います」, nên dùng だから (vì vậy). では (vậy thì) mở chủ đề mới, それから (rồi thì, sau đó) liệt kê tiếp, でも (nhưng) nối ý tương phản nên không hợp mạch.'),
    ],
  },
];

const dokkaiSections = [
  {
    id: 'd4',
    kind: 'dokkai',
    mondai: '問題4',
    title: 'Đọc hiểu đoạn ngắn',
    instr: 'つぎの (1)から (3)の ぶんしょうを 読んで、しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを 一つ えらんで ください。',
    instrVi: 'Đọc các đoạn văn từ (1) đến (3) rồi trả lời câu hỏi. Chọn một đáp án đúng nhất trong 1, 2, 3, 4.',
    questions: [
      Q('「わたし」は 今日、何を しましたか。', ['友だちと えいがを 見に 行きました。', '友だちと DVDを 買いに 行きました。', '姉と えいがを 見に 行きました。', '姉と DVDを 買いに 行きました。'], 2, 'Căn cứ: 今日、友だちと 買い物に 行きました, vì muốn có DVD của bộ phim đã xem 3 tháng trước, nên là đi mua DVD cùng bạn. Đáp án 1 và 3 sai vì không đi xem phim (phim đã xem từ 3 tháng trước), còn 姉 (chị gái) chỉ là người sẽ xem DVD cùng sau này, không đi mua cùng nên 3 và 4 sai.', {
        passage: 'わたしは 今日、友だちと 買い物に 行きました。3か月前に 見た えいがの DVDが ほしかったからです。買った DVDは、友だちや 姉と いっしょに 見ます。',
        passageVi: 'Hôm nay tôi đi mua sắm với bạn. Vì tôi muốn có đĩa DVD của bộ phim đã xem cách đây 3 tháng. Đĩa DVD đã mua tôi sẽ xem cùng bạn và chị gái.',
      }),
      Q('今の へやは どれですか。', ['Hình 1: bàn 1 cái, ghế 2 cái, một giá sách cao (ít sách) và một tủ sách thấp đầy sách, không có sách rơi dưới sàn', 'Hình 2: bàn 1 cái, ghế 2 cái, hai tủ sách, sách chất thành đống dưới sàn', 'Hình 3: bàn 1 cái, ghế 2 cái, một tủ sách, sách chất thành đống dưới sàn', 'Hình 4: bàn 1 cái, ghế 2 cái, một giá sách cao (ít sách), không có sách dưới sàn'], 3, 'Căn cứ: trong phòng có 1 bàn, 2 ghế và chỉ một giá sách, vì sách quá nhiều nên người viết muốn giá lớn hơn. Chỉ hình 3 có một tủ sách duy nhất và sách chất thành đống dưới sàn. Hình 1 và 2 có hai giá hoặc tủ sách, hình 4 có một giá sách nhưng sách không tràn ra sàn nên không thể hiện việc sách quá nhiều.', {
        passage: 'わたしの へやには、テーブルが 一つと いすが 二つと 本だなが 一つ あります。本が たくさん ありますから、もっと 大きい 本だなが ほしいです。\n[Có 4 hình minh họa căn phòng đánh số 1-4: hình 1 có một giá sách cao và một tủ sách thấp; hình 2 có hai tủ sách và sách chất đống dưới sàn; hình 3 có một tủ sách và sách chất đống dưới sàn; hình 4 có một giá sách cao, không có sách dưới sàn. Các hình đều có 1 bàn và 2 ghế.]',
        passageVi: 'Trong phòng tôi có một cái bàn, hai cái ghế và một giá sách. Vì có rất nhiều sách nên tôi muốn có một giá sách lớn hơn.',
      }),
      Q('森さんは コピーを した あとで、本を どうしますか。', ['クラスで 使います。', '南さんに わたします。', '中川先生に かえします。', '山口先生の 机の 上に おきます。'], 4, 'Căn cứ trong ghi chú của cô Yamaguchi: 本は、わたしが あした かえしますから、わたしの 机の 上に おいて ください (sách ngày mai tôi sẽ trả, nên hãy để lên bàn của tôi). Bản photo mới đưa cho 南さん, còn 中川先生 là người cho mượn sách, người trả là cô Yamaguchi chứ không phải Mori. Sách dùng trong lớp là mục đích chung, không phải việc Mori làm với cuốn sách.', {
        passage: '森さんの 机の 上に、山口先生の メモと 本が あります。\n\n森さん\n\nクラスで 使う 本を 中川先生に かりました。\n5ページを 25枚 コピーして ください。\nコピーは 南さんに わたして ください。\n本は、わたしが あした かえしますから、わたしの 机の 上に おいて ください。\n　　　　　　　　　　　　　　　　山口',
        passageVi: 'Trên bàn của Mori có một tờ ghi chú của cô Yamaguchi và một quyển sách.\n\nGửi Mori\n\nTôi đã mượn của thầy Nakagawa quyển sách dùng trong lớp. Hãy photo trang 5 thành 25 bản. Bản photo hãy đưa cho Minami. Sách thì ngày mai tôi sẽ đi trả, nên hãy để lên bàn của tôi.\nYamaguchi',
      }),
    ],
  },
  {
    id: 'd5',
    kind: 'dokkai',
    mondai: '問題5',
    title: 'Đọc hiểu đoạn vừa',
    instr: 'つぎの ぶんしょうを 読んで、しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを 一つ えらんで ください。',
    instrVi: 'Đọc đoạn văn rồi trả lời câu hỏi. Chọn một đáp án đúng nhất trong 1, 2, 3, 4.',
    questions: [
      Q('どうして 【こまりましたか】。', ['おそい 時間に 駅に 着いたから', 'しごとが たくさん あったから', 'とても つかれたから', 'かさが なかったから'], 4, 'Căn cứ: 外は 雨でしたが、わたしは かさが ありませんでした。とても こまりました (ngoài trời mưa mà tôi không có ô, nên rất bối rối). Làm việc nhiều và mệt thì có trong bài nhưng đó không phải lý do bối rối, còn việc đến ga muộn thì bài không hề nêu làm nguyên nhân.', {
        passage: 'きのうの 夜は おそくまで しごとを しました。とても つかれました。しごとの あと、電車で 帰りました。\n家の 近くの 駅で 電車を おりました。外は 雨でしたが、わたしは かさが ありませんでした。とても 【こまりました】。\n駅の 人が わたしを 見て、「あの はこの 中の かさを 使って ください。」と 言いました。はこの 中には かさが 3本 ありました。\nわたしは 「えっ、いいんですか。」と 聞きました。\n駅の 人は 「あれは 『みんなの かさ』です。お金は いりません。あした、あの はこに かえして ください。」と 言いました。\nわたしは 「わかりました。ありがとうございます。」と 言って、かさを かりて 帰りました。',
        passageVi: 'Tối hôm qua tôi làm việc đến khuya. Tôi rất mệt. Sau giờ làm, tôi về nhà bằng tàu điện.\nTôi xuống tàu ở ga gần nhà. Bên ngoài trời mưa nhưng tôi không có ô. Tôi rất bối rối.\nNhân viên nhà ga nhìn tôi và nói: "Hãy dùng ô trong cái hộp kia." Trong hộp có 3 cái ô.\nTôi hỏi: "Ơ, có được không ạ?"\nNhân viên nhà ga nói: "Đó là \'ô của mọi người\'. Không cần trả tiền. Ngày mai hãy trả lại vào cái hộp đó."\nTôi nói: "Tôi hiểu rồi. Cảm ơn anh." rồi mượn ô và đi về.',
      }),
      Q('「わたし」は、あした どうしますか。', ['かさを はこの 中に 入れます。', 'かさを 駅の 人に わたします。', 'お金を はこの 中に 入れます。', 'お金を 駅の 人に わたします。'], 1, 'Căn cứ: 駅の 人 nói あした、あの はこに かえして ください (ngày mai hãy trả lại vào cái hộp đó), tức là bỏ ô vào hộp. Đáp án 2 sai vì không đưa ô cho nhân viên mà bỏ vào hộp. Đáp án 3 và 4 sai vì đã có câu お金は いりません (không cần tiền), nên không phải trả tiền.', {
        passage: 'きのうの 夜は おそくまで しごとを しました。とても つかれました。しごとの あと、電車で 帰りました。\n家の 近くの 駅で 電車を おりました。外は 雨でしたが、わたしは かさが ありませんでした。とても こまりました。\n駅の 人が わたしを 見て、「あの はこの 中の かさを 使って ください。」と 言いました。はこの 中には かさが 3本 ありました。\nわたしは 「えっ、いいんですか。」と 聞きました。\n駅の 人は 「あれは 『みんなの かさ』です。お金は いりません。あした、あの はこに かえして ください。」と 言いました。\nわたしは 「わかりました。ありがとうございます。」と 言って、かさを かりて 帰りました。',
        passageVi: 'Tối hôm qua tôi làm việc đến khuya. Tôi rất mệt. Sau giờ làm, tôi về nhà bằng tàu điện.\nTôi xuống tàu ở ga gần nhà. Bên ngoài trời mưa nhưng tôi không có ô. Tôi rất bối rối.\nNhân viên nhà ga nhìn tôi và nói: "Hãy dùng ô trong cái hộp kia." Trong hộp có 3 cái ô.\nTôi hỏi: "Ơ, có được không ạ?"\nNhân viên nhà ga nói: "Đó là \'ô của mọi người\'. Không cần trả tiền. Ngày mai hãy trả lại vào cái hộp đó."\nTôi nói: "Tôi hiểu rồi. Cảm ơn anh." rồi mượn ô và đi về.',
      }),
    ],
  },
  {
    id: 'd6',
    kind: 'dokkai',
    mondai: '問題6',
    title: 'Tìm thông tin',
    instr: '右の ページを 見て、下の しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを 一つ えらんで ください。',
    instrVi: 'Xem trang bên phải rồi trả lời câu hỏi bên dưới. Chọn một đáp án đúng nhất trong 1, 2, 3, 4.',
    questions: [
      Q('あらきやで トイレットペーパーと にくと やさいを 同じ 日に 買いたいです。いつが 安いですか。', ['6月11日(月)と 12日(火)', '6月13日(水)と 14日(木)', '6月15日(金)と 16日(土)', '6月17日(日)と 18日(月)'], 2, 'Giấy vệ sinh (トイレットペーパー) rẻ từ 6/11 (thứ Hai) đến 14 (thứ Năm). Thịt (にく) và rau (やさい) rẻ vào thứ Tư và thứ Năm hàng tuần (水・木). Ngày trùng cả ba món là 13 (thứ Tư) và 14 (thứ Năm). Đáp án 1 (thứ Hai, Ba) chỉ có giấy rẻ, còn thịt rau thì không. Đáp án 3 và 4 thì giấy đã hết khuyến mãi.', {
        passage: 'あらきや\n朝 8:00～夜 9:00\n(電話：012-34-5678)\n\n安い！\n6月11日(月)～14日(木)\nさとう 128円　トイレットペーパー 490円\n\n安い！\n6月15日(金)～18日(月)\nしょうゆ 198円　ティッシュペーパー 290円\n\n毎週 安い！\n月・火　くだもの、魚、ジュース\n水・木　とうふ、にく、やさい\n金・土　パン、ぎゅうにゅう、魚、やさい',
        passageVi: 'Arakiya\nMở cửa từ 8:00 sáng đến 9:00 tối\n(Điện thoại: 012-34-5678)\n\nGiá rẻ!\nTừ 11/6 (thứ Hai) đến 14 (thứ Năm)\nĐường 128 yên; Giấy vệ sinh 490 yên\n\nGiá rẻ!\nTừ 15/6 (thứ Sáu) đến 18 (thứ Hai)\nXì dầu 198 yên; Khăn giấy 290 yên\n\nMỗi tuần giá rẻ!\nThứ Hai, thứ Ba: trái cây, cá, nước ép\nThứ Tư, thứ Năm: đậu phụ, thịt, rau\nThứ Sáu, thứ Bảy: bánh mì, sữa bò, cá, rau',
      }),
    ],
  },
];

export default {
  id: 'de-02',
  title: 'Thi thử N5 · Đề số 2',
  desc: 'Đề chép từ file PDF của bạn (có bảng đáp án), có phần nghe 聴解 bằng file âm thanh của đề.',
  parts: [
    {
      key: 'moji',
      name: '文字・語彙',
      vi: 'Chữ và từ vựng',
      minutes: 25,
      intro: 'Đọc kanji, viết kanji (chữ kana → chọn chữ đúng), chọn từ hợp ngữ cảnh, chọn câu cùng nghĩa. 33 câu, 25 phút. Đề in bằng hiragana nên một số câu hiển thị toàn hiragana.',
      sections: mojiSections,
    },
    {
      key: 'bunpou-dokkai',
      name: '文法・読解',
      vi: 'Ngữ pháp và đọc hiểu',
      minutes: 50,
      intro: 'Ngữ pháp (điền từ, sắp xếp câu, điền vào đoạn văn) và đọc hiểu (đoạn ngắn, đoạn vừa, tìm thông tin). 32 câu, 50 phút.',
      sections: [...bunpouSections, ...dokkaiSections],
    },
    {
      key: 'choukai',
      name: '聴解',
      vi: 'Nghe hiểu',
      minutes: 30,
      listening: true,
      intro: 'Nghe file âm thanh của từng もんだい (1 đến 4) rồi chọn đáp án cho các câu 1ばん, 2ばん... theo thứ tự trong file. 24 câu, 30 phút. Bấm ▶ ở thanh nghe phía trên; thanh nghe vẫn chạy khi bạn chuyển câu, nên hãy chọn đáp án của câu đang nghe rồi sang câu kế.',
      sections: choukaiSections,
    },
  ],
};
