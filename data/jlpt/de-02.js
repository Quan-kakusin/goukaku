// Đề thi thử JLPT N5 số 2: đề chép từ file PDF của người học (文字 · 文法 · 読解) kèm bảng đáp án.
// Phần nghe 聴解: 4 file âm thanh (audio/de-02/N5Q1-4.mp3, mỗi file một もんだい) kèm hình đề cắt từ file PDF (audio/de-02/c1-q*.jpg, c3-q*.jpg).
//  - Đáp án phần nghe lấy từ bảng 正答表. Chưa chép lời thoại của file nghe nên phần giải thích chỉ nêu đáp án đúng.
//  - Nội dung chép từ ảnh scan nên có thể sai sót nhỏ; riêng đáp án nhiễu của 問題2 (chữ Hán na ná nhau) ảnh mờ nên có chỗ phải dựng lại.
//  - Câu hỏi dựa vào hình minh họa được mô tả bằng chữ trong dấu [ ].
//  - Phần giải thích và bản dịch tiếng Việt do app soạn.

const Q = (prompt, choices, answer, explain, extra = {}) => ({ prompt, choices, answer, explain, ...extra });

// Câu nghe: prompt là số thứ tự "Nばん"; choices là chữ in trên đề, hoặc chỉ số 1-4 (bare) khi lựa chọn là hình / chỉ nghe
const AUDIO = 'audio/de-02';
const L = (n, choices, answer, extra = {}) =>
  Q(`${n}ばん`, choices, answer, extra.bare ? `Đáp án đúng là ${answer}, theo bảng đáp án của đề. Nghe lại file âm thanh để đối chiếu (chưa có lời thoại chép lại).` : `Đáp án đúng là ${answer}: 「${choices[answer - 1]}」, theo bảng đáp án của đề. Nghe lại file âm thanh để đối chiếu.`, extra);
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

const mojiSections = [
  {
    id: 'm1',
    kind: 'moji',
    mondai: '問題1',
    title: 'Cách đọc kanji',
    instr: '【　】の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
    instrVi: 'Chọn cách đọc bằng hiragana đúng của từ gạch chân.',
    questions: [
      Q('【先週】 デパートに かいものに いきました。', ['せんしゅ', 'せんしゅう', 'ぜんしゅ', 'ぜんしゅう'], 2, '先週 đọc là せんしゅう (tuần trước). 先 đọc là せん (không đục thành ぜん), 週 là しゅう với âm kéo dài nên せんしゅ thiếu う là sai.'),
      Q('ごはんの 【後】で さんぽします。', ['つぎ', 'うしろ', 'まえ', 'あと'], 4, '後 đọc là あと (sau). Nhóm từ dễ nhầm: つぎ là kế tiếp, うしろ là phía sau (vị trí), まえ là trước (前).'),
      Q('もう いちど 【言って】 ください。', ['いって', 'きって', 'まって', 'たって'], 1, '言って đọc là いって (nói), từ 言う. Các đáp án khác là きって (切って), まって (待って), たって (立って).'),
      Q('ちかくに 【山】が あります。', ['かわ', 'やま', 'いけ', 'うみ'], 2, '山 đọc là やま (núi). かわ là sông (川), いけ là ao (池), うみ là biển (海).'),
      Q('この ホテルは へやが 【多い】です。', ['すくない', 'おおい', 'せまい', 'ひろい'], 2, '多い đọc là おおい (nhiều). すくない là ít (少ない), せまい là chật, ひろい là rộng.'),
      Q('ともだちと いっしょに 【学校】に いきます。', ['がこう', 'がこお', 'がっこう', 'がっこお'], 3, '学校 đọc là がっこう (trường học), có âm ngắt っ và kéo dài こう (viết bằng う, không phải お).'),
      Q('えんぴつが 【六本】 あります。', ['ろくぼん', 'ろくぽん', 'ろっぼん', 'ろっぽん'], 4, '六本 đọc là ろっぽん (6 cây, vật dài). Số 6 đổi thành ろっ và 本 biến thành ぽん. 一本 いっぽん, 三本 さんぼん là những biến âm khác.'),
      Q('この 【新聞】は いくらですか。', ['しんむん', 'しんぶん', 'しむん', 'しぶん'], 2, '新聞 đọc là しんぶん (báo). 新 là しん (có ん), 聞 ở đây đọc ぶん.'),
      Q('この カメラは 【安い】です。', ['たかい', 'やすい', 'おもい', 'かるい'], 2, '安い đọc là やすい (rẻ). たかい là đắt hoặc cao (高い), おもい là nặng, かるい là nhẹ.'),
      Q('かさは 【外】に あります。', ['いえ', 'なか', 'そと', 'にわ'], 3, '外 đọc là そと (bên ngoài). いえ là nhà, なか là bên trong (中), にわ là vườn.'),
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
      Q('けさ 【しゃわー】を あびました。', ['シャワー', 'シャウー', 'ツャワー', 'ツャウー'], 1, 'しゃわー viết là シャワー (vòi hoa sen). Dễ nhầm シ với ツ, và ワ với ウ.'),
      Q('コーヒーを 【のみました】。', ['飯みました', '飲みました', '餃みました', '飮みました'], 2, 'のみました viết là 飲みました (đã uống), 飲む. 飯 là めし (cơm), các chữ còn lại là chữ giả na ná.'),
      Q('あたらしい 【くるま】を かいました。', ['卓', '草', '車', '軍'], 3, 'くるま viết là 車 (xe ô tô). Dễ nhầm với 軍 (quân) và các chữ có hình gần giống.'),
      Q('この ぼうしは 【1000えん】です。', ['1000内', '1000用', '1000冊', '1000円'], 4, 'えん viết là 円 (yên). 内 là うち/ない, 用 là よう, 冊 là さつ (đơn vị đếm sách).'),
      Q('しゅくだいが 【はんぶん】 おわりました。', ['羊分', '年分', '丰分', '半分'], 4, 'はんぶん viết là 半分 (một nửa). 半 có hai nét chấm trên, một nét dọc xuyên giữa. 分 là ぶん/ふん.'),
      Q('わたしの うちに 【きませんか】。', ['来ませんか', '采ませんか', '木ませんか', '未ませんか'], 1, 'きませんか viết là 来ませんか (anh/chị có đến không), 来る. 木 là き (cây) nhưng không dùng làm động từ "đến"; 未 và 采 là chữ giả.'),
      Q('きのう たなかさんと 【あいました】。', ['見いました', '書いました', '会いました', '話いました'], 3, 'あいました viết là 会いました (đã gặp), 会う. 見 là xem, 書 là viết, 話 là nói chuyện, đều không đọc là あい.'),
      Q('いもうとと 【おなじ】 ふくを かいました。', ['同じ', '回じ', '司じ', '固じ'], 1, 'おなじ viết là 同じ (giống nhau). 回 là かい/まわる, 固 là かたい, 司 là chữ khác, đều không đọc là おなじ.'),
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
      Q('わたしの へやは この （　　）の 2かいです。', ['エレベーター', 'プール', 'エアコン', 'アパート'], 4, 'Phòng ở tầng 2 của một tòa nhà thì chọn アパート (căn hộ, chung cư nhỏ). エレベーター là thang máy, プール là bể bơi, エアコン là máy điều hòa, không có "tầng 2" của chúng.'),
      Q('さとうさんは ギターを じょうずに （　　）。', ['うたいます', 'ききます', 'ひきます', 'あそびます'], 3, 'Chơi đàn guitar dùng ギターを ひきます (gảy, chơi nhạc cụ dây hoặc piano). うたう là hát, きく là nghe, あそぶ là chơi (vui chơi).'),
      Q('テーブルに おさらと はしを （　　） ください。', ['ならべて', 'とって', 'たべて', 'あらって'], 1, 'Bày đĩa và đũa lên bàn: ならべる (xếp, bày ra). とる là lấy, たべる là ăn, あらう là rửa.'),
      Q('けさ そうじを したから へやは （　　）です。', ['きれい', 'きたない', 'あかるい', 'くらい'], 1, 'Vì sáng nay đã dọn dẹp nên phòng きれい (sạch sẽ). きたない là bẩn, あかるい là sáng, くらい là tối.'),
      Q('きょうは 500（　　） およぎました。', ['ど', 'ばん', 'メートル', 'グラム'], 3, 'Khoảng cách bơi dùng メートル (mét). ど là độ (nhiệt độ, lần), ばん là số thứ tự hoặc đêm, グラム là gam (khối lượng).'),
      Q('えきから たいしかんまでの （　　）を かいて ください。', ['しゃしん', 'ちず', 'てがみ', 'きっぷ'], 2, 'Vẽ đường từ ga đến đại sứ quán thì là ちず (bản đồ). しゃしん là ảnh, てがみ là thư, きっぷ là vé.'),
      Q('うるさいから テレビを （　　） ください。', ['けして', 'つけて', 'しめて', 'あけて'], 1, 'Ồn nên hãy tắt tivi: けす (tắt). つける là bật, しめる là đóng, あける là mở.'),
      Q('きょうは （　　）が ふって います。', ['くもり', 'はれ', 'かぜ', 'ゆき'], 4, 'Động từ ふる (rơi) đi với ゆき (tuyết) hoặc あめ (mưa). くもり (trời nhiều mây), はれ (trời nắng) không đi với ふる, かぜ đi với ふく (thổi).'),
      Q('[Hình: một hộp đựng 5 quả táo] はこに りんごが （　　） あります。', ['よっつ', 'いつつ', 'むっつ', 'ななつ'], 2, 'Trong hình có 5 quả táo nên chọn いつつ (5 cái). よっつ là 4, むっつ là 6, ななつ là 7.'),
      Q('[Hình: cái bàn, kính đặt trên mặt bàn, túi xách để dưới bàn, ô nằm dưới sàn bên cạnh ghế] めがねは つくえの （　　）に あります。', ['そば', 'よこ', 'した', 'うえ'], 4, 'Trong hình kính đặt trên mặt bàn nên chọn うえ (trên). そば là bên cạnh, よこ là bên hông, した là dưới (túi xách nằm ở dưới bàn).'),
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
      Q('【まいばん くにの かぞくに でんわします。】', ['よるは ときどき くにの かぞくに でんわします。', 'あさは ときどき くにの かぞくに でんわします。', 'よるは いつも くにの かぞくに でんわします。', 'あさは いつも くにの かぞくに でんわします。'], 3, 'まいばん là mỗi tối, tương đương よるは いつも (buổi tối lúc nào cũng). ときどき là thỉnh thoảng nên sai; あさ là buổi sáng nên sai.'),
      Q('【この まちには ゆうめいな たてものが あります。】', ['この まちには ゆうめいな ビルが あります。', 'この まちには ゆうめいな おちゃが あります。', 'この まちには ゆうめいな ケーキが あります。', 'この まちには ゆうめいな こうえんが あります。'], 1, 'たてもの là tòa nhà, công trình, gần nghĩa với ビル (tòa nhà cao tầng). おちゃ là trà, ケーキ là bánh, こうえん là công viên, đều không phải công trình xây dựng.'),
      Q('【その えいがは おもしろくなかったです。】', ['その えいがは たのしかったです。', 'その えいがは つまらなかったです。', 'その えいがは みじかかったです。', 'その えいがは ながかったです。'], 2, 'おもしろくなかった (không thú vị) gần nghĩa với つまらなかった (chán). たのしかった là vui, みじかかった là ngắn, ながかった là dài.'),
      Q('【たんじょうびは 6がつ15にちです。】', ['6がつ15にちに けっこんしました。', '6がつ15にちに テストが はじまりました。', '6がつ15にちに うまれました。', '6がつ15にちに くにへ かえりました。'], 3, 'たんじょうび là ngày sinh nhật nên tương đương 6がつ15にちに うまれました (sinh vào ngày 15/6). けっこん là kết hôn, はじまる là bắt đầu, かえる là về nước.'),
      Q('【にねんまえに きょうとへ いきました。】', ['きのう きょうとへ いきました。', 'おととい きょうとへ いきました。', 'きょねん きょうとへ いきました。', 'おととし きょうとへ いきました。'], 4, 'にねんまえ là hai năm trước, tức おととし. きのう là hôm qua, おととい là hôm kia, きょねん là năm ngoái.'),
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
        'Danh từ + の + danh từ: 日本の ラーメン (mì ramen của Nhật Bản), の nối hai danh từ để bổ nghĩa. に, を, へ không nối được hai danh từ như vậy.'),
      Q('わたしには きょうだいが 二人 います。弟（　　）妹です。', ['は', 'も', 'と', 'か'], 3,
        '弟と妹 nghĩa là "em trai và em gái". と dùng để liệt kê đầy đủ các đối tượng (hai anh chị em). か là "hoặc", は và も không hợp nghĩa ở đây.'),
      Q('山下「田中さん（　　）きのう どこかに 出かけましたか。」田中「いいえ、いえに いました。」', ['で', 'は', 'を', 'に'], 2,
        'Dùng は để nêu chủ đề câu hỏi: 田中さんは ～ か (còn anh Tanaka thì hôm qua có đi đâu không?). で, を, に không đứng sau tên người trong vị trí chủ đề này.'),
      Q('（タクシーで）A「つぎの かどを 右（　　）まがって ください。」B「わかりました。」', ['が', 'や', 'か', 'に'], 4,
        '右に まがる: に chỉ hướng đi. Rẽ phải ở góc tiếp theo. が, や, か không dùng chỉ hướng.'),
      Q('きのう、わたしは ひとり（　　）えいがを 見に 行きました。', ['が', 'を', 'で', 'は'], 3,
        'ひとりで = một mình. Trợ từ で chỉ cách thức/số người cùng làm: ひとりで, ふたりで...'),
      Q('山下「今日 パーティーが ありますから、田中さん（　　）来て ください。」田中「ありがとうございます。」', ['に', 'も', 'や', 'で'], 2,
        '田中さんも 来て ください: も = "cũng" (mời anh Tanaka cũng đến, ngoài những người khác). に, や, で không hợp nghĩa câu mời này.'),
      Q('田中「この ぼうしは 山田さん（　　）ですか。」山田「はい。」', ['や', 'は', 'の', 'か'], 3,
        '山田さんの です = "là của anh Yamada" (の thay cho danh từ sở hữu, ở đây là cái mũ). Câu đã có ですか nên không cần thêm か.'),
      Q('駅まで タクシーで 1000円（　　）です。', ['ぐらい', 'など', 'ごろ', 'も'], 1,
        'ぐらい đứng sau số lượng/tiền = "khoảng": 1000円ぐらい (khoảng 1000 yên). ごろ chỉ dùng với thời điểm (3時ごろ), など là "vân vân", も là "tới cả".'),
      Q('A「さようなら。」B「さようなら。また（　　）。」', ['おととい', '今日', '来週', '今月'], 3,
        'Lời chào tạm biệt hẹn gặp lại: また 来週 (hẹn tuần sau gặp lại). おとといは là quá khứ, 今日 và 今月 không tự nhiên khi đang chia tay.'),
      Q('わたしの 母は 50さいです。父は 55さいです。母は 父（　　）5さい わかいです。', ['から', 'まで', 'より', 'のほうが'], 3,
        'So sánh hơn kém: A は B より ～ (A ～ hơn B). 母は 父より 5さい わかい = mẹ trẻ hơn bố 5 tuổi. のほうが dùng ở dạng "AのほうがBより".'),
      Q('子ども「いただきます。」母「あ、食べる（　　）手を あらいましょう。」', ['まえに', 'のまえに', 'あとに', 'のあとに'], 1,
        'Động từ thể từ điển + まえに = "trước khi ～": 食べる まえに (trước khi ăn). Với động từ không dùng の (のまえに chỉ đi với danh từ). Rửa tay trước khi ăn nên không dùng あと.'),
      Q('A「東京でも 雪が ふりますか。」B「ええ、ふりますよ。でも、きょねんは あまり（　　）。」', ['ふりませんでした', 'ふりません', 'ふりました', 'ふります'], 1,
        'きょねん (năm ngoái) là quá khứ, あまり đi với phủ định: ふりませんでした (năm ngoái không mưa tuyết mấy). ふりません là phủ định hiện tại.'),
      Q('（川で）A「見て ください。小さな 魚が たくさん（　　）よ。」B「ほんとうですね。30ぴきぐらい いますね。」', ['およぎます', 'およぎません', 'およぎました', 'およいで います'], 4,
        'Đang nhìn thấy cá bơi ngay lúc nói nên dùng ～て います (đang bơi): およいで います. Các dạng còn lại không diễn tả hành động đang diễn ra.'),
      Q('中川「山田さんの その カメラは いいですね。どこで かいましたか。」山田「いえ、これは 兄に（　　）。」', ['あげました', 'もらいました', 'うりました', 'かいました'], 2,
        '"Cái này tôi nhận từ anh trai": 兄に もらいました (に chỉ nguồn nhận). あげる là cho, うる là bán, かう là mua (anh đã phủ định "mua" bằng いえ).'),
      Q('たまごりょうりの じょうずな 作りかたを（　　）読みました。', ['何に', '何も', '何かへ', '何かで'], 4,
        '何かで 読みました = "đã đọc ở đâu đó (trên một thứ gì đó, như sách báo, mạng)". 何か + で chỉ phương tiện/nơi chưa xác định. 何に, 何も, 何かへ không hợp nghĩa.'),
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
        'Câu đúng: くだものは どこに ありますか (3 1 4 2). Ô ★ là に. Nghĩa: "Xin lỗi, trái cây ở đâu vậy ạ?"'),
      Q('A「山下さんは？」B「となりの へやで ＿ ＿ ★ ＿ して います。」', ['れんしゅう', 'の', 'ギター', 'を'], 1,
        'Câu đúng: ギターの れんしゅうを して います (3 2 1 4). Ô ★ là れんしゅう. Nghĩa: "Anh ấy đang tập đàn ghi-ta ở phòng bên cạnh."'),
      Q('A「会社 ＿ ＿ ★ ＿ 行って いますか。」B「わたしは あるいて 行って います。」', ['で', 'は', 'へ', '何'], 4,
        'Câu đúng: 会社へは 何で 行って いますか (3 2 4 1). Ô ★ là 何. Nghĩa: "Bạn đi đến công ty bằng gì?" (へは nhấn mạnh chủ đề, 何で hỏi phương tiện).'),
      Q('山田「ジョンさん、しゅくだいは ぜんぶ おわりましたか。」ジョン「いいえ、まだです。ここ ＿ ＿ ★ ＿、さいごの もんだいが むずかしいです。」', ['は', 'かんたんでした', 'が', 'まで'], 2,
        'Câu đúng: ここまでは かんたんでしたが、さいごの もんだいが むずかしいです (4 1 2 3). Ô ★ là かんたんでした. Nghĩa: "Đến đây thì dễ, nhưng bài cuối thì khó."'),
      Q('（本屋で）ヤン「わたしは この 本を 買います。アンナさんは どんな 本が いいですか。」アンナ「わたしは もう 少し ＿ ＿ ★ ＿ が いいです。」', ['本', 'かんたんな', 'が', '日本語'], 2,
        'Câu đúng: もう 少し 日本語が かんたんな 本が いいです (4 3 2 1). Ô ★ là かんたんな. Nghĩa: "Tôi muốn cuốn sách có tiếng Nhật dễ hơn một chút."'),
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
        'Cuối bài mời người thích sushi: いっしょに 行きませんか (cùng đi nhé?). ～ませんか là mẫu rủ rê. Các dạng quá khứ/đang làm không hợp.'),
      Q('【24】に はいる ものは どれですか。', ['か', 'と', 'の', 'は'], 4,
        '本屋は 大きい お店です: は nêu chủ đề "hiệu sách gần nhà ga thì là cửa hàng lớn". か, と, の làm câu sai ngữ pháp.'),
      Q('【25】に はいる ものは どれですか。', ['います', '読みます', 'あります', 'します'], 3,
        '国の（本）も あります = cũng có sách của nước tôi (văn bản trước nói "bán sách nước ngoài"). Sách là vật vô tri nên dùng あります, không dùng います.'),
      Q('【26】に はいる ものは どれですか。', ['だから', 'では', 'それから', 'でも'], 1,
        'Lý do ở câu trước (sách nhiều, có sách nước tôi, sách nấu ăn) dẫn đến kết quả "nên luôn mua ở đó": だから (vì vậy). では, それから (rồi thì), でも (nhưng) không hợp mạch văn.'),
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
      Q('「わたし」は 今日、何を しましたか。', ['友だちと えいがを 見に 行きました。', '友だちと DVDを 買いに 行きました。', '姉と えいがを 見に 行きました。', '姉と DVDを 買いに 行きました。'], 2, 'Đoạn văn: 今日、友だちと 買い物に 行きました。DVDが ほしかったからです (đi mua sắm với bạn vì muốn có DVD). Chị gái chỉ là người xem DVD cùng sau đó.', {
        passage: 'わたしは 今日、友だちと 買い物に 行きました。3か月前に 見た えいがの DVDが ほしかったからです。買った DVDは、友だちや 姉と いっしょに 見ます。',
        passageVi: 'Hôm nay tôi đi mua sắm với bạn. Vì tôi muốn có đĩa DVD của bộ phim đã xem cách đây 3 tháng. Đĩa DVD đã mua tôi sẽ xem cùng bạn và chị gái.',
      }),
      Q('今の へやは どれですか。', ['Hình 1: bàn 1 cái, ghế 2 cái, một giá sách cao (ít sách) và một tủ sách thấp đầy sách, không có sách rơi dưới sàn', 'Hình 2: bàn 1 cái, ghế 2 cái, hai tủ sách, sách chất thành đống dưới sàn', 'Hình 3: bàn 1 cái, ghế 2 cái, một tủ sách, sách chất thành đống dưới sàn', 'Hình 4: bàn 1 cái, ghế 2 cái, một giá sách cao (ít sách), không có sách dưới sàn'], 3, 'Phòng có bàn 1, ghế 2 và chỉ 1 giá sách, nhưng sách nhiều (quá nhiều nên người viết muốn giá lớn hơn). Chỉ hình 3 có đúng 1 giá sách mà sách chất đống ra sàn.', {
        passage: 'わたしの へやには、テーブルが 一つと いすが 二つと 本だなが 一つ あります。本が たくさん ありますから、もっと 大きい 本だなが ほしいです。\n[Có 4 hình minh họa căn phòng đánh số 1-4: hình 1 có một giá sách cao và một tủ sách thấp; hình 2 có hai tủ sách và sách chất đống dưới sàn; hình 3 có một tủ sách và sách chất đống dưới sàn; hình 4 có một giá sách cao, không có sách dưới sàn. Các hình đều có 1 bàn và 2 ghế.]',
        passageVi: 'Trong phòng tôi có một cái bàn, hai cái ghế và một giá sách. Vì có rất nhiều sách nên tôi muốn có một giá sách lớn hơn.',
      }),
      Q('森さんは コピーを した あとで、本を どうしますか。', ['クラスで 使います。', '南さんに わたします。', '中川先生に かえします。', '山口先生の 机の 上に おきます。'], 4, 'Trong ghi chú: 本は、わたしが あした かえしますから、わたしの 机の 上に おいて ください (sách tôi sẽ trả vào ngày mai nên hãy để trên bàn của tôi). Người viết là cô Yamaguchi. Bản photo mới đưa cho Minami.', {
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
      Q('どうして 【こまりましたか】。', ['おそい 時間に 駅に 着いたから', 'しごとが たくさん あったから', 'とても つかれたから', 'かさが なかったから'], 4, 'Câu liền trước: 外は 雨でしたが、わたしは かさが ありませんでした。とても こまりました (ngoài trời mưa mà không có ô nên rất bối rối).', {
        passage: 'きのうの 夜は おそくまで しごとを しました。とても つかれました。しごとの あと、電車で 帰りました。\n家の 近くの 駅で 電車を おりました。外は 雨でしたが、わたしは かさが ありませんでした。とても 【こまりました】。\n駅の 人が わたしを 見て、「あの はこの 中の かさを 使って ください。」と 言いました。はこの 中には かさが 3本 ありました。\nわたしは 「えっ、いいんですか。」と 聞きました。\n駅の 人は 「あれは 『みんなの かさ』です。お金は いりません。あした、あの はこに かえして ください。」と 言いました。\nわたしは 「わかりました。ありがとうございます。」と 言って、かさを かりて 帰りました。',
        passageVi: 'Tối hôm qua tôi làm việc đến khuya. Tôi rất mệt. Sau giờ làm, tôi về nhà bằng tàu điện.\nTôi xuống tàu ở ga gần nhà. Bên ngoài trời mưa nhưng tôi không có ô. Tôi rất bối rối.\nNhân viên nhà ga nhìn tôi và nói: "Hãy dùng ô trong cái hộp kia." Trong hộp có 3 cái ô.\nTôi hỏi: "Ơ, có được không ạ?"\nNhân viên nhà ga nói: "Đó là \'ô của mọi người\'. Không cần trả tiền. Ngày mai hãy trả lại vào cái hộp đó."\nTôi nói: "Tôi hiểu rồi. Cảm ơn anh." rồi mượn ô và đi về.',
      }),
      Q('「わたし」は、あした どうしますか。', ['かさを はこの 中に 入れます。', 'かさを 駅の 人に わたします。', 'お金を はこの 中に 入れます。', 'お金を 駅の 人に わたします。'], 1, 'Nhân viên nói お金は いりません (không cần tiền) và あした、あの はこに かえして ください (ngày mai hãy trả vào cái hộp đó), tức là bỏ ô vào hộp.', {
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
      Q('あらきやで トイレットペーパーと にくと やさいを 同じ 日に 買いたいです。いつが 安いですか。', ['6月11日(月)と 12日(火)', '6月13日(水)と 14日(木)', '6月15日(金)と 16日(土)', '6月17日(日)と 18日(月)'], 2, 'Giấy vệ sinh rẻ từ 6/11 (Hai) đến 14 (Năm). Thịt và rau rẻ vào thứ Tư và thứ Năm (水・木). Ngày trùng cả hai là 6/13 (thứ Tư) và 14 (thứ Năm).', {
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
