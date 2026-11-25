// Bộ đề ÔN TẬP N5 (shard b2): sắp xếp câu, điền vào đoạn văn, đọc hiểu. Mỗi câu thuộc đúng một bài Minna (trường lesson).
// Nội dung ORIGINAL do app soạn, không dùng chữ Hán (mọi chữ Nhật viết bằng kana).
// Quy ước: ＿ là ô trống, ★ là ô cần xác định, 【1】...【5】 là chỗ trống của đoạn văn. answer là số thứ tự (1-4).

const Q = (prompt, choices, answer, explain, extra = {}) => ({ prompt, choices, answer, explain, ...extra });

const INSTR_PASSAGE = '【1】から【5】に なにを いれますか。ぶんしょうの いみを かんがえて、1・2・3・4から いちばん いい ものを ひとつ えらんで ください。';
const INSTR_READ = 'つぎの ぶんしょうを よんで、しつもんに こたえて ください。こたえは、1・2・3・4から いちばん いい ものを ひとつ えらんで ください。';

export default {
  sections: [
    {
      id: 'g2',
      kind: 'bunpou',
      mondai: '問題2',
      title: 'Sắp xếp câu (★)',
      instr: '★に はいる ものは どれですか。1・2・3・4から いちばん いい ものを ひとつ えらんで ください。',
      instrVi: 'Sắp xếp 4 cụm theo đúng thứ tự, chọn cụm nằm ở vị trí ★. Dưới đây hiện 4 cụm cần sắp xếp.',
      sort: true,
      questions: [
        Q('あの ＿ ＿ ★ ＿ ですか。', ['ひとは', 'どこの', 'かいしゃの', 'ひと'], 3, 'Bài 3. Câu đúng: あの ひとは どこの かいしゃの ひとですか (người kia là người của công ty nào?). あの bổ nghĩa cho ひと nên ひとは đứng ngay sau あの làm chủ đề. Sau đó là chuỗi の đi từ xa đến gần: どこの (ở đâu) → かいしゃの (của công ty) → ひと (người). ひとは có は dùng làm chủ đề ở đầu, còn ひと trơn đứng cuối trước ですか. ★ là かいしゃの.', { lesson: 3 }),
        Q('あした いっしょに ＿ ＿ ★ ＿。', ['ミラーさんの', 'うちの', 'にわで', 'ばんごはんを たべませんか'], 3, 'Bài 6. Câu đúng: あした いっしょに ミラーさんの うちの にわで ばんごはんを たべませんか (ngày mai cùng ăn tối ở vườn nhà anh Miller nhé?). ミラーさんの → うちの → にわで là chuỗi の bổ nghĩa (vườn của nhà của Miller), で chỉ nơi diễn ra hành động. Cuối câu là ばんごはんを たべませんか, mẫu V ませんか để rủ rê, vì động từ phải đứng cuối. ★ là にわで.', { lesson: 6 }),
        Q('わたしは ＿ ＿ ★ ＿。', ['ミラーさんの', 'おかあさんの', 'たんじょうびに', 'はなを あげました'], 3, 'Bài 7. Câu đúng: わたしは ミラーさんの おかあさんの たんじょうびに はなを あげました (tôi đã tặng hoa vào sinh nhật mẹ anh Miller). Chuỗi の nối danh từ, rồi N に (thời điểm), cuối cùng N を あげました. ★ là たんじょうびに.', { lesson: 7 }),
        Q('きょうは ＿ ＿ ★ ＿。', ['じかんが', 'ありませんから、', 'えいがに', 'いきません'], 3, 'Bài 9. Câu đúng: きょうは じかんが ありませんから、えいがに いきません (hôm nay không có thời gian nên không đi xem phim). ～から đứng sau vế lý do (じかんが ありません), vế kết quả theo sau. Trong vế kết quả, えいがに いきません: N に いきます là đi đến để làm việc gì (đi xem phim), động từ いきません đứng cuối câu. ★ là えいがに.', { lesson: 9 }),
        Q('えきの ＿ ＿ ★ ＿。', ['まえに', 'ぎんこうや', 'ゆうびんきょくが', 'あります'], 3, 'Bài 10. Câu đúng: えきの まえに ぎんこうや ゆうびんきょくが あります (trước ga có ngân hàng, bưu điện...). えきの まえ là N1の N2 nên まえに đi ngay sau えきの. や dùng để liệt kê vài ví dụ trong nhiều thứ nên ぎんこうや đứng trước ゆうびんきょくが, rồi あります (có, dùng cho vật) ở cuối câu. ★ là ゆうびんきょくが.', { lesson: 10 }),
        Q('くだものの なかで ＿ ＿ ★ ＿。', ['あなたは', 'なにが', 'いちばん', 'すきですか'], 3, 'Bài 12. Câu đúng: くだものの なかで あなたは なにが いちばん すきですか (trong các loại trái cây, bạn thích loại nào nhất?). Mẫu ～の なかで ～が いちばん ～. Thứ tự cố định: chủ đề あなたは, từ để hỏi なにが, いちばん đứng ngay trước tính từ/động từ すきですか. ★ là いちばん.', { lesson: 12 }),
        Q('すみませんが、＿ ＿ ★ ＿ ください。', ['その', 'かばんの', 'なかを', 'みせて'], 3, 'Bài 14. Câu đúng: すみませんが、その かばんの なかを みせて ください (xin lỗi, cho tôi xem bên trong cái túi đó). その đứng trước danh từ nó bổ nghĩa: その かばんの (cái túi đó), rồi かばんの なか là bên trong túi (N1の N2). なかを là tân ngữ của みせて, và V て ください dùng để nhờ vả nên đứng cuối. ★ là なかを.', { lesson: 14 }),
        Q('＿ ＿ ★ ＿ ください。', ['まず', 'おかねを いれて、', 'つぎに', 'ボタンを おして'], 3, 'Bài 16. Câu đúng: まず おかねを いれて、つぎに ボタンを おして ください (trước hết bỏ tiền vào, tiếp theo bấm nút). Các thao tác nối nhau bằng thể て, mỗi vế dùng まず (trước hết) rồi つぎに (tiếp theo) để chỉ thứ tự. Chỉ động từ cuối cùng mới đi với ください. Vì vậy おかねを いれて、 đứng trước つぎに. ★ là つぎに.', { lesson: 16 }),
        Q('わたしの しゅみは ＿ ＿ ★ ＿ です。', ['ふるい', 'えいがを', 'みる', 'こと'], 3, 'Bài 18. Câu đúng: わたしの しゅみは ふるい えいがを みる ことです (sở thích của tôi là xem phim cũ). Mẫu しゅみは V thể từ điển ことです: động từ ở dạng từ điển rồi mới đến こと. ふるい (cũ) là tính từ い bổ nghĩa えいが, nên thứ tự ふるい → えいがを → みる → こと. ★ là みる.', { lesson: 18 }),
        Q('きのうは ねつが あったから、＿ ＿ ★ ＿。', ['かいしゃを', 'やすんで', 'びょういんへ', 'いった'], 3, 'Bài 20. Câu đúng: きのうは ねつが あったから、かいしゃを やすんで びょういんへ いった (hôm qua vì bị sốt nên tôi nghỉ làm rồi đi bệnh viện). Văn thông thường: あった, いった. かいしゃを やすんで (nghỉ làm) đứng trước, rồi đến nơi đi びょういんへ và động từ いった ở cuối câu. ★ là びょういんへ.', { lesson: 20 }),
      ],
    },
    {
      id: 'g3',
      kind: 'bunpou',
      mondai: '問題3',
      title: 'Điền vào đoạn văn (1)',
      instr: INSTR_PASSAGE,
      instrVi: 'Đọc đoạn văn và chọn từ thích hợp cho từng chỗ trống 【1】 đến 【5】.',
      passage:
        'わたしの まいにちを はなします。\nわたしは まいあさ ろくじ【1】おきます。うちから かいしゃまで でんしゃ【2】いきます。\nわたしの かいしゃは きれい【3】かいしゃです。しごとは ごじに おわります。\nあしたは しごとが ありません【4】、ともだちと テニスを します。ともだちは【5】きます。',
      passageVi:
        'Tôi kể về mỗi ngày của mình. Mỗi sáng tôi dậy lúc 6 giờ. Từ nhà đến công ty tôi đi bằng tàu điện. Công ty tôi là một công ty sạch đẹp. Công việc kết thúc lúc 5 giờ. Ngày mai không có việc nên tôi sẽ chơi tennis với bạn. Bạn sẽ đến ba người.',
      questions: [
        Q('【1】に はいる ものは どれですか。', ['で', 'に', 'から', 'を'], 2, 'Bài 4. Câu 「わたしは まいあさ ろくじ【1】おきます」 (mỗi sáng tôi dậy lúc 6 giờ). Trợ từ に đứng sau thời điểm cụ thể (giờ giấc) để nói hành động xảy ra lúc đó. で chỉ nơi chốn hoặc phương tiện, を chỉ tân ngữ (おきます không có tân ngữ), còn から nghĩa là từ lúc nào đó, không diễn tả thời điểm dậy, nên đều không hợp.', { lesson: 4 }),
        Q('【2】に はいる ものは どれですか。', ['に', 'を', 'で', 'と'], 3, 'Bài 5. Câu 「うちから かいしゃまで でんしゃ【2】いきます」 (từ nhà đến công ty đi bằng tàu điện). N で いきます nghĩa là đi bằng phương tiện N nên chọn で. に chỉ nơi đến hoặc thời điểm, を là tân ngữ, đều không dùng cho phương tiện. と nghĩa là cùng với, chỉ đi với người (ともだちと いきます), tàu điện không phải người đi cùng.', { lesson: 5 }),
        Q('【3】に はいる ものは どれですか。', ['の', 'な', 'い', 'に'], 2, 'Bài 8. Câu 「わたしの かいしゃは きれい【3】かいしゃです」 (công ty tôi là một công ty sạch đẹp). きれい là tính từ な (dù đuôi là い), khi đứng trước danh từ phải thêm な: きれいな かいしゃ. い chỉ thêm vào tính từ い thật (たかい かいしゃ), の dùng nối danh từ với danh từ, còn きれいに là phó từ (một cách sạch sẽ), không bổ nghĩa cho danh từ.', { lesson: 8 }),
        Q('【4】に はいる ものは どれですか。', ['から', 'まで', 'より', 'も'], 1, 'Bài 9. Câu 「あしたは しごとが ありません【4】、ともだちと テニスを します」 (ngày mai không có việc nên chơi tennis với bạn). ～から đứng sau vế lý do, vế sau là kết quả. まで nghĩa là đến (ごじまで), より dùng so sánh (A は B より ～), も nghĩa là cũng và gắn vào danh từ, đều không nối được hai vế lý do và kết quả.', { lesson: 9 }),
        Q('【5】に はいる ものは どれですか。', ['みっつ', 'さんまい', 'さんにん', 'さんぼん'], 3, 'Bài 11. Câu 「ともだちは【5】きます」 (bạn sẽ đến ... người). Đếm người dùng ～にん: ひとり, ふたり, さんにん (3 người). みっつ là cách đếm đồ vật chung, ～まい đếm vật mỏng và phẳng (giấy, vé, áo), ～ほん đếm vật dài (bút, chai, cây, đọc là さんぼん sau số 3), nên cả ba không dùng cho người.', { lesson: 11 }),
      ],
    },
    {
      id: 'g4',
      kind: 'bunpou',
      mondai: '問題3',
      title: 'Điền vào đoạn văn (2)',
      instr: INSTR_PASSAGE,
      instrVi: 'Đọc đoạn văn và chọn từ thích hợp cho từng chỗ trống 【1】 đến 【5】.',
      passage:
        'きょうは ミラーさんの たんじょうびです。ミラーさんの うちで パーティーが あります。\nわたしは えきの まえで ともだちを まって【1】。ともだちが きて【2】、いっしょに ミラーさんの うちへ いきます。\nミラーさんは にほんの うたを うたう【3】が できます。ミラーさんは きのう「ごご ろくじに きて ください」【4】いいました。\nミラーさんが きのう【5】ケーキは とても おいしいでしょう。',
      passageVi:
        'Hôm nay là sinh nhật anh Miller. Có tiệc ở nhà anh Miller. Tôi đang đợi bạn ở trước ga. Sau khi bạn đến, chúng tôi sẽ cùng đến nhà anh Miller. Anh Miller có thể hát bài hát Nhật. Hôm qua anh Miller đã nói "Hãy đến lúc 6 giờ chiều". Chiếc bánh anh Miller làm hôm qua chắc là rất ngon.',
      questions: [
        Q('【1】に はいる ものは どれですか。', ['ました', 'います', 'ください', 'あります'], 2, 'Bài 14. Câu 「えきの まえで ともだちを まって【1】」 (tôi đang đợi bạn ở trước ga). V て います diễn tả hành động đang diễn ra: まって います. まって ください là hãy đợi (nhờ người khác), không hợp câu kể về mình. V て あります chỉ trạng thái còn lại sau hành động có chủ ý (まどが あけて あります), không dùng với まつ. ました không gắn ngay sau thể て (quá khứ phải là まちました).', { lesson: 14 }),
        Q('【2】に はいる ものは どれですか。', ['まえに', 'あとで', 'から', 'ので'], 3, 'Bài 16. Câu 「ともだちが きて【2】、いっしょに ミラーさんの うちへ いきます」 (sau khi bạn đến, chúng tôi cùng đến nhà anh Miller). V て から nghĩa là sau khi làm V thì làm việc tiếp theo. まえに đi với thể từ điển (いく まえに), あとで đi với thể た (きた あとで), còn ので nêu lý do và đi với thể thông thường, không đi ngay sau thể て.', { lesson: 16 }),
        Q('【3】に はいる ものは どれですか。', ['もの', 'ひと', 'こと', 'ところ'], 3, 'Bài 18. Câu 「にほんの うたを うたう【3】が できます」 (có thể hát bài hát Nhật). Mẫu V thể từ điển ことが できます nghĩa là có thể làm V, こと biến động từ thành danh từ. もの (đồ vật), ひと (người), ところ (nơi chốn) chỉ làm ra cụm như thứ/người/nơi để hát, không tạo thành mẫu diễn tả khả năng.', { lesson: 18 }),
        Q('【4】に はいる ものは どれですか。', ['で', 'と', 'が', 'に'], 2, 'Bài 21. Câu 「ミラーさんは きのう「ごご ろくじに きて ください」【4】いいました」 (hôm qua anh Miller đã nói hãy đến lúc 6 giờ chiều). Lời nói trích dẫn đứng trước と rồi mới đến いいました: 「～」と いいます. で chỉ phương tiện hoặc nơi chốn, が chỉ chủ ngữ, に chỉ người nghe (ともだちに いいました), không đặt ngay sau lời trích dẫn.', { lesson: 21 }),
        Q('【5】に はいる ものは どれですか。', ['つくる', 'つくって', 'つくります', 'つくった'], 4, 'Bài 22. Mệnh đề bổ nghĩa danh từ dùng thể thông thường: ミラーさんが きのう つくった ケーキ (bánh anh Miller làm hôm qua). Có きのう nên phải dùng thể quá khứ つくった, không dùng つくる, つくります hay thể て.', { lesson: 22 }),
      ],
    },
    {
      id: 'd4',
      kind: 'dokkai',
      mondai: '問題4',
      title: 'Đọc hiểu đoạn ngắn',
      instr: INSTR_READ,
      instrVi: 'Đọc đoạn văn ngắn rồi trả lời câu hỏi.',
      questions: [
        Q('にほんの くつは いくらですか。', ['さんぜんえん', 'ごせんえん', 'さんまんえん', 'ごまんえん'], 1, 'Bài 3. Câu hỏi là giá giày của Nhật. Đoạn văn nói あれは にほんの くつです。さんぜんえんです (đôi giày Nhật giá 3.000 yên). Cần phân biệt đơn vị: せん là nghìn, まん là mười nghìn. ごまんえん (50.000 yên) là giá giày Ý, ごせんえん là 5.000 yên và さんまんえん là 30.000 yên, đều là số bị nhầm chữ số hoặc đơn vị, không có trong bài.', {
          lesson: 3,
          passage: 'これは イタリアの くつです。ごまんえんです。\nあれは にほんの くつです。さんぜんえんです。',
          passageVi: 'Đây là giày của Ý. Giá 50.000 yên. Kia là giày của Nhật. Giá 3.000 yên.',
        }),
        Q('ワンさんは だれと きょうとへ いきますか。', ['ひとりで', 'ともだちと', 'せんせいと', 'かぞくと'], 4, 'Bài 5. Câu hỏi là anh Wang đi Kyoto với ai. Đoạn văn nói ともだちは いきません (bạn không đi) và かぞくと しんかんせんで いきます (đi cùng gia đình bằng tàu Shinkansen). N と いきます là đi cùng ai nên chọn かぞくと. しんかんせんで là phương tiện chứ không phải người đi cùng. ひとりで (một mình) trái với bài, せんせいと không được nhắc.', {
          lesson: 5,
          passage: 'ワンさんは らいしゅうの どようびに きょうとへ いきます。ともだちは いきません。かぞくと しんかんせんで いきます。',
          passageVi: 'Anh Wang thứ Bảy tuần sau sẽ đi Kyoto. Bạn không đi. Anh đi cùng gia đình bằng tàu Shinkansen.',
        }),
        Q('ははは わたしから なにを もらいましたか。', ['はな', 'かばん', 'ネクタイ', 'くつ'], 1, 'Bài 7. Câu hỏi là mẹ nhận được gì từ người viết. Đoạn văn nói わたしは ははに はなを あげました (tôi tặng mẹ hoa), nên mẹ nhận はな. あげます (tặng) nhìn từ người cho, もらいます (nhận) nhìn từ người nhận, cùng một sự việc. かばん là quà của bố (ちちは ははに かばんを あげました), ネクタイ và くつ không xuất hiện.', {
          lesson: 7,
          passage: 'きのうは ははの たんじょうびでした。わたしは ははに はなを あげました。ちちは ははに かばんを あげました。',
          passageVi: 'Hôm qua là sinh nhật mẹ. Tôi đã tặng mẹ hoa. Bố đã tặng mẹ chiếc túi.',
        }),
        Q('どうして きょうは おさけを のみませんか。', ['テニスが きらいですから', 'サッカーが へたですから', 'おさけが すきじゃ ありませんから', 'あした テニスを しますから'], 4, 'Bài 9. Lý do đứng trước から: あした ともだちと テニスを しますから、きょうは おさけを のみません (vì mai chơi tennis với bạn nên hôm nay không uống rượu), đáp án 4. Đáp án 1 sai vì người viết giỏi tennis, không ghét. Đáp án 2 chỉ là bóng đá kém (サッカーは へた), không liên quan rượu. Đáp án 3 sai vì bài không nói ghét rượu.', {
          lesson: 9,
          passage: 'わたしは スポーツが すきです。テニスは じょうずですが、サッカーは へたです。\nあした ともだちと テニスを しますから、きょうは おさけを のみません。',
          passageVi: 'Tôi thích thể thao. Tennis thì giỏi nhưng bóng đá thì kém. Vì ngày mai chơi tennis với bạn nên hôm nay tôi không uống rượu.',
        }),
        Q('わたしの かぞくは ぜんぶで なんにんですか。', ['さんにん', 'よにん', 'ごにん', 'ろくにん'], 3, 'Bài 11. Đếm từng người trong đoạn: ちち (1), はは (1), あにが ふたり (2 anh trai), わたし (1), tổng cộng 5 người là ごにん. Bẫy là あにが ふたり: ふたり là 2 người, nếu tính anh trai là 1 người sẽ ra 4 (よにん), nếu bỏ sót anh trai sẽ ra 3 (さんにん). ろくにん (6) nhiều hơn số người trong bài.', {
          lesson: 11,
          passage: 'わたしの かぞくは ちちと ははと あにが ふたりと わたしです。',
          passageVi: 'Gia đình tôi gồm bố, mẹ, hai anh trai và tôi.',
        }),
        Q('わたしは デパートで なにが ほしいですか。', ['くつ', 'かばん', 'シャツ', 'とけい'], 1, 'Bài 13. Câu hỏi là người viết muốn gì ở cửa hàng bách hóa. Đoạn văn nói あたらしい くつが ほしいです (muốn có đôi giày mới). N が ほしいです là muốn có N. かばんは ほしくないです (không muốn túi, ほしい chia phủ định thành ほしくない). シャツ và とけい không được nhắc đến trong bài.', {
          lesson: 13,
          passage: 'きょうは にちようびです。わたしは デパートへ かいものに いきます。あたらしい くつが ほしいです。かばんは ほしくないです。それから、レストランで ひるごはんを たべたいです。',
          passageVi: 'Hôm nay là Chủ nhật. Tôi đi mua sắm ở cửa hàng bách hóa. Tôi muốn có đôi giày mới. Túi thì tôi không muốn. Sau đó tôi muốn ăn trưa ở nhà hàng.',
        }),
        Q('としょかんで してもいい ことは どれですか。', ['ごはんを たべる', 'でんわを する', 'ねる', 'ほんを よむ'], 4, 'Bài 15. V ても いいです là được phép, V ては いけません là cấm. Bài nói ほんを よんでも いいです (được đọc sách), còn ごはんを たべては いけません (cấm ăn cơm) và でんわも しては いけません (cũng cấm gọi điện thoại). Bài không nhắc gì đến việc ngủ (ねる), nên không thể nói là được phép. Đáp án 4.', {
          lesson: 15,
          passage: 'ここは としょかんです。ほんを よんでも いいです。でも、ここで ごはんを たべては いけません。でんわも しては いけません。',
          passageVi: 'Đây là thư viện. Được đọc sách. Nhưng không được ăn cơm ở đây. Cũng không được gọi điện thoại.',
        }),
        Q('あしたの しけんに もって こなくても いい ものは どれですか。', ['じしょ', 'ペン', 'ノート', 'かさ'], 1, 'Bài 17. V なければ なりません là phải làm, V なくても いいです là không cần làm. Bài nói ペンと ノートを もって こなければ なりません (phải mang bút và vở) và じしょは もって こなくても いいです (từ điển thì không cần mang). Bút và vở là đồ bắt buộc nên loại, かさ (ô) không được nhắc đến. Đáp án 1.', {
          lesson: 17,
          passage: 'あしたの しけんの おしらせ。くるまで こないで ください。でんしゃか バスで きて ください。ペンと ノートを もって こなければ なりません。じしょは もって こなくても いいです。',
          passageVi: 'Thông báo về kỳ thi ngày mai. Xin đừng đến bằng ô tô. Hãy đến bằng tàu điện hoặc xe buýt. Phải mang bút và vở. Từ điển thì không cần mang.',
        }),
        Q('ともだちに ついて、ただしい ものは どれですか。', ['ふじさんに のぼった ことが あります。', 'ふじさんが きらいです。', 'ふじさんに まだ のぼった ことが ありません。', 'ふじさんの ちかくに すんで います。'], 3, 'Bài 19. V た ことが あります là đã từng, ありません là chưa từng. Bài nói ともだちは まだ のぼった ことが ありません (bạn chưa từng leo núi Phú Sĩ). Người đã từng leo là người viết, không phải bạn nên đáp án 1 sai. Bài không nói bạn ghét núi Phú Sĩ hay sống gần núi, nên 2 và 4 cũng sai.', {
          lesson: 19,
          passage: 'わたしは なつやすみに ふじさんに のぼった ことが あります。とても たのしかったです。ともだちは まだ のぼった ことが ありません。らいねん ともだちと いっしょに のぼりたいです。',
          passageVi: 'Tôi đã từng leo núi Phú Sĩ vào kỳ nghỉ hè. Rất vui. Bạn tôi thì chưa từng leo. Năm sau tôi muốn leo cùng bạn.',
        }),
      ],
    },
    {
      id: 'd5',
      kind: 'dokkai',
      mondai: '問題5',
      title: 'Đọc hiểu đoạn vừa',
      instr: INSTR_READ,
      instrVi: 'Đọc đoạn văn vừa rồi trả lời câu hỏi.',
      questions: [
        Q('この ひとは うちへ なんじに かえりましたか。', ['くじ', 'じゅうにじ', 'ごじ', 'よじ'], 4, 'Bài 20. Câu hỏi là người này về nhà lúc mấy giờ. Đoạn nhật ký viết bằng thể thông thường, có câu よじに うちへ かえった (về nhà lúc 4 giờ), 4 giờ đọc đặc biệt là よじ. くじ (9 giờ) là giờ dậy (あさ くじに おきた). じゅうにじ và ごじ không có trong bài.', {
          lesson: 20,
          passage:
            'きょうは にちようびだった。あさ くじに おきた。てんきが よかったから、ともだちと こうえんへ いった。こうえんで サッカーを した。ともだちは サッカーが とても じょうずだ。わたしは あまり じょうずじゃない。でも、たのしかった。よじに うちへ かえった。つかれたから、すぐ ねた。',
          passageVi:
            'Hôm nay là Chủ nhật. Sáng tôi dậy lúc 9 giờ. Vì trời đẹp nên tôi đến công viên với bạn. Chúng tôi chơi bóng đá ở công viên. Bạn tôi rất giỏi bóng đá. Tôi thì không giỏi lắm. Nhưng rất vui. Tôi về nhà lúc 4 giờ. Vì mệt nên tôi ngủ ngay.',
        }),
        Q('わたしは ともだちに なにを あげますか。', ['ぼうし', 'とけい', 'かばん', 'くつ'], 1, 'Bài 22. Bạn muốn chiếc đồng hồ mới (ともだちが ほしい ものは あたらしい とけい) nhưng đồng hồ đắt (たかいですから) nên người viết mua chiếc mũ bạn thích (ともだちが すきな ぼうし) và sẽ tặng ở bữa tiệc ngày mai. Đồng hồ chỉ là thứ bạn muốn chứ không được mua. かばん và くつ không xuất hiện trong bài.', {
          lesson: 22,
          passage:
            'あしたは ともだちの たんじょうびです。ともだちが ほしい ものは あたらしい とけいです。でも、とけいは たかいですから、わたしは ともだちが すきな ぼうしを かいました。きのう わたしが デパートで かった ぼうしです。あしたの パーティーで ともだちに あげます。',
          passageVi:
            'Ngày mai là sinh nhật bạn tôi. Thứ bạn muốn là chiếc đồng hồ mới. Nhưng đồng hồ đắt nên tôi đã mua chiếc mũ mà bạn thích. Đó là chiếc mũ tôi mua ở cửa hàng bách hóa hôm qua. Tôi sẽ tặng bạn ở bữa tiệc ngày mai.',
        }),
        Q('としょかんは どこに ありますか。', ['ぎんこうの となりに あります。', 'ゆうびんきょくの かどを ひだりへ まがった ところに あります。', 'はしの うえに あります。', 'うちの まえに あります。'], 2, 'Bài 23. Đi thẳng, qua cầu trước ngân hàng thì có bưu điện. ゆうびんきょくの かどを ひだりへ まがると、としょかんが あります (rẽ trái ở góc bưu điện thì có thư viện). Mẫu V と dùng khi đi theo đường thì tới nơi.', {
          lesson: 23,
          passage:
            'わたしの うちの ちかくに としょかんが あります。ひまな ときは、いつも そこへ いきます。この みちを まっすぐ いくと、みぎに ぎんこうが あります。ぎんこうの まえの はしを わたると、ゆうびんきょくが あります。ゆうびんきょくの かどを ひだりへ まがると、としょかんが あります。',
          passageVi:
            'Gần nhà tôi có một thư viện. Khi rảnh tôi luôn đến đó. Đi thẳng con đường này thì bên phải có ngân hàng. Qua cây cầu trước ngân hàng thì có bưu điện. Rẽ trái ở góc bưu điện thì có thư viện.',
        }),
        Q('あした あめが ふったら、わたしは なにを しますか。', ['ともだちと うみへ いきます。', 'うちで ビデオを みます。', 'ともだちと えいがを みに いきます。', 'ともだちの うちへ いきます。'], 2, 'Bài 25. Câu hỏi: nếu mai trời mưa thì người viết làm gì. Bài nói あめが ふったら、うちで ビデオを みます (nếu mưa thì xem video ở nhà). Bạn nói ふっても うみへ いきたい (dù mưa vẫn muốn đi biển), nhưng người viết bị cảm nên nếu mưa thì không đi. Vì vậy đáp án 1 sai, còn đi xem phim và đến nhà bạn không có trong bài.', {
          lesson: 25,
          passage:
            'あしたは にちようびです。てんきが よかったら、わたしは ともだちと うみへ いきます。あめが ふったら、うちで ビデオを みます。ともだちは「あめが ふっても、うみへ いきたいです」と いいます。でも、わたしは かぜを ひいて いますから、あめが ふったら いきません。',
          passageVi:
            'Ngày mai là Chủ nhật. Nếu trời đẹp tôi sẽ đi biển với bạn. Nếu trời mưa tôi sẽ xem video ở nhà. Bạn nói "Dù trời mưa tôi vẫn muốn đi biển". Nhưng tôi đang bị cảm nên nếu trời mưa thì tôi không đi.',
        }),
      ],
    },
    {
      id: 'd6',
      kind: 'dokkai',
      mondai: '問題6',
      title: 'Tìm thông tin',
      instr: INSTR_READ,
      instrVi: 'Đọc thông báo và tìm thông tin phù hợp với điều kiện trong câu hỏi.',
      questions: [
        Q('ワンさんは ほんの みせへ いきます。それから、きっさてんへ いきます。それから、ゆうびんきょくへ いきます。どの じゅんばんで いきますか。', ['さんがい → にかい → いっかい', 'いっかい → にかい → さんがい', 'にかい → さんがい → いっかい', 'にかい → いっかい → さんがい'], 3, 'Bài 10. Tra bảng: ほんの みせ ở にかい (tầng 2), きっさてん ở さんがい (tầng 3), ゆうびんきょく ở いっかい (tầng 1). Đi đúng thứ tự đề bài là tầng 2 → tầng 3 → tầng 1, đáp án 3. Đáp án 1 đi ngược lại, đáp án 2 đi theo thứ tự tầng tăng dần, đáp án 4 đảo thứ tự quán cà phê và bưu điện.', {
          lesson: 10,
          passage: 'みどりビルの あんない\nちかいっかい：スーパー\nいっかい：ぎんこう、ゆうびんきょく\nにかい：ほんの みせ、くつの みせ\nさんがい：レストラン、きっさてん\nよんかい：にほんごの きょうしつ',
          passageVi: 'Hướng dẫn tòa nhà Midori. Tầng hầm 1: siêu thị. Tầng 1: ngân hàng, bưu điện. Tầng 2: cửa hàng sách, cửa hàng giày. Tầng 3: nhà hàng, quán cà phê. Tầng 4: lớp tiếng Nhật.',
        }),
        Q('ワンさんは すいようびの ごごと どようびの ごぜんは しごとです。おかねが ありませんから、ぜろえんの コースに いきます。にほんごを おしえて もらいたいです。どの コースに いきますか。', ['Aコース', 'Bコース', 'Cコース', 'Dコース'], 4, 'Bài 24. Loại A (thứ Tư buổi chiều, đi làm), B (300 yên, có phí), C (dạy đi mua sắm, không phải tiếng Nhật). D dạy tiếng Nhật, thứ Bảy buổi chiều, 0 yên, hợp mọi điều kiện.', {
          lesson: 24,
          passage:
            'にほんごクラブの ごあんない\nボランティアの ひとが てつだって くれます。\nAコース：にほんごを おしえて くれます　すいようび ごご しちじから　ぜろえん\nBコース：にほんごを おしえて くれます　どようび ごぜん じゅうじから　さんびゃくえん\nCコース：かいものを てつだって くれます　どようび ごぜん じゅうじから　ぜろえん\nDコース：にほんごを おしえて くれます　どようび ごご にじから　ぜろえん',
          passageVi:
            'Thông báo của câu lạc bộ tiếng Nhật. Tình nguyện viên sẽ giúp bạn. Lớp A: dạy tiếng Nhật, thứ Tư từ 7 giờ tối, 0 yên. Lớp B: dạy tiếng Nhật, thứ Bảy từ 10 giờ sáng, 300 yên. Lớp C: giúp đi mua sắm, thứ Bảy từ 10 giờ sáng, 0 yên. Lớp D: dạy tiếng Nhật, thứ Bảy từ 2 giờ chiều, 0 yên.',
        }),
      ],
    },
  ],
};
