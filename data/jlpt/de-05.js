// Đề thi thử JLPT N5 số 5, do app soạn (nội dung ORIGINAL, không phải đề thật của JLPT). Đủ 3 phần thi: 文字・語彙, 文法・読解, 聴解.
// Chủ đề: cuối tuần, sở thích và thể thao, sự kiện và lễ hội, nhà ở và đồ vật trong phòng.
//
// Quy ước:
//  - Chữ Hán chỉ dùng trong 80 chữ của mục Kanji (data/kanji-n5.js), từ khác viết bằng kana, giống đề N5 thật.
//    Riêng đáp án nhiễu của 問題2 (chọn chữ Hán đúng) được dùng chữ na ná ngoài danh sách.
//  - 【...】 trong câu hỏi là phần gạch chân. （　　）là chỗ trống. ★ là ô cần xác định ở dạng sắp xếp câu.
//  - answer là số thứ tự (1-4) của đáp án đúng, như phiếu trả lời thật.
//  - Phần nghe 聴解 không có file âm thanh: mỗi câu có audio là kịch bản [người nói, câu] viết hoàn toàn bằng kana,
//    app đọc bằng giọng máy. Câu hỏi 問題3, 問題4 chỉ hiện số (bare), nên explain ghi lại đủ lời thoại và ba lựa chọn.

const Q = (prompt, choices, answer, explain, extra = {}) => ({ prompt, choices, answer, explain, ...extra });

export default {
  id: 'de-05',
  title: 'Thi thử N5 · Đề số 5',
  desc: 'Đề do app soạn, chủ đề cuối tuần, sở thích, lễ hội và nhà ở. Phần nghe 聴解 là kịch bản đọc bằng giọng máy.',
  parts: [
    {
      key: 'moji',
      name: '文字・語彙',
      vi: 'Chữ và từ vựng',
      minutes: 25,
      intro: 'Gồm 4 dạng: đọc kanji, viết kanji, chọn từ hợp ngữ cảnh, chọn câu cùng nghĩa. 35 câu, 25 phút.',
      sections: [
        {
          id: 'm1',
          kind: 'moji',
          mondai: '問題1',
          title: 'Cách đọc kanji',
          instr: '【　】の ことばは ひらがなで どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Chọn cách đọc bằng hiragana đúng của từ gạch chân.',
          questions: [
            Q('あの 学校は 【今週】の 土よう日に おまつりを します。', ['きんしゅう', 'こんしゅう', 'こんしゅ', 'こんじゅう'], 2, '今週 đọc là こんしゅう (tuần này), 今 đọc こん và 週 đọc しゅう (có trường âm). きんしゅう sai vì きん là âm của 金 chứ không phải 今. こんしゅ thiếu trường âm ゆう nên không đủ âm. こんじゅう sai vì 週 không bị biến đục. Nhớ thêm: 今月 là こんげつ (tháng này), 来週 là らいしゅう.'),
            Q('【八月】に おおきな おまつりが あります。', ['はつがつ', 'はちげつ', 'はっがつ', 'はちがつ'], 4, '八月 đọc là はちがつ (tháng tám): 八 đọc はち, tên tháng dùng 月 đọc がつ. はつがつ và はっがつ sai vì 八 trong 八月 không bị ngắt âm hay đổi thành はつ/はっ. はちげつ sai vì げつ chỉ dùng cho 先月 (tháng trước), 今月 (tháng này), 来月 (tháng sau), còn khi nói tháng thứ mấy thì luôn là がつ.'),
            Q('ラケットを 【右手】で もちます。', ['みぎて', 'みぎしゅ', 'うて', 'みぎで'], 1, '右手 đọc là みぎて (tay phải): 右 đọc みぎ, 手 đọc て (cả hai đều là âm Kun, đọc theo kiểu thuần Nhật). みぎしゅ sai vì しゅ là âm On của 手, chỉ gặp trong từ Hán như 歌手 (かしゅ, ca sĩ). うて không phải cách đọc của từ này. みぎで sai vì 手 không bị biến đục. Từ liên quan: 左手 là ひだりて (tay trái).'),
            Q('きょうの サッカーは 【十人】で しました。', ['じゅうひと', 'じっにん', 'じゅうにん', 'じゅにん'], 3, '十人 đọc là じゅうにん (10 người). Đếm người: 1 người ひとり, 2 người ふたり, từ 3 người trở đi dùng にん (さんにん, よにん...). じゅうひと sai vì ひと chỉ nằm trong ひとり. じっにん sai vì 十 chỉ ngắt âm thành じっ trước hàng か, さ, た, ぱ (じっぷん). じゅにん sai vì thiếu trường âm: phải là じゅう.'),
            Q('【南口】で 会いましょう。', ['なんぐち', 'みなみぐち', 'みなみくち', 'みなみこう'], 2, '南口 đọc là みなみぐち (cửa nam): 南 đọc みなみ, 口 đọc くち nhưng khi đứng sau một từ khác thì biến đục thành ぐち, giống 出口 (でぐち, lối ra). なんぐち sai vì dùng âm On なん của 南 trong khi cả từ này đọc theo Kun. みなみくち sai vì quên biến đục. みなみこう sai vì こう là âm On của 口 (như 人口 じんこう, dân số).'),
            Q('【先月】、ミラーさんと おまつりに 行きました。', ['せんげつ', 'さきつき', 'せんがつ', 'せんつき'], 1, '先月 đọc là せんげつ (tháng trước): 先 đọc せん, 月 đọc げつ. Khi nói tháng thứ mấy (八月, 九月...) mới dùng がつ, còn 先月, 今月 (こんげつ), 来月 (らいげつ) thì dùng げつ. せんがつ sai vì dùng nhầm がつ. さきつき và せんつき là cách đọc không tồn tại cho từ này.'),
            Q('日よう日は 【休み】ですから、うちで テレビを 見ます。', ['きゅうみ', 'やずみ', 'やすみ', 'ゆすみ'], 3, '休み đọc là やすみ (ngày nghỉ, kỳ nghỉ). Câu: Chủ nhật là ngày nghỉ nên tôi ở nhà xem ti vi. Chữ 休 đọc theo Kun là やす (động từ 休む là やすむ, nghỉ ngơi). きゅうみ sai vì きゅう là âm On của 休 (như 休日 きゅうじつ) và không ghép với み. やずみ sai vì không biến đục, ゆすみ là từ không có.'),
            Q('【小さい】 かばんを 買いました。', ['しょうさい', 'ちさい', 'こさい', 'ちいさい'], 4, '小さい đọc là ちいさい (nhỏ). Câu: Tôi đã mua một cái túi nhỏ. Cách đọc đúng có hai chữ い liền nhau: ちいさい. ちさい sai vì thiếu một âm い (hay mắc lỗi này khi viết). しょうさい sai vì しょう là âm On của 小 (như 小学校 しょうがっこう), mà 小さい là từ Kun. こさい sai vì こ chỉ dùng trong vài từ như 小鳥 (ことり).'),
            Q('リンさんは テニスが 【上手】です。', ['うわて', 'じょうず', 'じょうしゅ', 'かみて'], 2, '上手 đọc là じょうず (giỏi, khéo). Câu: Anh Lin chơi quần vợt giỏi. Đây là từ đọc đặc biệt, không thể tách thành 上 + 手 để đọc thường. Trái nghĩa là 下手 (へた, kém). うわて (thế trên, hơn hẳn) và かみて (phía trên) là cách đọc khác của chữ 上手 nhưng nghĩa khác, không hợp câu này. じょうしゅ sai vì không có cách đọc đó.'),
            Q('【四人】で プールに 行きました。', ['よにん', 'しにん', 'よんにん', 'よつにん'], 1, '四人 đọc là よにん (4 người). Số 4 trong đếm người đọc よ (không đọc し hay よん): よにん. しにん không dùng cho đếm người. よんにん sai vì 4 người luôn là よにん. よつにん sai vì よつ chỉ dùng trong cách đếm vật thông thường (よっつ, 4 cái). Nhớ: 1 người ひとり, 2 người ふたり, 3 người さんにん, 4 người よにん.'),
            Q('【来年】、日本へ 行きたいです。', ['くるとし', 'こねん', 'らいねん', 'きねん'], 3, '来年 đọc là らいねん (năm sau). Câu: Năm sau tôi muốn đến Nhật. 来 đọc らい khi ghép với từ chỉ thời gian: 来週 らいしゅう, 来月 らいげつ, 来年 らいねん. くるとし và こねん chỉ là ghép bừa từ cách đọc của 来る (くる, こ), còn きねん nghe giống 記念 (kỷ niệm), cả ba đều không phải cách đọc của 来年.'),
            Q('あした 【何時】に うちを 出ますか。', ['なにじ', 'なんとき', 'なにとき', 'なんじ'], 4, "何時 đọc là なんじ (mấy giờ). Câu: Ngày mai bạn rời nhà lúc mấy giờ? 何 đọc là なん khi đứng trước hàng đếm như じ (giờ), にん (người), がつ (tháng): なんじ, なんにん, なんがつ. なにじ sai vì なに dùng khi đứng riêng (なにを...). なんとき và なにとき sai vì khi hỏi giờ thì 時 đọc じ, còn とき là 'lúc'."),
          ],
        },
        {
          id: 'm2',
          kind: 'moji',
          mondai: '問題2',
          title: 'Viết kanji',
          looseChoices: true,
          instr: '【　】の ことばは どう かきますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Chọn cách viết đúng (kanji) của từ gạch chân. Đáp án nhiễu là chữ na ná nhau.',
          questions: [
            Q('母に 【でんわ】を かけます。', ['雪話', '電詁', '電話', '電語'], 3, "でんわ viết là 電話 (điện thoại): 電 có bộ 雨 ở trên, 話 có bộ 言 bên trái và 舌 bên phải (nói bằng lưỡi). 雪話 sai vì 雪 là ゆき (tuyết), na ná 電 nhưng không phải. 電詁 sai vì 詁 là chữ hiếm có 古 bên phải. 電語 sai vì 語 đọc ご (日本語 にほんご, tiếng Nhật), không phải 'điện thoại'."),
            Q('駅の 【でぐち】は あちらです。', ['出口', '山口', '出日', '凹口'], 1, 'でぐち viết là 出口 (lối ra): 出 (でる, ra) + 口 (くち, cửa miệng, lối). 出 trông giống hai chữ 山 chồng lên nhau. 山口 là やまぐち (tên người/địa danh Yamaguchi): chỉ có 山 là やま (núi). 出日 sai vì 日 là ひ/にち (mặt trời, ngày). 凹口 sai vì 凹 là chữ lõm, không dùng trong từ này.'),
            Q('【らいしゅう】、おまつりに 行きます。', ['未週', '来周', '求週', '来週'], 4, "らいしゅう viết là 来週 (tuần sau). 週 có bộ 辶 bao quanh, bên trong là 周. 未週 sai vì 未 (み) có nghĩa 'chưa' (未来 みらい là tương lai), không phải 来. 来周 sai vì 周 (しゅう) nghĩa là 'xung quanh', thiếu bộ 辶 nên không phải 週 (tuần). 求週 sai vì 求 là きゅう/もとめる (yêu cầu)."),
            Q('【あたらしい】 スポーツシューズを 買いました。', ['親しい', '新しい', '断しい', '薪しい'], 2, "あたらしい viết là 新しい (mới): 新 gồm 立 + 木 + 斤 (cái rìu), okurigana là しい. 親しい đọc là したしい (thân thiết), chỉ khác bộ bên trái là 親. 断しい sai vì 断 là だん/ことわる (từ chối, 断る). 薪しい sai vì 薪 là chữ có nghĩa 'củi' (まき), không dùng cho 'mới'."),
            Q('あの 【みせ】で 本を 買いました。', ['庁', '店', '府', '庫'], 2, 'みせ viết là 店 (cửa hàng, tiệm). Câu: Tôi đã mua sách ở cửa hàng kia. 店 có bộ 广 (mái nhà) bên ngoài. Ba chữ còn lại cũng có bộ 广 nên nhìn dễ nhầm: 庁 là ちょう (cơ quan, 県庁 ủy ban tỉnh), 府 là ふ (phủ, 京都府), 庫 là こ (kho, 冷蔵庫 れいぞうこ tủ lạnh). Không chữ nào đọc là みせ.'),
            Q('ここに 【なまえ】を 書いて ください。', ['各前', '名箭', '名前', '名削'], 3, 'なまえ viết là 名前 (tên). Câu: Hãy viết tên vào đây. 名 gồm 夕 (buổi tối) + 口 (miệng): tối trời gọi tên nhau vì không nhìn rõ. 前 là まえ (phía trước). 各前 sai vì 各 là かく (mỗi), 名箭 sai vì 箭 là chữ hiếm (mũi tên), 名削 sai vì 削 là さく/けずる (gọt, bào).'),
            Q('ベトナムは わたしの 【くに】です。', ['国', '圏', '困', '固'], 1, 'くに viết là 国 (đất nước, quê hương). Câu: Việt Nam là đất nước của tôi. 国 gồm khung 囗 bao quanh chữ 玉 (ngọc) bên trong. Chữ nhiễu: 圏 là けん (khu vực), 困 là こま-る (khó khăn, bên trong là 木), 固 là かた-い (cứng, bên trong là 古). Cùng khung 囗 nhưng chỉ 国 mới đọc là くに.'),
            Q('【ちち】は 土よう日に ゴルフを します。', ['交', '文', '欠', '父'], 4, 'ちち viết là 父 (bố của mình, nói với người ngoài). Câu: Bố tôi chơi golf vào thứ Bảy. Các chữ nhiễu có hình hơi giống: 交 đọc こう (giao, trao đổi), 文 đọc ぶん (câu văn), 欠 đọc けつ (thiếu, 欠席 けっせき vắng mặt). Cặp đối: 父 ちち (bố) và 母 はは (mẹ).'),
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
            Q('日よう日は あめでしたから、うちで DVDを （　　）。', ['聞きました', '書きました', '見ました', '飲みました'], 3, '日よう日は あめでしたから、うちで DVDを 見ました: Chủ nhật trời mưa nên tôi ở nhà xem DVD. DVD đi với động từ 見る (xem). 聞きました (ききました) là nghe (nhạc, tin tức), 書きました (かきました) là viết, 飲みました (のみました) là uống, cả ba đều không đi với DVD.'),
            Q('ともだちと テニスを （　　）。', ['します', 'ひきます', 'のります', 'かきます'], 1, 'ともだちと テニスを します: tôi chơi quần vợt với bạn. Thể thao và trò chơi đi với します (サッカーを します, ゲームを します). ひきます dùng cho nhạc cụ (ギターを ひきます, chơi đàn guitar), のります là đi/lên xe (でんしゃに のります), かきます là viết hoặc vẽ, đều không đi với テニス.'),
            Q('A「あした、たんじょうびパーティーに 行きますか。」B「はい。プレゼントを （　　）行きます。」', ['もらって', 'あげて', 'くれて', 'もって'], 4, 'A hỏi: ngày mai bạn đi tiệc sinh nhật chứ? B: Vâng, tôi mang quà đi. V て 行きます là làm V rồi đi, nên プレゼントを もって 行きます nghĩa là mang quà đến dự tiệc. もらって (nhận), あげて (tặng), くれて (cho mình) nói về việc cho nhận, không hợp với ý mang quà đến buổi tiệc.'),
            Q('この へやは あついですから、まどを （　　）。', ['しめます', 'あけます', 'つけます', 'けします'], 2, 'この へやは あついですから、まどを あけます: phòng này nóng nên tôi mở cửa sổ. あける là mở, hợp với việc muốn mát hơn. しめます (đóng) làm phòng nóng thêm, つけます là bật (điện, máy lạnh) và けします là tắt (điện), đều không dùng với まど (cửa sổ).'),
            Q('まいあさ 六時に （　　）、あさごはんを 食べます。', ['ねて', 'やすんで', 'おきて', 'おくれて'], 3, 'まいあさ 六時に おきて、あさごはんを 食べます: mỗi sáng tôi dậy lúc 6 giờ rồi ăn sáng. おきる (起きる) là thức dậy, て-form nối hai hành động liên tiếp. ねて là ngủ (không hợp vì ngủ rồi mới ăn sáng thì vô lý), やすんで là nghỉ, おくれて là trễ (không hợp thói quen mỗi sáng).'),
            Q('かいものの あとで、きっさてんで コーヒーを （　　）。', ['飲みました', '食べました', '読みました', '聞きました'], 1, 'かいものの あとで、きっさてんで コーヒーを 飲みました: sau khi mua sắm, tôi uống cà phê ở quán cà phê. Đồ uống dùng động từ 飲む (のむ). 食べました (たべました) là ăn, 読みました (よみました) là đọc, 聞きました (ききました) là nghe, không đi với コーヒー.'),
            Q('あしたは おまつりが （　　）。人が たくさん 来ます。', ['なります', 'います', 'します', 'あります'], 4, 'あしたは おまつりが あります。人が たくさん 来ます: ngày mai có lễ hội, sẽ có nhiều người đến. Sự kiện (lễ hội, tiệc, buổi họp) diễn ra thì dùng あります (có, diễn ra). います chỉ người và động vật. なります là trở thành (cần に: ～に なります). します là làm, đi với を (おまつりを します), không đi với が.'),
            Q('やすみの 日に、ジョギングを して、（　　）を あびます。', ['バス', 'シャワー', 'プール', 'ベッド'], 2, 'やすみの 日に、ジョギングを して、シャワーを あびます: ngày nghỉ tôi chạy bộ rồi tắm vòi sen. あびる (tắm, dội nước) đi với シャワー. バス là xe buýt (バスに のります), プール là hồ bơi (プールで およぎます), ベッド là giường (ベッドで ねます), không đi với あびます.'),
            Q('クラスは 九時に はじまって、十一時に （　　）。', ['かえります', 'でかけます', 'おわります', 'はいります'], 3, "クラスは 九時に はじまって、十一時に おわります: lớp bắt đầu lúc 9 giờ và kết thúc lúc 11 giờ. はじまる (bắt đầu) đi cặp với おわる (kết thúc). かえります là về, でかけます là ra ngoài, はいります là vào; lớp đã bắt đầu rồi nên 'vào lớp lúc 11 giờ' không hợp ý nghĩa."),
            Q('A「すみません、えきは どこですか。」B「あの かどを （　　）、まっすぐ 行って ください。」', ['まがって', 'わたって', 'のぼって', 'おりて'], 1, 'A hỏi đường đến ga. B: あの かどを まがって、まっすぐ 行って ください nghĩa là hãy rẽ ở góc đường kia rồi đi thẳng. かどを まがる là rẽ ở góc. わたる là băng qua (はしを わたる, qua cầu), のぼる là leo lên (やまに のぼる), おりる là xuống (でんしゃを おりる), không đi với かど.'),
          ],
        },
        {
          id: 'm4',
          kind: 'moji',
          mondai: '問題4',
          title: 'Câu cùng nghĩa',
          instr: '【　】の ぶんと だいたい おなじ いみの ぶんが あります。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Chọn câu có nghĩa gần giống câu gạch chân.',
          questions: [
            Q('【おとといは 金よう日でした】。', ['きょうは 土よう日です。', 'きょうは 日よう日です。', 'きょうは 月よう日です。', 'きょうは 金よう日です。'], 2, 'おとといは 金よう日でした: hôm kia là thứ Sáu. Hôm qua là thứ Bảy nên hôm nay là Chủ nhật (日よう日): đáp án 2. Câu 1 (thứ Bảy) sẽ có hôm kia là thứ Năm, câu 3 (thứ Hai) có hôm kia là thứ Bảy, câu 4 (thứ Sáu) có hôm kia là thứ Tư, đều không khớp.'),
            Q('【この 本は ミラーさんに もらいました】。', ['わたしが ミラーさんに この 本を あげました。', 'ミラーさんが わたしに この 本を かりました。', 'ミラーさんが この 本を かって くれました。', 'ミラーさんが わたしに この 本を くれました。'], 4, 'この 本は ミラーさんに もらいました: tôi đã nhận quyển sách này từ Miller. N に もらう (nhận từ N) cùng nghĩa với N が わたしに くれる, tức câu 4 (Miller đã cho tôi quyển sách này). Câu 1 ngược chiều (tôi cho Miller), câu 2 là Miller mượn sách của tôi, câu 3 là Miller mua giúp tôi (かって くれました), đều khác nghĩa.'),
            Q('【わたしは テニスより サッカーが すきです】。', ['わたしは サッカーより テニスの ほうが すきです。', 'わたしは テニスも サッカーも すきでは ありません。', 'わたしは テニスより サッカーの ほうが すきです。', 'わたしは テニスと サッカーが ぜんぜん できません。'], 3, 'わたしは テニスより サッカーが すきです: so với quần vợt, tôi thích bóng đá hơn. Câu 3 わたしは テニスより サッカーの ほうが すきです cùng nghĩa (ほうが nhấn mạnh bên được chọn). Câu 1 đảo ngược (thích quần vợt hơn), câu 2 là không thích cả hai, câu 4 là hoàn toàn không chơi được cả hai, đều sai.'),
            Q('【この へやは せまいです】。', ['この へやは ひろく ありません。', 'この へやは あかるく ありません。', 'この へやは しずかでは ありません。', 'この へやは きれいでは ありません。'], 1, 'この へやは せまいです: phòng này chật (hẹp). Tính từ い đổi sang phủ định là ～く ありません: ひろく ありません là không rộng, tức là hẹp, nên câu 1 cùng nghĩa. Các câu còn lại nói về những mặt khác: あかるく ありません (không sáng), しずかでは ありません (không yên tĩnh), きれいでは ありません (không sạch đẹp).'),
            Q('【ここで しゃしんを とっては いけません】。', ['ここで しゃしんを とっても いいです。', 'ここは しゃしんを とる ことが できません。', 'ここで しゃしんを とらなければ なりません。', 'ここで しゃしんを とって ください。'], 2, "ここで しゃしんを とっては いけません: ở đây không được chụp ảnh. V てはいけません là cấm, cùng nghĩa với 'ここは しゃしんを とる ことが できません' (ở đây không thể chụp ảnh) ở câu 2. Câu 1 là ても いいです (cho phép), câu 3 là なければ なりません (phải chụp), câu 4 là ください (xin hãy chụp), nghĩa ngược lại."),
          ],
        },
      ],
    },
    {
      key: 'bunpou-dokkai',
      name: '文法・読解',
      vi: 'Ngữ pháp và đọc hiểu',
      minutes: 50,
      intro: 'Gồm ngữ pháp (điền từ, sắp xếp câu, điền vào đoạn văn) và đọc hiểu (đoạn ngắn, đoạn vừa, tìm thông tin). 32 câu, 50 phút.',
      sections: [
        {
          id: 'g1',
          kind: 'bunpou',
          mondai: '問題1',
          title: 'Điền từ vào câu',
          instr: '（　　）に なにを いれますか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Chọn từ hoặc mẫu câu thích hợp điền vào chỗ trống.',
          questions: [
            Q('わたしは 日よう日に デパート（　　）かいものに 行きます。', ['を', 'で', 'が', 'へ'], 4, 'わたしは 日よう日に デパートへ かいものに 行きます: Chủ nhật tôi đi mua sắm ở cửa hàng bách hóa. Động từ di chuyển 行きます cần trợ từ chỉ đích đến, dùng へ (hoặc に). を chỉ đối tượng tác động (ごはんを 食べます), で chỉ nơi diễn ra hành động, が chỉ chủ ngữ, đều không dùng cho điểm đến.'),
            Q('わたしは あたらしい ラケット（　　）ほしいです。', ['で', 'が', 'に', 'と'], 2, 'わたしは あたらしい ラケットが ほしいです: tôi muốn có một cây vợt mới. Mẫu N が ほしいです (muốn có N) dùng が cho thứ mình muốn. で chỉ phương tiện/nơi chốn, に chỉ đích hoặc người nhận, と nghĩa là cùng với hoặc và, không đi với ほしい.'),
            Q('A「あしたは 休みですね。いっしょに テニスを （　　）。」B「ええ、しましょう。」', ['しません', 'しました', 'しましょうか', 'しています'], 3, "A: あしたは 休みですね。いっしょに テニスを しましょうか。B: ええ、しましょう。 Nghĩa: A rủ 'Ngày mai nghỉ nhỉ, cùng chơi quần vợt nhé?' B đáp 'Ừ, chơi đi'. V ましょうか là lời rủ rê, đề nghị. しません (không làm), しました (đã làm), しています (đang làm) không có nghĩa rủ nên không khớp câu đáp しましょう."),
            Q('ベッドの 下に 小さい ねこが （　　）。', ['あります', 'います', 'おきます', 'ですか'], 2, "ベッドの 下に 小さい ねこが います: dưới giường có một con mèo nhỏ. Mèo là sinh vật sống nên dùng います (có, ở). あります dùng cho vật vô tri (つくえが あります). おきます (置く hoặc 起きる) không phải nghĩa 'có', còn ですか thì không đi sau trợ từ が để kết thúc câu thế này."),
            Q('スーパーは ぎんこうと ほんやの （　　）に あります。', ['うえ', 'した', 'なか', 'あいだ'], 4, 'スーパーは ぎんこうと ほんやの あいだに あります: siêu thị nằm giữa ngân hàng và hiệu sách. Mẫu A と B の あいだ nghĩa là giữa A và B. うえ (trên), した (dưới), なか (trong) chỉ vị trí so với một vật, không hợp khi siêu thị cùng lúc liên hệ với hai nơi là ngân hàng và hiệu sách.'),
            Q('わたしは なつ（　　）ふゆの ほうが すきです。', ['から', 'より', 'まで', 'だけ'], 2, 'わたしは なつより ふゆの ほうが すきです: tôi thích mùa đông hơn mùa hè. Mẫu A より B の ほうが ～: B hơn A, より đi sau vật dùng để so sánh (mùa hè). から là từ, まで là đến, だけ là chỉ, đều không tạo nên nghĩa so sánh.'),
            Q('これは きのう わたしが （　　）スポーツシューズです。', ['買います', '買って', '買い', '買った'], 4, 'これは きのう わたしが 買った スポーツシューズです: đây là đôi giày thể thao tôi đã mua hôm qua. Mệnh đề bổ nghĩa cho danh từ dùng thể thường, và vì là chuyện hôm qua nên dùng thể quá khứ 買った. 買います là thể lịch sự (không đứng trước danh từ), 買って là thể て (dùng nối câu), 買い chỉ là gốc động từ.'),
            Q('わたしは たんじょうびに ともだち（　　）くつを もらいました。', ['を', 'が', 'で', 'に'], 4, 'わたしは たんじょうびに ともだちに くつを もらいました: vào sinh nhật tôi nhận giày từ bạn. Mẫu N に もらう: nhận từ N, người cho đi với に. を chỉ vật được tác động (くつを), で chỉ nơi hoặc phương tiện. が sẽ biến bạn thành người nhận, vừa sai nghĩa vừa trùng chủ ngữ với わたしは.'),
            Q('ひま（　　）とき、えいがを 見に 行きます。', ['な', 'の', 'だ', 'で'], 1, 'ひまな とき、えいがを 見に 行きます: lúc rảnh tôi đi xem phim. Tính từ đuôi な khi bổ nghĩa cho danh từ thì thêm な: ひまな とき. Còn の dùng cho danh từ (あめの とき, lúc trời mưa). だ là thể thường cuối câu, で là dạng nối, đều không đặt trực tiếp trước とき theo cách này.'),
            Q('日本へ 行った（　　）、おみやげを 買いました。', ['とき', 'まえ', 'ごろ', 'ぐらい'], 1, '日本へ 行った とき、おみやげを 買いました: khi (đã) đến Nhật, tôi đã mua quà lưu niệm. V た とき là lúc đã làm V xong. まえ phải đi với V る (V る まえに), không đi với thể た. ごろ dùng với thời điểm (三時ごろ), ぐらい dùng với số lượng (三時間ぐらい), không đứng sau động từ.'),
            Q('ここは としょかんですから、おおきい こえで はなしては （　　）。', ['いいです', 'ください', 'いけません', 'ましょう'], 3, 'ここは としょかんですから、おおきい こえで はなしては いけません: đây là thư viện nên không được nói to. V ては いけません là cấm làm V. いいです phải đi với ても (はなしても いいです là được phép), ください và ましょう không ghép được sau dạng ては như vậy.'),
            Q('ミラーさんは いま うちに （　　）と おもいます。', ['います', 'いました', 'いる', 'いて'], 3, 'ミラーさんは いま うちに いる と おもいます: tôi nghĩ Miller bây giờ đang ở nhà. Trước と おもいます phải dùng thể thường, vì vậy いる. います là thể lịch sự, いました là quá khứ lịch sự (không hợp với いま), いて là thể て (nối câu), không đứng trước と おもいます.'),
            Q('あしたは いい てんきに なる（　　）。', ['でしょう', 'ですか', 'でした', 'ましょう'], 1, "あしたは いい てんきに なる でしょう: ngày mai chắc thời tiết sẽ đẹp. V る でしょう là phỏng đoán 'chắc là'. ですか là câu hỏi, でした là quá khứ (không hợp với あした), ましょう là lời rủ và phải ghép với gốc động từ (なりましょう), không đi sau なる."),
            Q('きょうは さむい（　　）、うちで ゲームを します。', ['から', 'まで', 'より', 'しか'], 1, 'きょうは さむいから、うちで ゲームを します: hôm nay lạnh nên tôi ở nhà chơi game. から đi sau vế lý do để nối với kết quả (vì... nên). まで (đến), より (hơn), しか (chỉ, đi với phủ định) đều không nối được lý do (lạnh) với kết quả (ở nhà chơi game).'),
            Q('ミラーさんは ぎんこうの ちかくに （　　）います。', ['すみ', 'すむ', 'すんで', 'すんだ'], 3, 'ミラーさんは ぎんこうの ちかくに すんで います: Miller đang sống gần ngân hàng. すむ là sống. Trạng thái kéo dài (đang sống ở một nơi) diễn đạt bằng V て います: すんで います. すみ (gốc) và すむ (thể từ điển) và すんだ (thể quá khứ) đều không đứng trước います trong mẫu này.'),
            Q('しゅくだいを （　　）から、ともだちと あそびます。', ['する', 'して', 'した', 'します'], 2, "しゅくだいを して から、ともだちと あそびます: làm bài tập xong rồi mới chơi với bạn. Mẫu V て から là sau khi làm V. する, した, します mà đứng trước から thì から mang nghĩa 'vì' (lý do), không diễn tả thứ tự 'làm xong rồi mới chơi' nên không hợp ý câu."),
          ],
        },
        {
          id: 'g2',
          kind: 'bunpou',
          mondai: '問題2',
          title: 'Sắp xếp câu (★)',
          instr: '★に はいる ものは どれですか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Sắp xếp 4 cụm theo đúng thứ tự, chọn cụm nằm ở vị trí ★. Dưới đây hiện 4 cụm cần sắp xếp.',
          sort: true,
          questions: [
            Q('これは ＿ ＿ ★ ＿ ケーキです。', ['母が', 'きのう', 'つくった', 'おいしい'], 3, 'Câu đúng: これは 母が きのう つくった おいしい ケーキです (đây là chiếc bánh ngon mà mẹ đã làm hôm qua). 母が きのう つくった là mệnh đề bổ nghĩa, dùng thể thường (つくった) và đứng ngay trước danh từ ケーキ, còn おいしい cũng bổ nghĩa cho ケーキ nên đứng sát nó. Thứ tự các ô là 母が, きのう, つくった, おいしい, nên ★ là つくった.'),
            Q('しゅくだいが ＿ ＿ ★ ＿ 行きます。', ['おわって', 'から', 'ともだちの', 'うちへ'], 3, 'Câu đúng: しゅくだいが おわって から ともだちの うちへ 行きます (làm xong bài tập rồi tôi sẽ đến nhà bạn). V て から nghĩa là sau khi làm V, nên おわって và から đi liền nhau ngay sau しゅくだいが. ともだちの bổ nghĩa cho うちへ (đến nhà của bạn). Thứ tự các ô là おわって, から, ともだちの, うちへ, nên ★ là ともだちの.'),
            Q('キムさんは ＿ ＿ ★ ＿ あります。', ['日本の', 'おまつりを', '見た', 'ことが'], 3, 'Câu đúng: キムさんは 日本の おまつりを 見た ことが あります (anh Kim đã từng xem lễ hội của Nhật). Mẫu V た ことが あります nghĩa là đã từng làm V (kinh nghiệm), nên 見た đứng trước ことが. 日本の bổ nghĩa cho おまつり. Thứ tự các ô là 日本の, おまつりを, 見た, ことが, nên ★ là 見た.'),
            Q('つくえの ＿ ＿ ★ ＿ あります。', ['上に', 'きのう', '買った', '本が'], 3, 'Câu đúng: つくえの 上に きのう 買った 本が あります (trên bàn có quyển sách mua hôm qua). 上に chỉ nơi có vật nằm, đi ngay sau つくえの. 買った (kèm きのう) là mệnh đề bổ nghĩa nên đứng ngay trước danh từ 本. Thứ tự các ô là 上に, きのう, 買った, 本が, nên ★ là 買った.'),
            Q('わたしは ＿ ＿ ★ ＿ できます。', ['日本語で', 'メールを', '書く', 'ことが'], 3, 'Câu đúng: わたしは 日本語で メールを 書く ことが できます (tôi có thể viết email bằng tiếng Nhật). Mẫu V る ことが できます nghĩa là có thể làm V, nên 書く đứng trước ことが. 日本語で (bằng tiếng Nhật) đứng đầu, rồi đến メールを (đối tượng của 書く). Thứ tự các ô là 日本語で, メールを, 書く, ことが, nên ★ là 書く.'),
          ],
        },
        {
          id: 'g3',
          kind: 'bunpou',
          mondai: '問題3',
          title: 'Điền vào đoạn văn',
          instr: '【1】から【5】に なにを いれますか。ぶんしょうの いみを かんがえて、1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Đọc đoạn văn và chọn từ thích hợp cho từng chỗ trống 【1】 đến 【5】.',
          passage:
            'わたしの しゅみは スポーツです。しゅうまつは いつも ともだち【1】 こうえんで テニスを します。\nきのうは あめが ふって いました。テニスを する【2】 できませんでした。ですから、うちで テレビを 見ました。\nテレビで おまつりの ニュースを やって いました。ミラーさんは「日本の おまつりは にぎやかです」【3】 いいました。わたしも 来年 日本へ 行き【4】です。おまつりを 見て【5】、ミラーさんと いっしょに テニスを したいです。',
          passageVi:
            'Sở thích của tôi là thể thao. Cuối tuần tôi luôn chơi quần vợt ở công viên với bạn. Hôm qua trời mưa nên tôi không chơi quần vợt được. Vì vậy tôi ở nhà xem ti vi. Trên ti vi đang có tin tức về lễ hội. Anh Miller nói "Lễ hội ở Nhật rất náo nhiệt". Tôi cũng muốn đến Nhật vào năm sau. Sau khi xem lễ hội, tôi muốn chơi quần vợt cùng anh Miller.',
          questions: [
            Q('【1】に はいる ものは どれですか。', ['を', 'と', 'から', 'まで'], 2, 'Câu trong bài: しゅうまつは いつも ともだちと こうえんで テニスを します (cuối tuần tôi luôn chơi quần vợt ở công viên với bạn). Trợ từ と nghĩa là cùng với, chỉ người cùng làm hành động. を chỉ đối tượng nên không hợp với ともだち, から là từ (người cho), まで là đến, không hợp ý chơi cùng bạn.'),
            Q('【2】に はいる ものは どれですか。', ['ことを', 'ものが', 'ことが', 'ことに'], 3, "Câu trong bài: テニスを する ことが できませんでした (tôi đã không chơi quần vợt được), vì hôm qua trời mưa. Mẫu V る ことが できません diễn tả không thể làm V, khả năng đi với が. ことを, ものが, ことに đều không tạo được mẫu 'có thể/không thể' này (ことに thì thường đi với なる, します khi quyết định)."),
            Q('【3】に はいる ものは どれですか。', ['が', 'を', 'に', 'と'], 4, "Câu trong bài: ミラーさんは「日本の おまつりは にぎやかです」と いいました (anh Miller nói 'lễ hội ở Nhật rất náo nhiệt'). Khi trích dẫn lời nói, dùng と trước いいました. が, を, に đều không dùng để dẫn nguyên văn lời nói như vậy."),
            Q('【4】に はいる ものは どれですか。', ['たい', 'たく', 'ます', 'て'], 1, 'Câu trong bài: わたしも 来年 日本へ 行きたいです (tôi cũng muốn đến Nhật vào năm sau). V ます bỏ ます + たいです là muốn làm V: 行き + たい + です. たく chỉ dùng khi chia tiếp (行きたくない, 行きたくて). ます đi liền です là sai ngữ pháp, 行きて cũng không tồn tại.'),
            Q('【5】に はいる ものは どれですか。', ['まで', 'から', 'より', 'だけ'], 2, "Câu trong bài: おまつりを 見て から、ミラーさんと いっしょに テニスを したいです (sau khi xem lễ hội, tôi muốn chơi quần vợt cùng anh Miller). V て から là sau khi làm V. まで, より, だけ không ghép được sau て-form để tạo nghĩa 'sau khi' hoặc nối hai hành động."),
          ],
        },
        {
          id: 'd4',
          kind: 'dokkai',
          mondai: '問題4',
          title: 'Đọc hiểu đoạn ngắn',
          instr: 'つぎの ぶんしょうを よんで、しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Đọc đoạn văn ngắn rồi trả lời câu hỏi.',
          questions: [
            Q('キムさんは 何を もって 行きますか。', ['にくと やさい', 'おべんとう', 'のみもの', 'かさ'], 3, 'Trong thư, Miller viết: にくと やさいは わたしが 買います (thịt và rau tôi sẽ mua), キムさんは のみものを もって 来て ください (Kim hãy mang đồ uống đến). Vì vậy Kim mang のみもの (đồ uống). Đáp án 1 là phần Miller mua, おべんとう (cơm hộp) không được nhắc đến, かさ (cái ô) cũng không có lời nhờ mang.', {
              passage: 'キムさんへ\n土よう日の バーベキューは あめですから、日よう日に します。十一時に 駅の 北口で 会いましょう。\nにくと やさいは わたしが 買います。キムさんは のみものを もって 来て ください。\nミラー',
              passageVi: 'Gửi Kim. Vì thứ Bảy trời mưa nên buổi tiệc nướng sẽ tổ chức vào Chủ nhật. 11 giờ chúng ta gặp nhau ở cửa bắc của ga nhé. Thịt và rau tôi sẽ mua. Kim hãy mang đồ uống đến nhé. Miller.',
            }),
            Q('あした、水が 出ないのは 何時間ですか。', ['二時間', '一時間', '三時間', '五時間'], 1, 'Thông báo ghi ごご 三時から 五時まで、水が 出ません: ngày mai từ 3 giờ đến 5 giờ chiều sẽ không có nước. Từ 3 đến 5 giờ là 2 tiếng (二時間). Đừng nhầm 三時 (3 giờ, mốc bắt đầu) hay 五時 (5 giờ, mốc kết thúc) với số giờ; thông báo còn dặn tắm trước 3 giờ (三時までに).', {
              passage: 'アパートの みなさんへ\nあした、ごご 三時から 五時まで、水が 出ません。シャワーを あびたい 人は、三時までに あびて ください。\nトイレは 一かいの を つかって ください。\nアパートの 人より',
              passageVi: 'Gửi mọi người trong khu căn hộ. Ngày mai từ 3 giờ đến 5 giờ chiều sẽ không có nước. Ai muốn tắm vòi sen thì hãy tắm trước 3 giờ. Hãy dùng nhà vệ sinh ở tầng một. Từ người quản lý khu căn hộ.',
            }),
            Q('二十日が あめの 日は、おまつりは いつ ありますか。', ['十九日', '二十日', '二十一日', '二十二日'], 4, 'Thông báo ghi 二十日が あめの 日は、二日 あとに します: nếu ngày 20 mưa thì dời sang hai ngày sau. 20 + 2 = 22 nên lễ hội sẽ diễn ra ngày 22 (二十二日). 十九日 là trước đó một ngày, 二十日 là ngày gốc bị mưa, 二十一日 mới chỉ là một ngày sau, chưa đủ hai ngày.', {
              passage: 'おまつりの おしらせ\n八月 二十日（土よう日）　ごご 五時から 九時まで\nところ：駅の 前の 道\n二十日が あめの 日は、二日 あとに します。\nこどもは お金が いりません。',
              passageVi: 'Thông báo lễ hội. Ngày 20 tháng 8 (thứ Bảy), từ 5 giờ đến 9 giờ tối. Địa điểm: con đường trước ga. Nếu ngày 20 mưa thì sẽ dời sang hai ngày sau. Trẻ em không mất tiền.',
            }),
          ],
        },
        {
          id: 'd5',
          kind: 'dokkai',
          mondai: '問題5',
          title: 'Đọc hiểu đoạn vừa',
          instr: 'つぎの ぶんしょうを よんで、しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Đọc đoạn văn vừa rồi trả lời câu hỏi.',
          questions: [
            Q('わたしは どうして サントスさんに およぎかたを おしえて もらいましたか。', ['サントスさんが プールの 人だから', 'サントスさんが およぐのが 上手だから', 'サントスさんが 先生だから', 'サントスさんが ひまだから'], 2, 'Bài văn viết: サントスさんは およぐのが 上手ですから、わたしは サントスさんに およぎかたを おしえて もらいました (vì Santos bơi giỏi nên tôi được Santos dạy cách bơi). から chỉ lý do. Santos là bạn (ともだち), không phải nhân viên hồ bơi hay giáo viên, và bài không nói là Santos rảnh.', {
              passage:
                'きのうは 日よう日でした。わたしは あさ 十時に おきて、ともだちの サントスさんと プールへ 行きました。プールは うちから 電車で 二十分です。\nサントスさんは およぐのが 上手ですから、わたしは サントスさんに およぎかたを おしえて もらいました。\nそれから、プールの 前の レストランで ひるごはんを 食べました。サントスさんは さかなを 食べましたが、わたしは にくを 食べました。うちへ かえって、すぐに ねました。',
              passageVi:
                'Hôm qua là Chủ nhật. Sáng tôi dậy lúc 10 giờ rồi đi bơi với bạn Santos. Hồ bơi cách nhà 20 phút đi tàu điện. Vì Santos bơi giỏi nên tôi được Santos dạy cách bơi. Sau đó chúng tôi ăn trưa ở nhà hàng trước hồ bơi. Santos ăn cá, còn tôi ăn thịt. Về nhà tôi đi ngủ ngay.',
            }),
            Q('パソコンは どこに ありますか。', ['つくえの 上', 'ベッドの 下', 'まどの 右', 'ベッドの 上'], 1, 'Trong thư, Kim viết: つくえの 上には パソコンと とけいが あります (trên bàn có máy tính và đồng hồ). Vậy パソコン ở trên bàn (つくえの 上). Đáp án 2: ベッドの 下 là chỗ để nhiều sách, 3: まどの 右 là chỗ đặt giường, 4: ベッドの 上 không được nhắc đến.', {
              passage:
                'リンさんへ\nおげんきですか。わたしは 先週から あたらしい へやに すんで います。えきから あるいて 五分です。へやは 二かいで、ひろくて あかるいです。\nまどの 左に つくえが あります。右に ベッドが あります。ベッドの 下には 本が たくさん あります。つくえの 上には パソコンと とけいが あります。\n来週の 土よう日に あそびに 来ませんか。\nキム',
              passageVi:
                'Gửi Lin. Bạn có khỏe không? Từ tuần trước tôi sống trong căn phòng mới. Từ ga đi bộ 5 phút. Phòng ở tầng hai, rộng và sáng. Bên trái cửa sổ có cái bàn, bên phải có cái giường. Dưới giường có nhiều sách. Trên bàn có máy tính và đồng hồ. Thứ Bảy tuần sau bạn đến chơi nhé? Kim.',
            }),
          ],
        },
        {
          id: 'd6',
          kind: 'dokkai',
          mondai: '問題6',
          title: 'Tìm thông tin',
          instr: 'つぎの ぶんしょうを よんで、しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Đọc thông báo và tìm thông tin phù hợp với điều kiện trong câu hỏi.',
          questions: [
            Q('リンさんは 土よう日は あさから よるまで いそがしいです。日よう日は ごごだけ ひまです。一か月 三百円までの クラスに 行きたいです。どの クラスに 行きますか。', ['Aクラス', 'Bクラス', 'Dクラス', 'どの クラスにも 行けません'], 3, 'Lin bận cả ngày thứ Bảy nên loại lớp A và B (đều ở thứ Bảy). Chủ nhật chỉ rảnh buổi chiều nên loại lớp C (9 giờ đến 11 giờ sáng, lại 500 yên). Lớp D học bóng chày Chủ nhật từ 2 giờ đến 4 giờ chiều, 300 yên, đúng giờ rảnh và đúng ngân sách tối đa 300 yên. Vậy chọn lớp D.', {
              passage:
                'しゅうまつの スポーツクラス（一か月の おかね）\nAクラス：テニス　土よう日　九時から 十一時　四百円\nBクラス：サッカー　土よう日　ごご 一時から 三時　三百円\nCクラス：プール　日よう日　九時から 十一時　五百円\nDクラス：やきゅう　日よう日　ごご 二時から 四時　三百円',
              passageVi:
                'Các lớp thể thao cuối tuần (phí một tháng). Lớp A: quần vợt, thứ Bảy, 9 giờ đến 11 giờ, 400 yên. Lớp B: bóng đá, thứ Bảy, 1 giờ đến 3 giờ chiều, 300 yên. Lớp C: bơi, Chủ nhật, 9 giờ đến 11 giờ, 500 yên. Lớp D: bóng chày, Chủ nhật, 2 giờ đến 4 giờ chiều, 300 yên.',
            }),
          ],
        },
      ],
    },
    {
      key: 'choukai',
      name: '聴解',
      vi: 'Nghe hiểu',
      minutes: 30,
      listening: true,
      intro: 'Phần nghe bằng giọng đọc máy (không có file âm thanh, không có hình). Nghe từng câu 1ばん, 2ばん... rồi chọn đáp án. 23 câu, 30 phút. Ở 問題1 và 問題2 được nghe 2 lần, ở 問題3 và 問題4 chỉ nghe 1 lần.',
      sections: [
        {
          id: 'c1',
          kind: 'choukai',
          mondai: '問題1',
          title: 'Nghe câu hỏi rồi chọn',
          plays: 2,
          instr: 'もんだい1では、はじめに しつもんを きいて ください。それから はなしを きいて、もんだいようしの 1から4の なかから、いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Nghe câu hỏi trước, rồi nghe hội thoại, chọn đáp án đúng nhất trong 1-4 (các đáp án in bằng chữ).',
          questions: [
            Q('1ばん', ['サッカーを します', 'えいがを みに いきます', 'ともだちと ごはんを たべます', 'うちで やすみます'], 2, 'Hội thoại: ngày mai là Chủ nhật, người nam định chơi bóng đá nhưng trời mưa nên thôi. Anh ấy không ở nhà mà sẽ đi xem phim với bạn, sau đó mới cùng ăn cơm. Câu hỏi là "trước tiên làm gì" nên đáp án là đi xem phim (đáp án 2).', {
              audio: [
                ['ナ', 'いちばん。おんなの ひとと おとこの ひとが はなして います。おとこの ひとは あした、まず なにを しますか。'],
                ['女', 'あしたは にちようびですね。なにを しますか。'],
                ['男', 'サッカーを したかったですが、あしたは あめですから、やめました。'],
                ['女', 'じゃあ、うちで やすみますか。'],
                ['男', 'いいえ。ともだちと えいがを みに いきます。そのあと、いっしょに ごはんを たべます。'],
                ['ナ', 'おとこの ひとは あした、まず なにを しますか。'],
              ],
            }),
            Q('2ばん', ['えきの まえ', 'ほんや', 'パンや', 'この ビルの なかの コンビニ'], 4, 'Hội thoại: người nữ hỏi chỗ có cửa hàng tiện lợi. Người nam nói trước ga có nhưng hơi xa, rồi chỉ ra rằng trong tòa nhà này cũng có hiệu sách, tiệm bánh mì và cạnh đó có cửa hàng tiện lợi. Chị ấy quyết định đến đó, nên đáp án là cửa hàng tiện lợi trong tòa nhà (đáp án 4).', {
              audio: [
                ['ナ', 'にばん。おんなの ひとは これから どこへ いきますか。'],
                ['女', 'すみません、ちかくに コンビニは ありますか。'],
                ['男', 'ええ。えきの まえに ありますが、ここから すこし とおいですよ。'],
                ['男', 'この ビルの なかにも、ほんやと パンやが ありますよ。その となりに コンビニも あります。'],
                ['女', 'そうですか。じゃあ、そこへ いきます。どうも ありがとうございます。'],
                ['ナ', 'おんなの ひとは これから どこへ いきますか。'],
              ],
            }),
            Q('3ばん', ['ジュースと おちゃ', 'にくと やさい', 'おさらと コップ', 'おさけ'], 1, 'Hội thoại: người nam nói にくと やさい và おさら là mình chuẩn bị (mua, mang đi), おさけは いりません (không cần rượu), rồi nhờ ジュースと おちゃ を おねがいします (nhờ mang nước ép và trà), コップ cũng do anh ấy mang. Vậy người nữ mang ジュースと おちゃ. Các đáp án 2, 3, 4 là thứ anh ấy lo hoặc không cần.', {
              audio: [
                ['ナ', 'さんばん。おんなの ひとは あしたの バーベキューに なにを もって いきますか。'],
                ['女', 'あしたの バーベキューには なにを もって いきましょうか。'],
                ['男', 'にくと やさいは わたしが かいます。おさらも わたしが もって いきます。'],
                ['女', 'おさけは どうしますか。'],
                ['男', 'おさけは いりません。ジュースと おちゃを おねがいします。コップは わたしが もって いきます。'],
                ['女', 'わかりました。'],
                ['ナ', 'おんなの ひとは あしたの バーベキューに なにを もって いきますか。'],
              ],
            }),
            Q('4ばん', ['しごとを やすむ', 'ともだちに でんわを します', 'うちへ かえります', 'えきの まえで まちます'], 3, 'Hội thoại: lễ hội bắt đầu lúc 6 giờ, chị ấy không nghỉ làm, tan làm lúc 5 giờ rồi về nhà tắm vòi sen. Gọi điện cho bạn thì làm sau, hẹn gặp trước ga lúc 6 giờ rưỡi. Trước khi đi lễ hội, việc đầu tiên là về nhà (đáp án 3).', {
              audio: [
                ['ナ', 'よんばん。おんなの ひとは おまつりに いく まえに、まず なにを しますか。'],
                ['男', 'おまつりは ろくじからですね。しごとを やすみますか。'],
                ['女', 'いいえ、やすみません。しごとが ごじに おわります。それから、うちへ かえって、シャワーを あびます。'],
                ['男', 'ともだちには でんわしましたか。'],
                ['女', 'いいえ、ともだちには あとで でんわします。'],
                ['男', 'じゃあ、ろくじはんに えきの まえで あいましょう。'],
                ['女', 'はい。'],
                ['ナ', 'おんなの ひとは おまつりに いく まえに、まず なにを しますか。'],
              ],
            }),
            Q('5ばん', ['まどの ちかく', 'ベッドの となり', 'ドアの ひだり', 'ドアの みぎ'], 4, 'Hội thoại: cạnh cửa sổ thì tốt nhưng bên cạnh giường thì chật. Bên trái cửa ra vào sẽ đặt giá sách. Người nữ bảo đặt bàn ở bên phải cửa ra vào, nên đáp án là ドアの みぎ (đáp án 4).', {
              audio: [
                ['ナ', 'ごばん。つくえは どこに おきますか。'],
                ['男', 'この つくえは どこに おきますか。'],
                ['女', 'まどの ちかくが いいと おもいますが、ベッドの となりは せまいですね。'],
                ['男', 'じゃあ、ドアの ひだりは どうですか。'],
                ['女', 'ひだりには ほんだなを おきますから、みぎに おいて ください。'],
                ['男', 'わかりました。'],
                ['ナ', 'つくえは どこに おきますか。'],
              ],
            }),
            Q('6ばん', ['ぎんこうの まえの こうえん', 'がっこうの うしろの こうえん', 'がっこうの なかの テニスコート', 'えきの まえの こうえん'], 2, 'Hội thoại: công viên trước ngân hàng ngày mai có lễ hội nên đông người. Công viên trước ga không được chơi bóng. Sân quần vợt trong trường ngày mai nghỉ nên không vào được. Cuối cùng hai người chọn công viên sau trường (đáp án 2).', {
              audio: [
                ['ナ', 'ろくばん。ふたりは あした どこで テニスを しますか。'],
                ['女', 'あした いっしょに テニスを しませんか。'],
                ['男', 'いいですね。ぎんこうの まえの こうえんは どうですか。'],
                ['女', 'あそこは あした おまつりが ありますから、ひとが たくさん いますよ。'],
                ['男', 'じゃあ、えきの まえの こうえんは？'],
                ['女', 'あそこは ボールで あそんでは いけません。'],
                ['男', 'がっこうの なかの テニスコートは？'],
                ['女', 'あしたは やすみで、はいる ことが できません。がっこうの うしろの こうえんに しましょう。'],
                ['男', 'そうしましょう。'],
                ['ナ', 'ふたりは あした どこで テニスを しますか。'],
              ],
            }),
          ],
        },
        {
          id: 'c2',
          kind: 'choukai',
          mondai: '問題2',
          title: 'Nghe câu hỏi rồi chọn',
          plays: 2,
          instr: 'もんだい2では、はじめに しつもんを きいて ください。それから はなしを きいて、もんだいようしの 1から4の なかから、いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Nghe câu hỏi trước, rồi nghe hội thoại, chọn đáp án đúng nhất trong 1-4 (các đáp án in bằng chữ).',
          questions: [
            Q('1ばん', ['ごひゃくえん', 'はっせんえん', 'ななせんごひゃくえん', 'ななせんえん'], 3, 'Hội thoại: phí câu lạc bộ thể thao là 8000 yên một tháng, sinh viên được giảm 500 yên. Người nam là sinh viên nên trả 8000 - 500 = 7500 yên (ななせんごひゃくえん, đáp án 3). Anh ấy từng nghĩ khoảng 7000 yên.', {
              audio: [
                ['ナ', 'いちばん。おとこの ひとは スポーツクラブに いっかげつ いくら かかりますか。'],
                ['男', 'スポーツクラブは いっかげつ いくらですか。'],
                ['女', 'はっせんえんです。でも、だいがくせいは ごひゃくえん やすく なりますよ。'],
                ['男', 'わたしは だいがくせいです。ななせんえんぐらいだと おもって いました。'],
                ['女', 'じゃあ、ななせんごひゃくえんです。'],
                ['男', 'わかりました。おねがいします。'],
                ['ナ', 'おとこの ひとは スポーツクラブに いっかげつ いくら かかりますか。'],
              ],
            }),
            Q('2ばん', ['ごぜん じゅうじ', 'ごぜん くじ', 'ごぜん じゅういちじ', 'ごご いちじ'], 1, 'Hội thoại: người nam nhớ cuộc họp lúc 9 giờ sáng (くじ), người nữ sửa: đã đổi thành ごぜん じゅうじ (10 giờ sáng). Anh ấy hỏi lại 11 giờ (じゅういちじ) thì chị ấy phủ nhận, nhắc lại là じゅうじ. ごご いちじ (1 giờ chiều) là giờ ăn trưa, không phải giờ họp. Đáp án là 1.', {
              audio: [
                ['ナ', 'にばん。おまつりの かいぎは なんじからですか。'],
                ['男', 'あしたの おまつりの かいぎは ごぜん くじからですね。'],
                ['女', 'いいえ、くじでは ありません。ごぜん じゅうじからに なりました。'],
                ['男', 'じゅういちじですか。'],
                ['女', 'いいえ、じゅうじです。ひるごはんは ごご いちじからです。'],
                ['男', 'わかりました。'],
                ['ナ', 'おまつりの かいぎは なんじからですか。'],
              ],
            }),
            Q('3ばん', ['しごとが あるから', 'かぜを ひいて いるから', 'プールが やすみだから', 'ははの たんじょうびだから'], 4, 'Hội thoại: người nam rủ đi bơi, người nữ từ chối. Người nam đoán và chị ấy loại từng lý do: プールは あしたも あいて います (chính người nam nói hồ bơi ngày mai vẫn mở, loại 3), しごとは やすみ (không bận việc, loại 1), げんきです (khỏe, không phải bị cảm, loại 2). Lý do thật là ははの たんじょうびですから (vì ngày mai sinh nhật mẹ), cả nhà ăn cơm cùng nhau. Đáp án 4.', {
              audio: [
                ['ナ', 'さんばん。おんなの ひとは どうして あした プールへ いけませんか。'],
                ['男', 'あした プールへ いきませんか。'],
                ['女', 'すみません、あしたは ちょっと…。'],
                ['男', 'プールは あしたも あいて いますよ。しごとですか。'],
                ['女', 'いいえ、しごとは やすみです。'],
                ['男', 'かぜですか。'],
                ['女', 'いいえ、げんきです。あしたは ははの たんじょうびですから、いっしょに ごはんを たべます。'],
                ['男', 'そうですか。じゃあ、また こんど。'],
                ['ナ', 'おんなの ひとは どうして あした プールへ いけませんか。'],
              ],
            }),
            Q('4ばん', ['よにん', 'ごにん', 'ろくにん', 'さんにん'], 2, 'Hội thoại: người nam nói ngoài hai người đang nói chuyện còn có ミラーさん và キムさん (2 + 2 = 4). サントスさん bận nên không đến. リンさん đến muộn nhưng vẫn đến, thêm 1 người nữa, tổng là 5 người (ごにん). よにん là nếu quên Lin, ろくにん là nếu tính cả Santos, さんにん thì thiếu hẳn. Đáp án 2.', {
              audio: [
                ['ナ', 'よんばん。パーティーに ぜんぶで なんにん きますか。'],
                ['女', 'あしたの パーティーに だれが きますか。'],
                ['男', 'わたしと あなたの ほかに、ミラーさんと キムさんが きます。'],
                ['女', 'サントスさんは？'],
                ['男', 'サントスさんは しごとが ありますから、きません。リンさんは すこし おくれますが、きます。'],
                ['女', 'わかりました。'],
                ['ナ', 'パーティーに ぜんぶで なんにん きますか。'],
              ],
            }),
            Q('5ばん', ['はちがつ ようか', 'はちがつ ふつか', 'はちがつ とおか', 'はちがつ はつか'], 4, 'Hội thoại: lễ hội diễn ra vào 20 tháng 8 (はつか), không phải ngày 8 (ようか) hay ngày 2 (ふつか). Người nam từng nghĩ là ngày 10 (とおか) nhưng chị ấy sửa lại. Đáp án là はちがつ はつか (đáp án 4).', {
              audio: [
                ['ナ', 'ごばん。おまつりは なんがつ なんにちですか。'],
                ['男', 'おまつりは いつですか。'],
                ['女', 'はちがつ はつかです。ようかでも、ふつかでも ありませんよ。'],
                ['男', 'とおかだと おもって いました。'],
                ['女', 'いいえ、はつかです。にちようびです。'],
                ['男', 'わかりました。'],
                ['ナ', 'おまつりは なんがつ なんにちですか。'],
              ],
            }),
            Q('6ばん', ['みっつ', 'ふたつ', 'よっつ', 'ひとつ'], 1, 'Hội thoại: người nam đoán có khoảng 4 cái ghế (よっつ), rồi đoán 2 cái (ふたつ), nhưng người nữ đều sửa lại. Thực tế có: 1 cái trước bàn, 1 cái cạnh giường, và thêm 1 cái sau cửa để dùng khi có bạn đến chơi. Tổng cộng 3 cái ghế (みっつ). ひとつ (1) và ふたつ (2) là con số chưa đủ, よっつ (4) là con số người nam đoán dư. Đáp án 1.', {
              audio: [
                ['ナ', 'ろくばん。おんなの ひとの へやに いすは いくつ ありますか。'],
                ['男', 'へやに いすが よっつぐらい ありますか。'],
                ['女', 'いいえ。つくえの まえに ひとつ、ベッドの となりに ひとつ あります。'],
                ['男', 'ふたつですね。'],
                ['女', 'いいえ、ともだちが きた とき、つかう いすが、ドアの うしろに もうひとつ あります。'],
                ['男', 'そうですか。'],
                ['ナ', 'おんなの ひとの へやに いすは いくつ ありますか。'],
              ],
            }),
          ],
        },
        {
          id: 'c3',
          kind: 'choukai',
          mondai: '問題3',
          title: 'Chọn câu nói theo tình huống',
          plays: 1,
          instr: 'もんだい3では、がめんは ありません。ことばで じょうきょうを せつめいします。なんと いいますか。1から3の なかから、いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Không có hình. Người dẫn kể tình huống bằng lời, nghe rồi chọn câu nói thích hợp trong 1-3 (các lựa chọn chỉ có trong phần nghe).',
          questions: [
            Q('1ばん', ['1', '2', '3'], 1, 'Tình huống: rủ bạn đi lễ hội Chủ nhật. Đáp án 1「いっしょに おまつりに いきませんか。」(Chúng ta cùng đi lễ hội nhé?) là lời rủ. 2「おまつりに いって きます。」(Tôi đi lễ hội đây) là lời chào khi ra khỏi nhà, sai. 3「おまつりは よかったですね。」(Lễ hội hay nhỉ) là cảm tưởng sau khi đã đi, sai.', {
              bare: true,
              audio: [
                ['ナ', 'いちばん。ともだちを にちようびの おまつりに さそいます。なんと いいますか。'],
                ['ナ', 'いち。いっしょに おまつりに いきませんか。'],
                ['ナ', 'に。おまつりに いって きます。'],
                ['ナ', 'さん。おまつりは よかったですね。'],
              ],
            }),
            Q('2ばん', ['1', '2', '3'], 3, 'Tình huống: đang ở phòng bạn, nóng nên muốn mở cửa sổ, cần xin phép. Đáp án 3「まどを あけても いいですか。」(Tôi mở cửa sổ được không?) là xin phép. 1「まどを あけて いますか。」(Bạn có đang mở cửa sổ không?) là hỏi trạng thái, sai. 2「まどを あけなければ なりませんか。」(Tôi có phải mở cửa sổ không?) là hỏi nghĩa vụ, sai.', {
              bare: true,
              audio: [
                ['ナ', 'にばん。ともだちの へやに います。あついですから、まどを あけたいです。なんと いいますか。'],
                ['ナ', 'いち。まどを あけて いますか。'],
                ['ナ', 'に。まどを あけなければ なりませんか。'],
                ['ナ', 'さん。まどを あけても いいですか。'],
              ],
            }),
            Q('3ばん', ['1', '2', '3'], 2, 'Tình huống: bạn nấu món ngon cho mình, ăn xong. Đáp án 2「ごちそうさまでした。とても おいしかったです。」(Cảm ơn bữa ăn, rất ngon) là lời nói sau khi ăn xong. 1「いただきます。」(Mời ăn) nói trước khi ăn. 3「おかえりなさい。」(Bạn về rồi à) là lời chào khi ai đó về nhà.', {
              bare: true,
              audio: [
                ['ナ', 'さんばん。ともだちが おいしい りょうりを つくって くれました。たべおわりました。なんと いいますか。'],
                ['ナ', 'いち。いただきます。'],
                ['ナ', 'に。ごちそうさまでした。とても おいしかったです。'],
                ['ナ', 'さん。おかえりなさい。'],
              ],
            }),
            Q('4ばん', ['1', '2', '3'], 3, 'Tình huống: trong lớp tiếng Nhật không hiểu lời giáo viên nói, muốn nhờ nói lại. Đáp án 3「すみません、もう いちど いって ください。」(Xin lỗi, xin nói lại một lần nữa) là lời nhờ. 1「もう いちど いって あげます。」(Tôi sẽ nói lại cho bạn) là mình làm giúp người khác, sai. 2「もう いちど いいましょうか。」(Tôi nói lại nhé?) là đề nghị làm, sai vai.', {
              bare: true,
              audio: [
                ['ナ', 'よんばん。にほんごの クラスで、せんせいの はなしが わかりませんでした。なんと いいますか。'],
                ['ナ', 'いち。もう いちど いって あげます。'],
                ['ナ', 'に。もう いちど いいましょうか。'],
                ['ナ', 'さん。すみません、もう いちど いって ください。'],
              ],
            }),
            Q('5ばん', ['1', '2', '3'], 1, 'Tình huống: bạn bị cảm nghỉ ở nhà, gọi điện hỏi thăm. Đáp án 1「おだいじに。」(Chúc bạn mau khỏe) là lời hỏi thăm người bệnh. 2「おめでとうございます。」(Chúc mừng) dùng khi có việc vui. 3「いってらっしゃい。」(Bạn đi nhé) là lời tiễn người ra khỏi nhà.', {
              bare: true,
              audio: [
                ['ナ', 'ごばん。ともだちが かぜで やすんで います。でんわで はなします。なんと いいますか。'],
                ['ナ', 'いち。おだいじに。'],
                ['ナ', 'に。おめでとうございます。'],
                ['ナ', 'さん。いってらっしゃい。'],
              ],
            }),
          ],
        },
        {
          id: 'c4',
          kind: 'choukai',
          mondai: '問題4',
          title: 'Nghe câu, chọn câu trả lời',
          plays: 1,
          instr: 'もんだい4は、えなどが ありません。ぶんを きいて、1から3の なかから、いちばん いい ものを ひとつ えらんで ください。',
          instrVi: 'Không có tranh. Nghe một câu rồi chọn câu đáp lại đúng nhất trong 1-3 (các lựa chọn chỉ có trong phần nghe).',
          questions: [
            Q('1ばん', ['1', '2', '3'], 2, 'Câu nói: あしたの おまつりに いきますか。(Ngày mai bạn có đi lễ hội không?) Đáp án 2「ええ、ともだちと いきます。」(Vâng, tôi đi với bạn) trả lời đúng câu hỏi. 1「おまつりは きのうでした。」(Lễ hội là hôm qua) sai thời điểm. 3「おまつりは にぎやかでした。」(Lễ hội đã náo nhiệt) nói về quá khứ, không trả lời việc đi hay không.', {
              bare: true,
              audio: [
                ['ナ', 'いちばん。'],
                ['女', 'あしたの おまつりに いきますか。'],
                ['ナ', 'いち。おまつりは きのうでした。'],
                ['ナ', 'に。ええ、ともだちと いきます。'],
                ['ナ', 'さん。おまつりは にぎやかでした。'],
              ],
            }),
            Q('2ばん', ['1', '2', '3'], 1, 'Câu nói: この へやは ひろいですね。(Phòng này rộng nhỉ.) Đáp án 1「ええ、ひろくて あかるいです。」(Vâng, rộng và sáng) là đồng ý. 2「いいえ、おねがいします。」(Không, nhờ bạn) vô nghĩa. 3「ええ、ひろく ありません。」(Vâng, không rộng) tự mâu thuẫn.', {
              bare: true,
              audio: [
                ['ナ', 'にばん。'],
                ['男', 'この へやは ひろいですね。'],
                ['ナ', 'いち。ええ、ひろくて あかるいです。'],
                ['ナ', 'に。いいえ、おねがいします。'],
                ['ナ', 'さん。ええ、ひろく ありません。'],
              ],
            }),
            Q('3ばん', ['1', '2', '3'], 3, 'Câu nói: ミラーさんは どこに いますか。(Anh Miller ở đâu?) Đáp án 3「あそこの いすに すわって います。」(Anh ấy đang ngồi ở cái ghế đằng kia) trả lời về vị trí. 1「はい、います。」(Vâng, có) không trả lời "ở đâu". 2「あしたです。」(Là ngày mai) trả lời về thời gian, sai.', {
              bare: true,
              audio: [
                ['ナ', 'さんばん。'],
                ['女', 'ミラーさんは どこに いますか。'],
                ['ナ', 'いち。はい、います。'],
                ['ナ', 'に。あしたです。'],
                ['ナ', 'さん。あそこの いすに すわって います。'],
              ],
            }),
            Q('4ばん', ['1', '2', '3'], 2, 'Câu nói: いっしょに ひるごはんを たべませんか。(Cùng ăn trưa nhé?) Đáp án 2「すみません、きょうは ちょっと…。」(Xin lỗi, hôm nay hơi bất tiện) là cách từ chối lịch sự. 1「はい、たべません。」(Vâng, tôi không ăn) mâu thuẫn. 3「いいえ、おいしかったです。」(Không, ngon lắm) lạc đề.', {
              bare: true,
              audio: [
                ['ナ', 'よんばん。'],
                ['男', 'いっしょに ひるごはんを たべませんか。'],
                ['ナ', 'いち。はい、たべません。'],
                ['ナ', 'に。すみません、きょうは ちょっと…。'],
                ['ナ', 'さん。いいえ、おいしかったです。'],
              ],
            }),
            Q('5ばん', ['1', '2', '3'], 3, 'Câu nói: しゅみは なんですか。(Sở thích của bạn là gì?) Đáp án 3「しゃしんを とる ことです。」(Là chụp ảnh) trả lời đúng. 1「はい、そうです。」(Vâng, đúng vậy) không hợp với câu hỏi "gì". 2「ええ、たのしいです。」(Vâng, vui lắm) không nêu sở thích.', {
              bare: true,
              audio: [
                ['ナ', 'ごばん。'],
                ['女', 'しゅみは なんですか。'],
                ['ナ', 'いち。はい、そうです。'],
                ['ナ', 'に。ええ、たのしいです。'],
                ['ナ', 'さん。しゃしんを とる ことです。'],
              ],
            }),
            Q('6ばん', ['1', '2', '3'], 1, 'Câu nói: すみません、この せきは あいて いますか。(Xin lỗi, chỗ này còn trống không?) Đáp án 1「ええ、どうぞ。」(Vâng, mời ngồi) là câu đáp. 2「ええ、わかりました。」(Vâng, tôi hiểu rồi) không hợp. 3「いいえ、おねがいします。」(Không, nhờ bạn) tự mâu thuẫn.', {
              bare: true,
              audio: [
                ['ナ', 'ろくばん。'],
                ['男', 'すみません、この せきは あいて いますか。'],
                ['ナ', 'いち。ええ、どうぞ。'],
                ['ナ', 'に。ええ、わかりました。'],
                ['ナ', 'さん。いいえ、おねがいします。'],
              ],
            }),
          ],
        },
      ],
    },
  ],
};
