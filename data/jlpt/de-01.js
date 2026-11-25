// Đề thi thử JLPT N5 số 1, theo cấu trúc đề thật (2 phần thi đầu, mỗi phần có giờ riêng). Chưa có phần nghe 聴解 vì chưa có file âm thanh.
//
// Quy ước:
//  - Chữ Hán chỉ dùng trong 80 chữ của mục Kanji (data/kanji-n5.js), từ khác viết bằng kana, giống đề N5 thật.
//    Riêng đáp án nhiễu của 問題2 (chọn chữ Hán đúng) được dùng chữ na ná ngoài danh sách.
//  - 【...】 trong câu hỏi là phần gạch chân. （　　）là chỗ trống. ★ là ô cần xác định ở dạng sắp xếp câu.
//  - answer là số thứ tự (1-4) của đáp án đúng, như phiếu trả lời thật.
//  - Đề do app soạn theo cấu trúc N5, không phải đề thật của JLPT.

const Q = (prompt, choices, answer, explain, extra = {}) => ({ prompt, choices, answer, explain, ...extra });

export default {
  id: 'de-01',
  title: 'Thi thử N5 · Đề số 1',
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
            Q('【日よう日】は 学校が 休みです。', ['にちようび', 'げつようび', 'かようび', 'どようび'], 1, '日よう日 đọc là にちようび (Chủ nhật). Trong tên các thứ, 日 đọc là にち, còn ようび (曜日) nghĩa là ngày trong tuần. Câu nghĩa là: Chủ nhật trường nghỉ. げつようび là 月よう日 (thứ Hai), かようび là 火よう日 (thứ Ba), どようび là 土よう日 (thứ Bảy), đều là chữ kanji khác, không phải 日.'),
            Q('あの 【学校】は 大きいです。', ['がっこう', 'がくこう', 'かっこう', 'がっごう'], 1, '学校 đọc là がっこう (trường học). 学 vốn đọc là がく, nhưng đứng trước 校 (こう, thuộc hàng か) thì く biến thành âm ngắt っ nên thành がっこう. がくこう chưa biến âm nên sai; かっこう là từ khác (dáng vẻ) và 学 không đọc か; がっごう sai vì 校 không đục thành ごう. Câu nghĩa là: Trường kia to.'),
            Q('【電車】で 会社へ 行きます。', ['でんじゃ', 'でんしゃ', 'てんしゃ', 'てんじゃ'], 2, '電車 đọc là でんしゃ (tàu điện). 電 đọc でん (điện, có đục), 車 đọc しゃ (xe, không đục). Vì vậy でんじゃ, てんしゃ, てんじゃ đều sai ở chỗ đục hoặc không đục. Câu nghĩa là: Tôi đi đến công ty bằng tàu điện.'),
            Q('ケーキを 【四つ】 買いました。', ['よつつ', 'よんつ', 'よっつ', 'しっつ'], 3, '四つ đọc là よっつ (4 cái). Cách đếm đồ vật bằng つ: ひとつ, ふたつ, みっつ, よっつ, いつつ. Số 4 ở đây đọc là よ và có âm ngắt っ giống みっつ. よつつ, よんつ, しっつ không tồn tại. Câu nghĩa là: Tôi đã mua 4 cái bánh kem.'),
            Q('【今年】の 四月に 大学に 入りました。', ['こんねん', 'ことし', 'いまとし', 'きょうとし'], 2, '今年 đọc là ことし (năm nay). Đây là từ đọc đặc biệt, không ghép được từ âm của từng chữ nên phải học thuộc. こんねん, いまとし, きょうとし là cách đọc người học tự ghép từ 今 (こん, いま, きょう) nên không đúng. Câu nghĩa là: Tháng 4 năm nay tôi đã vào đại học.'),
            Q('父は 【会社】に 行きました。', ['がいしゃ', 'かいじゃ', 'かいしゃ', 'かいちゃ'], 3, '会社 đọc là かいしゃ (công ty). 会 đọc là かい, 社 đọc là しゃ, cả hai đều không đục. Vì vậy がいしゃ, かいじゃ, かいちゃ đều sai ở một âm. Câu nghĩa là: Bố tôi đã đi đến công ty.'),
            Q('【新しい】 本を 買いました。', ['あらたしい', 'あたらしい', 'あたらい', 'あたしらい'], 2, '新しい đọc là あたらしい (mới), gồm あたら + しい. Thứ tự đúng là あ-た-ら-し-い. あらたしい đảo た và ら (あらた là một từ khác nghĩa là mới mẻ, nhưng 新しい không đọc thế), あたらい thiếu し, あたしらい đảo し và ら. Câu nghĩa là: Tôi đã mua cuốn sách mới.'),
            Q('駅は 【右】に あります。', ['みき', 'ひだり', 'みぎ', 'ひたり'], 3, '右 đọc là みぎ (bên phải). 左 đọc là ひだり (bên trái) là chữ đối nghĩa, nên đáp án ひだり sai nghĩa. みき và ひたり là cách đọc sai (ひたり thiếu dấu đục). Câu nghĩa là: Nhà ga ở bên phải.'),
            Q('【水よう日】に 先生と 話します。', ['みずようび', 'すいようび', 'すいよび', 'すいゆうび'], 2, '水よう日 đọc là すいようび (thứ Tư). Trong tên thứ, 水 đọc là すい (âm On), không đọc みず (âm Kun) nên みずようび sai. すいよび thiếu う kéo dài, すいゆうび sai ở よう. Câu nghĩa là: Thứ Tư tôi nói chuyện với giáo viên.'),
            Q('【三百円】で 本を 買いました。', ['さんひゃくえん', 'さんぴゃくえん', 'さんびゃくえん', 'みっひゃくえん'], 3, '三百円 đọc là さんびゃくえん (300 yên). 百 vốn là ひゃく nhưng biến âm theo số đứng trước: 300 là さんびゃく, 600 là ろっぴゃく, 800 là はっぴゃく. さんひゃく chưa biến âm, さんぴゃく là biến âm của 600 hoặc 800, みっひゃく sai vì số 3 đọc là さん. Câu nghĩa là: Tôi mua sách với giá 300 yên.'),
            Q('【大きい】 木が あります。', ['おおきい', 'おうきい', 'おおいい', 'だいきい'], 1, '大きい đọc là おおきい (to, lớn). 大 ở đây đọc là おお (âm Kun), trường âm viết là お + お chứ không viết おう nên おうきい sai. おおいい thiếu き, だいきい trộn âm だい (như 大学 だいがく) với き nên không đúng. Câu nghĩa là: Có một cái cây to.'),
            Q('【来週】の 土よう日に 会いましょう。', ['らいしゅう', 'こしゅう', 'らいじゅう', 'らいしゅ'], 1, '来週 đọc là らいしゅう (tuần sau). 来 đọc là らい (giống 来月 らいげつ, 来年 らいねん), 週 đọc là しゅう. こしゅう sai vì 来 không đọc こ trong từ ghép này, らいじゅう sai vì しゅう không đục, らいしゅ thiếu う. Câu nghĩa là: Thứ Bảy tuần sau chúng ta gặp nhau nhé.'),
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
            Q('あした 【だいがく】へ 行きます。', ['犬学', '大学', '大字', '太学'], 2, 'だいがく viết là 大学 (đại học), gồm 大 (lớn) và 学 (học). 犬 là いぬ (con chó), khác 大 ở dấu chấm phía trên bên phải. 太 là ふとい (béo, dày), có dấu chấm phía dưới. 大字 sai chữ sau: 字 là じ (chữ viết), không phải 学. Câu nghĩa là: Ngày mai tôi sẽ đến trường đại học.'),
            Q('日よう日は 【やすみ】です。', ['休み', '体み', '伏み', '林み'], 1, 'やすみ viết là 休み (nghỉ). 休 gồm bộ 亻 (người) và 木 (cây): người dựa vào cây để nghỉ. 体 là 亻 + 本, đọc là からだ (cơ thể). 伏 là 亻 + 犬 (ふ, nằm phục xuống). 林 là 木 + 木 (はやし, rừng), không có bộ người. Câu nghĩa là: Chủ nhật là ngày nghỉ.'),
            Q('本を 【かい】ました。', ['貝い', '見い', '買い', '置い'], 3, 'かいました viết là 買いました (đã mua). 買 gồm 罒 (cái lưới) ở trên và 貝 (vỏ sò, ngày xưa dùng làm tiền) ở dưới. 貝 đọc là かい nhưng nghĩa là vỏ sò, 見 là み(る) (nhìn), 置 là お(く) (đặt, phần trên giống 買 nhưng phần dưới là 直). Câu nghĩa là: Tôi đã mua sách.'),
            Q('この 本を 【よんで】 ください。', ['続んで', '読んで', '説んで', '話んで'], 2, 'よんで viết là 読んで (đọc). 読 gồm bộ 言 (lời nói) bên trái và 売 bên phải. 続 là つづ(く) (tiếp tục), bộ 糸. 説 là せつ, と(く) (giải thích) và 話 là はな(す) (nói) tuy cũng có bộ 言 nhưng phần bên phải khác và nghĩa khác. Câu nghĩa là: Hãy đọc cuốn sách này.'),
            Q('【せんせい】は 日本人です。', ['牛生', '光生', '先主', '先生'], 4, 'せんせい viết là 先生 (giáo viên), gồm 先 (trước) và 生 (sinh), nghĩa gốc là người sinh ra trước. 牛 là うし (con bò) và 光 là ひかり (ánh sáng) dễ nhầm với 先 ở chữ đầu. 主 là しゅ, ぬし (chủ) dễ nhầm với 生 ở chữ sau. Câu nghĩa là: Giáo viên là người Nhật.'),
            Q('【えき】は あちらです。', ['訳', '駅', '釈', '沢'], 2, 'えき viết là 駅 (nhà ga), gồm bộ 馬 (ngựa) bên trái và 尺 bên phải. Các chữ nhiễu cũng có 尺 bên phải nên dễ nhầm: 訳 là やく (dịch, bộ 言), 釈 là しゃく (giải thích, bộ 釆), 沢 là さわ (đầm, bộ 氵). Câu nghĩa là: Nhà ga ở đằng kia.'),
            Q('【みぎ】に 行って ください。', ['石', '古', '右', '名'], 3, 'みぎ viết là 右 (phải). 石 là いし (đá) rất giống: cả hai có 口 ở dưới, nhưng 右 có nét ngang ngắn và nét phẩy dài, còn 石 có nét ngang dài và nét phẩy ngắn. 古 là ふる(い) (cũ), 名 là な (tên). Câu nghĩa là: Hãy đi sang bên phải.'),
            Q('父は 【かいしゃ】に 行きました。', ['会社', '全社', '合社', '会杜'], 1, 'かいしゃ viết là 会社 (công ty). 会 (gặp, hội) và 社 (tổ chức, đền) ghép lại. 全 là ぜん (toàn bộ) và 合 là ごう, あ(う) (hợp) có phần trên giống 会 nhưng phần dưới khác. 杜 có bộ 木 (cây), còn 社 có bộ 礻 (cúng tế) nên 会杜 không phải chữ đúng. Câu nghĩa là: Bố tôi đã đi đến công ty.'),
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
            Q('あさ ごはんを （　　）、学校へ 行きます。', ['食べて', '飲んで', '見て', '聞いて'], 1, 'Câu nghĩa là: Buổi sáng ăn cơm xong rồi đi đến trường. ごはんを 食べて (ăn cơm) hợp nghĩa, て nối hai hành động liên tiếp. 飲んで là uống (nước, trà), 見て là xem, 聞いて là nghe hoặc hỏi; ba động từ này không đi với ごはん.'),
            Q('この 本は 三百円です。とても （　　）です。', ['高い', '安い', 'ながい', 'おもい'], 2, 'Câu nghĩa là: Cuốn sách này giá 300 yên. Rất rẻ. Giá 300 yên là rẻ nên chọn 安い (やすい, rẻ). 高い (たかい) là đắt hoặc cao, ngược nghĩa. ながい là dài và おもい là nặng, nói về độ dài, trọng lượng chứ không nói về giá tiền.'),
            Q('（　　）が ふって いますから、かさを もって 行きましょう。', ['あめ', 'かぜ', 'そら', 'うみ'], 1, 'Câu nghĩa là: Vì trời đang mưa nên hãy mang ô đi nhé. あめが ふる (mưa rơi) khớp với かさ (ô). かぜ là gió và động từ của gió là ふく (thổi), không phải ふる. そら là bầu trời, うみ là biển, hai từ này không đi với ふる và không liên quan đến việc mang ô.'),
            Q('くらいですから、電気を （　　）ください。', ['けして', 'つけて', 'しめて', 'とめて'], 2, 'Câu nghĩa là: Vì trời tối nên hãy bật đèn lên. Bật đèn là 電気を つける. けして là tắt (けす), ngược nghĩa. しめて là đóng (cửa, cửa sổ), とめて là dừng lại (xe, máy), không dùng cho đèn.'),
            Q('店で 本を 三（　　）買いました。', ['さつ', 'まい', 'だい', 'ほん'], 1, 'Câu nghĩa là: Ở tiệm tôi đã mua ba quyển sách. Sách, vở, tạp chí đếm bằng さつ (冊): 三さつ. まい (枚) dùng cho vật mỏng như giấy, vé. だい (台) dùng cho máy móc, xe. ほん (本) dùng cho vật dài như bút, chai.'),
            Q('父は 会社へ 行く まえに、しんぶんを （　　）。', ['読みます', '聞きます', '話します', '書きます'], 1, 'Câu nghĩa là: Trước khi đi đến công ty, bố đọc báo. しんぶんを 読みます (đọc báo) là cách nói tự nhiên. 聞きます là nghe, 話します là nói, 書きます là viết, ba động từ này không hợp với しんぶん trong việc làm trước khi đi làm.'),
            Q('わたしは 日本語を 二年 （　　）います。', ['べんきょうして', 'あそんで', 'およいで', 'はたらいて'], 1, 'Câu nghĩa là: Tôi đã học tiếng Nhật được 2 năm. 日本語を べんきょうして います (đang học tiếng Nhật), 二年 là khoảng thời gian học. あそんで là chơi, およいで là bơi, はたらいて là làm việc; ba động từ này không nhận 日本語を làm tân ngữ.'),
            Q('A「あした、いっしょに しょくじに 行きませんか。」B「すみません、あしたは （　　）です。」', ['ひま', 'いそがしい', 'きれい', 'しずか'], 2, 'A: Ngày mai cùng đi ăn không? B: Xin lỗi, ngày mai tôi bận. Khi từ chối lời mời (すみません) thì nói あしたは いそがしいです (bận). ひま là rảnh, nếu rảnh thì đã nhận lời. きれい (đẹp, sạch) và しずか (yên tĩnh) tả nơi chốn, đồ vật, không dùng để từ chối.'),
            Q('電車に のる まえに、（　　）を 買います。', ['きっぷ', 'くつ', 'さいふ', 'かぎ'], 1, 'Câu nghĩa là: Trước khi lên tàu điện, tôi mua vé. きっぷ là vé tàu, thứ cần có để đi tàu. くつ là giày, さいふ là ví, かぎ là chìa khóa, đều không phải thứ cần mua để lên tàu.'),
            Q('A「おなかが すきましたね。」B「そうですね。（　　）に 行きましょう。」', ['会社', 'ぎんこう', 'レストラン', 'びょういん'], 3, 'A: Đói bụng rồi nhỉ. B: Ừ nhỉ. Đi nhà hàng nhé. おなかが すきました là đói, nên nơi hợp lý để đi là レストラン (nhà hàng). 会社 là công ty, ぎんこう là ngân hàng, びょういん là bệnh viện, đều không phải nơi để ăn.'),
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
            Q('わたしは 【大学生です】。', ['大学で べんきょうして います。', '大学で はたらいて います。', '大学の 先生です。', '大学を そつぎょうしました。'], 1, 'Câu gốc: Tôi là sinh viên đại học (大学生 だいがくせい). Câu đúng: 大学で べんきょうして います (đang học ở đại học), nghĩa tương đương. はたらいて います là đang làm việc. 大学の 先生 là giảng viên. そつぎょうしました là đã tốt nghiệp, tức không còn là sinh viên.'),
            Q('【きのうは 日よう日でした】。', ['きょうは 月よう日です。', 'きょうは 火よう日です。', 'きょうは 土よう日です。', 'きょうは 日よう日です。'], 1, 'Câu gốc: Hôm qua là Chủ nhật. Ngày sau Chủ nhật là thứ Hai nên hôm nay là 月よう日 (thứ Hai). 火よう日 là thứ Ba (sau Chủ nhật hai ngày), 土よう日 là thứ Bảy (trước Chủ nhật), 日よう日 là chính ngày hôm qua, không phải hôm nay.'),
            Q('【この 店の パンは 安いです】。', ['この 店の パンは 高く ありません。', 'この 店の パンは おいしく ありません。', 'この 店の パンは 大きく ありません。', 'この 店の パンは 新しく ありません。'], 1, 'Câu gốc: Bánh mì của tiệm này rẻ (安い). Rẻ nghĩa là không đắt, tức 高く ありません (tính từ い phủ định: 高い thành 高くありません). おいしく ありません (không ngon), 大きく ありません (không to), 新しく ありません (không mới) nói về vị, kích cỡ, độ mới, không nói về giá.'),
            Q('【ミラーさんは 十分 前に 出かけました】。', ['ミラーさんは まだ ここに います。', 'ミラーさんは もう ここに いません。', 'ミラーさんは これから 来ます。', 'ミラーさんは 十分 おくれます。'], 2, 'Câu gốc: Miller đã đi ra ngoài từ 10 phút trước. Đã ra ngoài thì bây giờ không còn ở đây: もう ここに いません (đã không còn ở đây). まだ いる (vẫn còn) và これから 来ます (từ giờ mới đến) trái nghĩa. 十分 おくれます là trễ 10 phút, không liên quan.'),
            Q('【わたしの 父は 先生です】。', ['わたしは 先生の 子です。', 'わたしは 先生の 父です。', 'わたしは 先生の 母です。', 'わたしは 先生の 先生です。'], 1, 'Câu gốc: Bố tôi là giáo viên. Vậy tôi là con (子) của giáo viên. Các đáp án còn lại đảo quan hệ: 先生の 父 là bố của giáo viên, 先生の 母 là mẹ của giáo viên, 先生の 先生 là thầy của giáo viên, đều khác nghĩa.'),
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
            Q('これは 先生（　　）かばんです。', ['は', 'の', 'を', 'に'], 2, 'Câu nghĩa là: Đây là cặp của thầy/cô giáo. の nối hai danh từ, mẫu N1 の N2 nghĩa là N2 của N1: 先生の かばん. は là trợ từ chủ đề, を đánh dấu tân ngữ của động từ, に chỉ nơi hoặc thời điểm, đều không nối hai danh từ để chỉ sở hữu.'),
            Q('わたしは 日本語（　　）べんきょうして います。', ['が', 'に', 'を', 'で'], 3, 'Câu nghĩa là: Tôi đang học tiếng Nhật. べんきょうする là hành động tác động lên 日本語, nên tân ngữ dùng を. が thường dùng cho chủ ngữ hoặc đi với すき, わかる. に chỉ đích đến hoặc thời điểm. で chỉ nơi diễn ra hành động hoặc phương tiện.'),
            Q('駅（　　）会社まで 電車で 十分です。', ['から', 'で', 'に', 'と'], 1, 'Câu nghĩa là: Từ ga đến công ty đi bằng tàu điện mất 10 phút. Mẫu N1 から N2 まで nghĩa là từ N1 đến N2, から đi cặp với まで. で chỉ phương tiện hoặc nơi, に chỉ đích đến, と là cùng với; không cái nào đi cặp với まで để chỉ điểm xuất phát.'),
            Q('いすの 上（　　）本が あります。', ['に', 'を', 'で', 'と'], 1, 'Câu nghĩa là: Trên ghế có quyển sách. Mẫu N (nơi chốn) に N が あります chỉ nơi tồn tại của vật. で chỉ nơi diễn ra hành động (như 本を 読みます), không dùng với あります. を đánh dấu tân ngữ, と là và/cùng, không chỉ nơi chốn.'),
            Q('きのう、先生（　　）話しました。', ['と', 'を', 'が', 'の'], 1, 'Câu nghĩa là: Hôm qua tôi đã nói chuyện với thầy. Mẫu N と 話します nghĩa là nói chuyện cùng N, と chỉ người cùng làm hành động. を, が, の không tạo nghĩa nói chuyện với ai: を là tân ngữ, が là chủ ngữ, の nối hai danh từ.'),
            Q('ここで しゃしんを とっても （　　）ですか。', ['いい', 'いく', 'いえ', 'いて'], 1, 'Câu nghĩa là: Chụp ảnh ở đây có được không? Mẫu V てもいいですか nghĩa là làm V có được không, dùng để xin phép. いく (đi), いえ (nhà, hoặc cách nói không) và いて (thể て của いる) không tạo thành mẫu xin phép với ても.'),
            Q('A「きのう、えいがを 見ましたか。」B「いいえ、見（　　）。」', ['ません', 'ませんでした', 'ないです', 'ませんです'], 2, 'A: Hôm qua anh có xem phim không? B: Không, tôi không xem. Câu hỏi ở thì quá khứ nên trả lời phủ định quá khứ lịch sự là 見ませんでした. 見ません là phủ định hiện tại, sai thì. 見ないです là dạng thân mật. 見ませんです không tồn tại.'),
            Q('わたしは 小さい ねこが （　　）。', ['います', 'あります', 'です', 'します'], 1, 'Câu nghĩa là: Tôi có một con mèo nhỏ. Mẫu N1 は N2 が います nghĩa là có N2 (người, động vật); mèo là động vật nên dùng います. あります dùng cho đồ vật. です nghĩa là là, します là làm, không diễn đạt nghĩa có.'),
            Q('ごはんを 食べる（　　）、手を あらいます。', ['前に', '後で', '時', 'から'], 1, 'Câu nghĩa là: Trước khi ăn cơm thì rửa tay. Mẫu V (thể từ điển) まえに nghĩa là trước khi V: 食べる前に. 後で phải đi với thể た (食べた後で) nên sai dạng. 時 (khi) và から (vì, sau khi) không diễn đạt rõ thứ tự trước và sau như 前に.'),
            Q('この 電車は 大学（　　）行きますか。', ['は', 'へ', 'を', 'が'], 2, 'Câu nghĩa là: Tàu điện này có đi đến trường đại học không? Hướng di chuyển dùng へ (đọc là え khi làm trợ từ): 大学へ 行きます. は là trợ từ chủ đề, を đánh dấu tân ngữ, が đánh dấu chủ ngữ, đều không chỉ đích đến của 行きます.'),
            Q('この まちは しずか（　　）まちです。', ['な', 'の', 'で', 'い'], 1, 'Câu nghĩa là: Thị trấn này là một thị trấn yên tĩnh. しずか là tính từ đuôi な, khi bổ nghĩa cho danh từ thì thêm な: しずかな まち. の nối danh từ với danh từ, で là dạng nối câu, い chỉ dùng với tính từ đuôi い như 大きい まち.'),
            Q('きょうは あまり さむく（　　）。', ['ありません', 'ありませんでした', 'ですか', 'ます'], 1, 'Câu nghĩa là: Hôm nay không lạnh lắm. あまり đi với phủ định. さむい là tính từ đuôi い, phủ định hiện tại là bỏ い thêm くありません: さむく ありません. ありませんでした là phủ định quá khứ nên sai thì. ですか và ます không nối được sau さむく.'),
            Q('先生に 日本語を おしえて （　　）。', ['もらいました', 'あげました', 'くれました', 'ください'], 1, 'Câu nghĩa là: Tôi được thầy dạy tiếng Nhật. Mẫu N に V てもらいます nghĩa là được N làm cho: 先生に おしえて もらいました. くれました cần người cho làm chủ ngữ với が (先生が おしえて くれました). あげました nghĩa là tôi làm cho người khác, và ください là nhờ vả, đều không hợp nghĩa câu.'),
            Q('ここに 名前を （　　）ください。', ['書いて', '書く', '書き', '書いた'], 1, 'Câu nghĩa là: Hãy viết tên vào đây. Mẫu V て ください nghĩa là hãy làm V, dùng thể て: 書いて ください. 書く là thể từ điển, 書き là thể ます bỏ ます, 書いた là thể た; ba dạng này không đi trực tiếp với ください.'),
            Q('いっしょに えいがを 見（　　）か。', ['ませんか', 'ましたか', 'ませんでしたか', 'ませんね'], 1, 'Câu nghĩa là: Cùng xem phim với tôi không? Mẫu V ませんか dùng để rủ rê lịch sự. ましたか là hỏi đã xem chưa (quá khứ), ませんでしたか là hỏi đã không xem à (quá khứ). ませんね kết thúc bằng ね rồi lại thêm か nên không thành câu đúng.'),
            Q('六時（　　）おきます。', ['に', 'を', 'で', 'が'], 1, 'Câu nghĩa là: Tôi dậy lúc 6 giờ. Thời điểm cụ thể (có con số như giờ, ngày, tháng) dùng に: 六時に おきます. を cần tân ngữ nhưng おきます không có tân ngữ. で chỉ nơi hoặc phương tiện. が là chủ ngữ, không dùng sau từ chỉ giờ.'),
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
            Q('あの ＿ ＿ ★ ＿ 先生です。', ['本を', '読んで', 'いる', '人は'], 3, 'Câu đúng: あの 本を 読んで いる 人は 先生です (Người đang đọc quyển sách kia là giáo viên). Cụm 本を 読んで いる bổ nghĩa cho 人 đứng sau nên thứ tự là 本を, 読んで, いる, 人は. Vị trí ★ (thứ ba) là いる, tạo thành 読んで いる (đang đọc).'),
            Q('わたしは ＿ ＿ ★ ＿ 行きました。', ['先週の', '日よう日に', 'デパートへ', 'かいものに'], 3, 'Câu đúng: わたしは 先週の 日よう日に デパートへ かいものに 行きました (Chủ nhật tuần trước tôi đã đi cửa hàng bách hóa để mua sắm). Thứ tự: thời gian 先週の 日よう日に, nơi đến デパートへ, mục đích かいものに, rồi 行きました. Ô ★ là デパートへ.'),
            Q('わたしの うちは ＿ ＿ ★ ＿ あります。', ['駅から', 'あるいて', '五分の', 'ところに'], 3, 'Câu đúng: わたしの うちは 駅から あるいて 五分の ところに あります (Nhà tôi ở nơi đi bộ từ ga mất 5 phút). 駅から あるいて là đi bộ từ ga, 五分の bổ nghĩa cho ところ, ところに あります chỉ vị trí. Ô ★ (thứ ba) là 五分の.'),
            Q('すみません、＿ ＿ ★ ＿ ください。', ['その', '大きい', 'かばんを', '見せて'], 3, 'Câu đúng: すみません、その 大きい かばんを 見せて ください (Xin lỗi, cho tôi xem cái cặp lớn đó). その đứng trước 大きい rồi đến danh từ かばんを, cuối cùng là 見せて ください (xin hãy cho xem). Ô ★ (thứ ba) là かばんを.'),
            Q('ここから ＿ ＿ ★ ＿ かかります。', ['駅まで', 'あるいて', '十分', 'ぐらい'], 3, 'Câu đúng: ここから 駅まで あるいて 十分 ぐらい かかります (Từ đây đi bộ đến ga mất khoảng 10 phút). Thứ tự: 駅まで, あるいて (cách đi), 十分 (số lượng thời gian), ぐらい (khoảng, đi sau số lượng), rồi かかります (mất). Ô ★ là 十分.'),
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
            'わたしの 母は 先生です。まいにち、うち【1】出て、学校へ 行きます。\n学校は 駅から ちかいです。【2】、母は 電車に のりません。あるいて 行きます。母は 学生に 日本語を おしえて【3】。\n日よう日は 学校が 休みです。母は 日よう日に 父【4】かいものに 行きます。わたしは 日よう日に うちで 本を 読んだり、テレビを 見たり【5】。',
          passageVi:
            'Mẹ tôi là giáo viên. Mỗi ngày mẹ ra khỏi nhà và đến trường. Trường gần ga. Vì vậy mẹ không đi tàu mà đi bộ. Mẹ dạy tiếng Nhật cho học sinh. Chủ nhật trường nghỉ. Chủ nhật mẹ đi mua sắm với bố. Chủ nhật tôi ở nhà đọc sách, xem ti vi.',
          questions: [
            Q('【1】に はいる ものは どれですか。', ['に', 'を', 'で', 'と'], 2, 'Câu: まいにち、うちを 出て、学校へ 行きます (Mỗi ngày mẹ ra khỏi nhà rồi đến trường). 出る là rời khỏi, nơi bị rời khỏi dùng を: うちを 出る. に chỉ đích đến hoặc thời điểm, で chỉ nơi diễn ra hành động, と là cùng với, đều không hợp với 出る ở đây.'),
            Q('【2】に はいる ものは どれですか。', ['ですから', 'でも', 'それから', 'また'], 1, 'Câu trước: Trường gần ga (lý do). Câu sau: Mẹ không đi tàu, đi bộ (kết quả). Nối lý do với kết quả dùng ですから (vì vậy). でも là nhưng (trái ngược). それから là sau đó (hành động nối tiếp). また là hơn nữa, lại (thêm ý cùng chiều), không nối lý do với kết quả.'),
            Q('【3】に はいる ものは どれですか。', ['います', 'あります', 'なります', 'できます'], 1, 'Câu: 母は 学生に 日本語を おしえて います (Mẹ dạy tiếng Nhật cho học sinh). Mẫu V て います diễn tả hành động hoặc công việc diễn ra thường xuyên. あります, なります (trở thành), できます (có thể) không ghép sau おしえて thành câu đúng nghĩa.'),
            Q('【4】に はいる ものは どれですか。', ['に', 'が', 'と', 'を'], 3, 'Câu: 母は 日よう日に 父と かいものに 行きます (Chủ nhật mẹ đi mua sắm cùng bố). と nghĩa là cùng với, chỉ người cùng làm hành động. に, が, を không diễn đạt nghĩa cùng với: 母は đã là chủ đề nên が không cần, 父 cũng không phải đối tượng bị tác động nên không dùng を.'),
            Q('【5】に はいる ものは どれですか。', ['します', 'です', 'います', 'あります'], 1, 'Câu: 本を 読んだり、テレビを 見たり します (lúc thì đọc sách, lúc thì xem ti vi). Mẫu V たり、V たり します dùng liệt kê vài hoạt động tiêu biểu, cuối câu luôn là します. です, います, あります không kết hợp với たり theo cách này.'),
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
            Q('わたしは 三時ごろ 何を しましたか。', ['うちで 本を 読みました。', '店で コーヒーを 飲みました。', '電車に のりました。', '学校へ 行きました。'], 2, 'Căn cứ trong bài: 三時ごろ、ともだちと 駅の 前の 店で コーヒーを 飲みました (khoảng 3 giờ tôi uống cà phê với bạn ở quán trước ga). 本を 読みました có trong bài nhưng xảy ra buổi sáng sau khi dậy, không phải lúc 3 giờ. 電車に のりました và 学校へ 行きました không có trong bài.', {
              passage: 'きょうは 日よう日です。わたしは あさ 九時に おきました。それから、うちで 本を 読みました。\n三時ごろ、ともだちと 駅の 前の 店で コーヒーを 飲みました。',
              passageVi: 'Hôm nay là Chủ nhật. Sáng tôi dậy lúc 9 giờ. Sau đó tôi đọc sách ở nhà. Khoảng 3 giờ tôi uống cà phê với bạn ở quán trước ga.',
            }),
            Q('あした、二人は どこで 会いますか。', ['学校の 前', '駅の 前', '会社の 前', '店の 前'], 2, 'Căn cứ trong thư: あした、駅の 前で 会いましょう (ngày mai gặp nhau trước ga nhé), lúc 10 giờ. 電車 và バス chỉ là phương tiện mỗi người đi đến, không phải nơi gặp. 学校の 前, 会社の 前, 店の 前 không được nhắc đến trong thư.', {
              passage: 'キムさんへ\nあした、駅の 前で 会いましょう。時間は 十時です。\nわたしは 電車で 行きます。キムさんは バスで 来て ください。\nミラー',
              passageVi: 'Gửi Kim. Ngày mai chúng ta gặp nhau trước ga nhé. Thời gian là 10 giờ. Tôi sẽ đi bằng tàu điện. Kim hãy đi bằng xe buýt đến nhé. Miller.',
            }),
            Q('としょかんは 水よう日に 何時までですか。', ['四時', '五時', '九時', '十時'], 2, 'Căn cứ trong thông báo: 火よう日から 金よう日は 九時から 五時まで (thứ Ba đến thứ Sáu mở từ 9 giờ đến 5 giờ). Thứ Tư nằm trong khoảng này nên thư viện đóng cửa lúc 5 giờ. 九時 là giờ mở cửa, còn 四時 và 十時 là giờ của thứ Bảy và Chủ nhật.', {
              passage: 'おしらせ\nとしょかんは 月よう日が 休みです。\n火よう日から 金よう日は 九時から 五時までです。\n土よう日と 日よう日は 十時から 四時までです。',
              passageVi: 'Thông báo: Thư viện nghỉ vào thứ Hai. Từ thứ Ba đến thứ Sáu mở từ 9 giờ đến 5 giờ. Thứ Bảy và Chủ nhật mở từ 10 giờ đến 4 giờ.',
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
            Q('父は 何を 食べましたか。', ['さかなだけ', 'にくだけ', 'さかなと にく', '何も 食べませんでした'], 3, 'Căn cứ trong bài: Bố nói さかなも にくも すきです (thích cả cá lẫn thịt) rồi 二つ 食べました (ăn cả hai món), tức là cá và thịt. さかなだけ là món của người viết, にくだけ là món của mẹ, còn 何も 食べませんでした trái với bài vì bố đã ăn.', {
              passage:
                'きのう、わたしは 父と 母と 三人で 新しい レストランへ 行きました。その 店は 駅の ちかくに あります。店の 中は 大きくて、きれいでした。\nわたしは さかなを 食べました。母は にくを 食べました。父は「さかなも にくも すきです」と いって、二つ 食べました。\nぜんぶ おいしかったです。ですから、また 行きたいです。',
              passageVi:
                'Hôm qua tôi cùng bố mẹ, ba người, đến một nhà hàng mới. Quán ở gần ga. Bên trong quán rộng và sạch. Tôi ăn cá. Mẹ ăn thịt. Bố nói "Con thích cả cá lẫn thịt" rồi gọi cả hai món. Món nào cũng ngon. Vì vậy tôi muốn đến lần nữa.',
            }),
            Q('わたしは いつ 会社で はたらきますか。', ['月よう日と 水よう日', '火よう日と 木よう日', '金よう日', '土よう日と 日よう日'], 2, 'Căn cứ trong bài: 火よう日と 木よう日は 会社で はたらきます (thứ Ba và thứ Năm làm việc ở công ty). Thứ Hai và thứ Tư là học tiếng Nhật ở đại học, thứ Sáu nghỉ, thứ Bảy đi mua sắm với mẹ, Chủ nhật nghỉ ở nhà.', {
              passage:
                'わたしの 一週間\n月よう日と 水よう日は 大学で 日本語を べんきょうします。\n火よう日と 木よう日は 会社で はたらきます。金よう日は 休みです。\n土よう日は 母と かいものに 行きます。日よう日は うちで 休みます。',
              passageVi:
                'Một tuần của tôi. Thứ Hai và thứ Tư tôi học tiếng Nhật ở trường đại học. Thứ Ba và thứ Năm tôi làm việc ở công ty. Thứ Sáu được nghỉ. Thứ Bảy tôi đi mua sắm với mẹ. Chủ nhật tôi nghỉ ngơi ở nhà.',
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
            Q('ミラーさんは 月よう日から 金よう日まで 会社で はたらいて います。会社は 五時に おわります。土よう日は 休みです。一か月 三百円までの クラスに 行きたいです。どの クラスに 行きますか。', ['Aクラス', 'Bクラス', 'Cクラス', 'どの クラスにも 行けません'], 3, 'Điều kiện: Miller đi làm từ thứ Hai đến thứ Sáu đến 5 giờ, thứ Bảy nghỉ, học phí tối đa 300 yên mỗi tháng. Lớp A (thứ Hai, thứ Tư, 400 yên) trùng giờ làm và vượt 300 yên. Lớp B (thứ Ba, thứ Sáu, từ 3 giờ) đúng 300 yên nhưng trùng giờ làm. Lớp C (thứ Bảy, 200 yên) hợp cả hai, nên chọn C.', {
              passage:
                'にほんご クラスの おしらせ\nAクラス：月よう日と 水よう日　十時から 十二時　一か月 四百円\nBクラス：火よう日と 金よう日　三時から 五時　一か月 三百円\nCクラス：土よう日　十時から 十二時　一か月 二百円\nだれでも 見る ことが できます。',
              passageVi:
                'Thông báo lớp tiếng Nhật. Lớp A: thứ Hai và thứ Tư, 10 giờ đến 12 giờ, một tháng 400 yên. Lớp B: thứ Ba và thứ Sáu, 3 giờ đến 5 giờ, một tháng 300 yên. Lớp C: thứ Bảy, 10 giờ đến 12 giờ, một tháng 200 yên. Ai cũng có thể đến xem.',
            }),
          ],
        },
      ],
    },
  ],
};
