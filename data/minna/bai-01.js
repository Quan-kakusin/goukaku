// Bài 1 · Chào hỏi · Giới thiệu bản thân
import { ex, quiz } from '../helpers.js';

export default {
  meta: {
    title: 'Chào hỏi · Giới thiệu bản thân',
    jp: 'わたしは マイク・ミラーです。',
    summary: 'Câu danh từ N1 は N2 です, phủ định じゃ ありません, câu hỏi ですか, trợ từ も, の và hậu tố さん.',
    note: 'Nội dung theo giáo trình Minna no Nihongo Sơ cấp 1 (bản tiếng Việt), nhập từ ảnh chụp sách. Có thể còn sai sót khi đối chiếu, hãy kiểm tra lại với sách.',
    guide: [
      "Bài 1 dạy cách giới thiệu bản thân bằng câu danh từ \"A là B\". Gần như mọi thứ trong bài xoay quanh một khung câu duy nhất: Danh từ 1 + は + Danh từ 2 + です.",
      "Thứ tự học gợi ý: (1) khung khẳng định N1 は N2 です, (2) dạng phủ định じゃ ありません, (3) dạng nghi vấn thêm か, (4) trợ từ も (cũng) và の (của), rồi (5) cách gọi tên người, quốc tịch (さん, じん).",
      "Mẹo: chỉ cần nhớ ba \"chốt\" của câu: は nối chủ đề với phần thuyết minh, です ở cuối câu để lịch sự, và か ở cuối câu để biến câu thành câu hỏi.",
    ],
  },
  vocab: [
    ['わたし', 'わたし', 'Tôi'],
    ['あなた', 'あなた', 'Anh/chị, ông/bà, bạn (ngôi thứ II số ít)'],
    ['あの人', 'あのひと', 'Người kia, người đó, anh kia, chị kia'],
    ['あの方', 'あのかた', 'Vị kia (cách nói lịch sự của あのひと)', 'あの かたは ミラーさんです。', 'Vị kia là anh Miller.'],
    ['～さん', 'さん', 'Anh, chị, ông, bà (hậu tố thêm vào sau tên của người khác khi gọi, thể hiện tính lịch sự)'],
    ['～ちゃん', 'ちゃん', 'Hậu tố thêm vào sau tên của trẻ em, thay cho ～さん'],
    ['～人', 'じん', 'Hậu tố mang nghĩa "người ～"; ví dụ アメリカじん: người Mỹ', 'ミラーさんは アメリカじんですか。', 'Anh Miller có phải là người Mỹ không?'],
    ['先生', 'せんせい', 'Thầy/cô (không dùng khi giới thiệu về nghề giáo viên của chính mình)', 'ミラーさんは せんせいですか。', 'Anh Miller có phải là giáo viên không?'],
    ['教師', 'きょうし', 'Giáo viên'],
    ['学生', 'がくせい', 'Học sinh, sinh viên', 'サントスさんは がくせいじゃ ありません。', 'Anh Santos không phải là sinh viên.'],
    ['会社員', 'かいしゃいん', 'Nhân viên công ty', 'わたしは かいしゃいんです。', 'Tôi là nhân viên công ty.'],
    ['社員', 'しゃいん', 'Nhân viên công ty ～ (dùng kèm theo tên công ty; ví dụ IMCの しゃいん)', 'ミラーさんは IMCの しゃいんです。', 'Anh Miller là nhân viên công ty IMC.'],
    ['銀行員', 'ぎんこういん', 'Nhân viên ngân hàng'],
    ['医者', 'いしゃ', 'Bác sĩ'],
    ['研究者', 'けんきゅうしゃ', 'Nhà nghiên cứu'],
    ['大学', 'だいがく', 'Đại học, trường đại học'],
    ['病院', 'びょういん', 'Bệnh viện'],
    ['だれ', 'だれ', 'Ai'],
    ['どなた', 'どなた', 'Ai, vị nào (cách nói lịch sự của だれ)', 'あの かたは どなたですか。', 'Người kia là ai?'],
    ['～歳', 'さい', '～ tuổi'],
    ['何歳', 'なんさい', 'Mấy tuổi, bao nhiêu tuổi'],
    ['おいくつ', 'おいくつ', 'Mấy tuổi, bao nhiêu tuổi (cách nói lịch sự của なんさい)'],
    ['はい', 'はい', 'Vâng, dạ'],
    ['いいえ', 'いいえ', 'Không'],
    ['初めまして', 'はじめまして', 'Rất hân hạnh được gặp anh/chị (lời chào đầu tiên với người lần đầu gặp, là câu nói đầu tiên khi giới thiệu về mình)'],
    ['～から来ました', 'からきました', 'Tôi đến từ ～'],
    ['どうぞよろしくお願いします', 'どうぞよろしくおねがいします', 'Rất vui được làm quen với anh/chị (rất mong được sự giúp đỡ của anh/chị; luôn được dùng làm câu kết thúc sau khi giới thiệu về mình)'],
    ['失礼ですが', 'しつれいですが', 'Xin lỗi... (dùng khi hỏi ai đó về thông tin cá nhân như tên hoặc địa chỉ của họ)'],
    ['お名前は？', 'おなまえは', 'Tên anh/chị là gì?', '', '', 'onamae wa'],
    ['こちらは～さんです', 'こちらはさんです', 'Đây là anh/chị/ông/bà ～', '', '', 'kochira wa san desu'],
    ['アメリカ', 'アメリカ', 'Mỹ'],
    ['イギリス', 'イギリス', 'Anh'],
    ['インド', 'インド', 'Ấn Độ'],
    ['インドネシア', 'インドネシア', 'In-đô-nê-xi-a'],
    ['韓国', 'かんこく', 'Hàn Quốc'],
    ['タイ', 'タイ', 'Thái Lan'],
    ['中国', 'ちゅうごく', 'Trung Quốc'],
    ['ドイツ', 'ドイツ', 'Đức'],
    ['日本', 'にほん', 'Nhật Bản'],
    ['ブラジル', 'ブラジル', 'Braxin'],
  ],
  grammar: [
    {
      id: 'b01-wa-desu',
      title: 'N1 は N2 です',
      formula: 'N1 は N2 です',
      meaning: 'N1 là N2',
      explain: [
        "Ý chính: mẫu này dùng để nói \"A là B\" (giới thiệu tên, nghề nghiệp, quốc tịch...). Đây là khung câu cơ bản nhất của tiếng Nhật.",
        "は (đọc là \"wa\") là trợ từ chỉ chủ đề: danh từ đứng trước は là điều người nói muốn nói đến, phần sau は là thông tin về chủ đề đó. Ví dụ わたしは (Về tôi thì...) + マイク・ミラーです (là Mike Miller).",
        "です đặt ở cuối câu, sau danh từ: vừa khẳng định \"là\", vừa thể hiện sự lịch sự với người nghe. Sau này です còn biến đổi ở dạng phủ định (mẫu 2) và quá khứ (Bài 12).",
        "Lưu ý: tiếng Nhật không có từ \"là\" đứng giữa hai danh từ như tiếng Việt. Vai trò \"là\" nằm ở です ở cuối câu, còn は chỉ đánh dấu chủ đề.",
      ],
      when: [
        "Khi giới thiệu bản thân: tên, nghề nghiệp, quốc tịch.",
        "Khi nói một người hoặc vật \"là\" gì: anh Santos là bác sĩ, tôi là nhân viên công ty...",
        "Khi muốn nêu chủ đề rồi mới nói thông tin về nó trong hội thoại lịch sự.",
      ],
      steps: [
        "Chọn chủ đề của câu (người hoặc vật muốn nói tới), ví dụ わたし.",
        "Đặt trợ từ は ngay sau chủ đề: わたしは.",
        "Thêm danh từ nói rõ chủ đề là gì: わたしは かいしゃいん.",
        "Kết thúc bằng です để câu hoàn chỉnh và lịch sự: わたしは かいしゃいんです。",
      ],
      breakdown: {
        jp: "わたしは マイク・ミラーです。",
        vi: "Tôi là Mike Miller.",
        parts: [
          ["わたし", "chủ đề: \"tôi\""],
          ["は", "trợ từ chỉ chủ đề (đọc là wa)"],
          ["マイク・ミラー", "danh từ nói rõ chủ đề là ai"],
          ["です。", "kết câu, khẳng định và lịch sự"],
        ],
      },
      mistakes: [
        {
          wrong: "わたしを がくせいです。",
          right: "わたしは がくせいです。",
          why: "Chủ đề của câu danh từ luôn đi với は. Không dùng を (trợ từ của tân ngữ, học ở Bài 6).",
        },
        {
          wrong: "わたしは がくせい。",
          right: "わたしは がくせいです。",
          why: "Bỏ です thì câu cộc lốc, thiếu lịch sự. Khi nói với người mới quen nên luôn có です.",
        },
      ],
      compare: [
        {
          with: "N1 が N2 です",
          diff: "は nêu chủ đề đã biết rồi nói thông tin về nó; が thường dùng khi đưa thông tin mới hoặc nhấn mạnh chủ thể. Ở trình độ này cứ dùng は khi nói \"A là B\".",
        },
      ],
      tip: "Nhớ nhanh: は = \"còn về...\", です = \"là (lịch sự)\". わたしは がくせいです = \"Còn về tôi thì: là sinh viên.\"",
      examples: [
        ex('わたしは マイク・ミラーです。', 'Tôi là Mike Miller.'),
        ex('わたしは かいしゃいんです。', 'Tôi là nhân viên công ty.'),
      ],
      notes: ['Trợ từ は được phát âm là わ (wa).'],
      quiz: [
        quiz('b01-desu-1', 'わたしは マイク・ミラー＿。', 'Tôi là Mike Miller.', ['です', 'ですか', 'ありません', 'じゃ'], 'です', 'Câu khẳng định có vị ngữ là danh từ kết thúc bằng です. ですか là câu hỏi.'),
        quiz('b01-desu-2', 'わたし＿ がくせいです。', 'Tôi là sinh viên.', ['は', 'も', 'の', 'か'], 'は', 'Trợ từ は đứng sau chủ đề của câu. も mang nghĩa "cũng" nên không hợp ở đây.'),
        quiz('b01-desu-3', 'サントスさんは ＿です。', 'Anh Santos là bác sĩ.', ['いしゃ', 'ぎんこう', 'だいがく', 'びょういん'], 'いしゃ', 'いしゃ là bác sĩ (chỉ người). Các từ còn lại là nơi chốn hoặc tổ chức, không nói về nghề của người.'),
      ],
    },
    {
      id: 'b01-ja-arimasen',
      title: 'N1 は N2 じゃ (では) ありません',
      formula: 'N1 は N2 じゃ (では) ありません',
      meaning: 'N1 không phải là N2',
      explain: [
        "Ý chính: mẫu này dùng để nói \"A không phải là B\". Chỉ cần thay です của câu khẳng định bằng じゃ ありません.",
        "じゃ ありません là thể phủ định của です. Danh từ đứng ngay trước じゃ (viết liền, không cách), còn ありません viết cách ra như sách Minna.",
        "じゃ ありません dùng nhiều trong hội thoại hàng ngày. では ありません trang trọng hơn, hay dùng trong bài phát biểu hoặc văn viết. Hai dạng có nghĩa như nhau.",
        "Lưu ý phát âm: は trong では vẫn đọc là わ (wa).",
      ],
      when: [
        "Khi đính chính: \"Tôi không phải là bác sĩ\".",
        "Khi trả lời phủ định cho câu hỏi ですか: いいえ、～じゃ ありません。",
        "Dùng では ありません khi phát biểu trang trọng hoặc viết văn bản.",
      ],
      steps: [
        "Bắt đầu như câu khẳng định: わたしは いしゃ.",
        "Thay です bằng じゃ ありません (dính liền với danh từ): わたしは いしゃじゃ ありません。",
        "Muốn trang trọng hơn thì đổi じゃ thành では: わたしは いしゃでは ありません。",
      ],
      table: {
        title: "Khẳng định và phủ định của です",
        head: [
          "Mức độ",
          "Khẳng định",
          "Phủ định",
        ],
        rows: [
          ["Hội thoại hàng ngày", "いしゃです", "いしゃじゃ ありません"],
          ["Trang trọng, văn viết", "いしゃです", "いしゃでは ありません"],
        ],
      },
      breakdown: {
        jp: "サントスさんは がくせいじゃ ありません。",
        vi: "Anh Santos không phải là sinh viên.",
        parts: [
          ["サントスさん", "chủ đề: anh Santos"],
          ["は", "trợ từ chỉ chủ đề (đọc là wa)"],
          ["がくせい", "danh từ bị phủ định: \"sinh viên\""],
          ["じゃ", "dạng thông thường của では"],
          ["ありません。", "phủ định của です, kết câu"],
        ],
      },
      mistakes: [
        {
          wrong: "わたしは いしゃです ありません。",
          right: "わたしは いしゃじゃ ありません。",
          why: "Khi phủ định, です được thay hẳn bằng じゃ ありません, không giữ lại です.",
        },
        {
          wrong: "わたしは いしゃじゃ ません。",
          right: "わたしは いしゃじゃ ありません。",
          why: "Phủ định của danh từ là ありません (có あり). Chỉ ません đứng một mình là đuôi phủ định của động từ.",
        },
      ],
      compare: [
        {
          with: "V ません (Bài 4)",
          diff: "じゃ ありません phủ định câu có danh từ + です; ません phủ định động từ ます. Hai thứ không dùng lẫn.",
        },
      ],
      tip: "Nhớ nhanh: です → じゃ ありません. Hội thoại dùng じゃ, văn viết dùng では.",
      examples: [
        ex('サントスさんは がくせいじゃ ありません。', 'Anh Santos không phải là sinh viên.'),
        ex('わたしは いしゃじゃ ありません。', 'Tôi không phải là bác sĩ.'),
      ],
      notes: ['Trợ từ は trong では đọc là わ (wa).'],
      quiz: [
        quiz('b01-ja-1', 'サントスさんは がくせい＿ ありません。', 'Anh Santos không phải là sinh viên.', ['じゃ', 'です', 'を', 'か'], 'じゃ', 'Thể phủ định của です là じゃ ありません. です không đi cùng ありません.'),
        quiz('b01-ja-2', 'わたしは いしゃ じゃ＿。', 'Tôi không phải là bác sĩ.', ['ありません', 'ません', 'です', 'ですか'], 'ありません', 'Mẫu phủ định là N じゃ ありません.'),
        quiz('b01-ja-3', 'わたしは せんせい＿ ありません。かいしゃいんです。', 'Tôi không phải là giáo viên. Tôi là nhân viên công ty.', ['じゃ', 'です', 'が', 'の'], 'じゃ', 'Phủ định danh từ dùng じゃ ありません.'),
      ],
    },
    {
      id: 'b01-desuka',
      title: 'N1 は N2 ですか (câu nghi vấn)',
      formula: 'N1 は N2 ですか',
      meaning: 'N1 có phải là N2 không?',
      explain: [
        "Ý chính: thêm か vào cuối câu là biến câu thành câu hỏi. Không đổi trật tự từ, chỉ cần thêm か và lên giọng ở cuối câu.",
        "Câu hỏi đúng/sai: hỏi để xác nhận. Nội dung đúng thì trả lời はい, không đúng thì trả lời いいえ rồi nói lại câu phủ định.",
        "Câu hỏi có từ nghi vấn (だれ, どなた...): thay từ nghi vấn vào đúng vị trí của thông tin muốn hỏi, rồi thêm か. Trật tự từ vẫn như câu thường.",
        "か trong tiếng Nhật không dùng dấu hỏi. Dấu 。 vẫn đặt cuối câu, câu hỏi nhận biết nhờ か.",
      ],
      when: [
        "Khi muốn xác nhận một điều: \"Anh Miller là người Mỹ phải không?\"",
        "Khi hỏi tên, danh tính bằng だれ / どなた.",
        "Khi trả lời bằng はい hoặc いいえ cho một câu hỏi ですか.",
      ],
      steps: [
        "Viết câu khẳng định bình thường: ミラーさんは アメリカじんです。",
        "Thêm か vào cuối câu: ミラーさんは アメリカじんですか。",
        "Muốn hỏi thông tin cụ thể thì thay phần cần hỏi bằng từ nghi vấn: あの ひとは だれですか。",
        "Trả lời: đúng thì はい、～です。 sai thì いいえ、～じゃ ありません。",
      ],
      table: {
        title: "Hai kiểu câu hỏi",
        head: [
          "Loại",
          "Câu hỏi",
          "Câu trả lời",
        ],
        rows: [
          ["Hỏi đúng/sai", "ミラーさんは アメリカじんですか。", "はい、アメリカじんです。 / いいえ、アメリカじんじゃ ありません。"],
          ["Hỏi bằng từ nghi vấn", "あの ひとは だれですか。", "ミラーさんです。"],
        ],
      },
      breakdown: {
        jp: "ミラーさんは アメリカじんですか。 …はい、アメリカじんです。",
        vi: "Anh Miller có phải là người Mỹ không? …Vâng, anh ấy là người Mỹ.",
        parts: [
          ["ミラーさん", "chủ đề: anh Miller"],
          ["は", "trợ từ chỉ chủ đề"],
          ["アメリカじん", "người Mỹ"],
          ["ですか。", "です + か: biến thành câu hỏi"],
          ["…", "ngăn giữa câu hỏi và câu trả lời"],
          ["はい、", "vâng (nội dung đúng)"],
          ["アメリカじんです。", "nhắc lại thông tin, dạng khẳng định"],
        ],
      },
      mistakes: [
        {
          wrong: "ミラーさんは アメリカじんですか。 …はい、アメリカじんですか。",
          right: "ミラーさんは アメリカじんですか。 …はい、アメリカじんです。",
          why: "Câu trả lời là câu khẳng định, kết bằng です. Không thêm か vì か chỉ dùng để hỏi.",
        },
        {
          wrong: "だれは あの ひとですか。",
          right: "あの ひとは だれですか。",
          why: "Từ nghi vấn phải đặt đúng vị trí của thông tin cần hỏi (sau は, chỗ của danh từ), không đảo trật tự.",
        },
      ],
      tip: "Chỉ cần \"thêm か vào cuối câu và lên giọng\". Từ nghi vấn đứng đúng chỗ của câu trả lời.",
      examples: [
        ex('ミラーさんは アメリカじんですか。 …はい、アメリカじんです。', 'Anh Miller có phải là người Mỹ không? …Vâng, anh ấy là người Mỹ.'),
        ex('ミラーさんは せんせいですか。 …いいえ、せんせいじゃ ありません。', 'Anh Miller có phải là giáo viên không? …Không, anh ấy không phải là giáo viên.'),
        ex('あの かたは どなたですか。 …[あの かたは] ミラーさんです。', 'Người kia là ai? …Người đó là anh Miller.'),
      ],
      notes: [],
      quiz: [
        quiz('b01-ka-1', 'ミラーさんは アメリカじん＿。', 'Anh Miller có phải là người Mỹ không?', ['ですか', 'です', 'じゃ', 'ありません'], 'ですか', 'Thêm か vào cuối câu để tạo câu hỏi xác nhận đúng sai.'),
        quiz('b01-ka-2', 'あの ひとは ＿ですか。', 'Người kia là ai?', ['だれ', 'なん', 'どこ', 'いくつ'], 'だれ', 'Hỏi về người dùng だれ (hoặc どなた lịch sự). Từ nghi vấn đặt vào đúng chỗ cần hỏi, trật tự câu không đổi.'),
        quiz('b01-ka-3', 'ミラーさんは せんせいですか。…＿、せんせいじゃ ありません。', 'Anh Miller có phải là giáo viên không? Không, anh ấy không phải là giáo viên.', ['いいえ', 'はい', 'そうです', 'ええ'], 'いいえ', 'Nội dung không đúng nên trả lời いいえ. Vế sau là phủ định じゃ ありません.'),
      ],
    },
    {
      id: 'b01-mo',
      title: 'N も (cũng)',
      formula: 'N も',
      meaning: 'N cũng ...',
      explain: [
        "Ý chính: も nghĩa là \"cũng\". Dùng khi nội dung câu này giống nội dung câu trước.",
        "も thay thế cho は: chủ đề mới đi với も thay vì は. Không dùng cả hai cùng lúc.",
        "Phần còn lại của câu giữ nguyên. も dùng được cả ở câu khẳng định lẫn câu phủ định (cũng không...).",
      ],
      when: [
        "Khi nêu thêm một người/vật có cùng thông tin với câu trước: \"Anh Gupta cũng là nhân viên công ty\".",
        "Khi muốn tránh lặp lại cả câu dài.",
        "Khi nói \"cũng không là...\" ở câu phủ định.",
      ],
      steps: [
        "Nói câu đầu với は: ミラーさんは かいしゃいんです。",
        "Ở câu sau, đổi chủ đề mới, thay は bằng も: グプタさんも かいしゃいんです。",
        "Giữ nguyên phần vị ngữ như câu trước.",
        "Với phủ định, vẫn dùng も: グプタさんも かいしゃいんじゃ ありません。",
      ],
      table: {
        title: "は và も",
        head: [
          "Trợ từ",
          "Ý nghĩa",
          "Ví dụ",
        ],
        rows: [
          ["は", "nêu chủ đề (thông tin mới)", "ミラーさんは かいしゃいんです。"],
          ["も", "cũng (giống câu trước)", "グプタさんも かいしゃいんです。"],
        ],
      },
      breakdown: {
        jp: "わたしは がくせいです。ワンさんも がくせいです。",
        vi: "Tôi là sinh viên. Anh Wang cũng là sinh viên.",
        parts: [
          ["わたし", "chủ đề câu 1"],
          ["は", "trợ từ chỉ chủ đề"],
          ["がくせいです。", "tôi là sinh viên"],
          ["ワンさん", "chủ đề câu 2"],
          ["も", "cũng (thay cho は)"],
          ["がくせいです。", "thông tin giống câu 1"],
        ],
      },
      mistakes: [
        {
          wrong: "わたしは がくせいです。ワンさんも いしゃです。",
          right: "わたしは がくせいです。ワンさんは いしゃです。",
          why: "も chỉ dùng khi thông tin giống câu trước. Thông tin khác thì dùng は.",
        },
        {
          wrong: "ワンさんもは がくせいです。",
          right: "ワンさんも がくせいです。",
          why: "も thay thế は, không đứng cùng は.",
        },
      ],
      compare: [
        {
          with: "N は",
          diff: "は nêu chủ đề, không nói tới sự giống nhau. も thêm ý \"cũng\" so với điều đã nói ở câu trước.",
        },
      ],
      tip: "も = \"cũng\": giống câu trước thì đổi は thành も.",
      examples: [
        ex('ミラーさんは かいしゃいんです。グプタさんも かいしゃいんです。', 'Anh Miller là nhân viên công ty. Anh Gupta cũng là nhân viên công ty.'),
        ex('わたしは がくせいです。ワンさんも がくせいです。', 'Tôi là sinh viên. Anh Wang cũng là sinh viên.'),
      ],
      notes: [],
      quiz: [
        quiz('b01-mo-1', 'ミラーさんは かいしゃいんです。グプタさん＿ かいしゃいんです。', 'Anh Miller là nhân viên công ty. Anh Gupta cũng là nhân viên công ty.', ['も', 'は', 'の', 'か'], 'も', 'Nội dung giống câu trước nên dùng も thay は.'),
        quiz('b01-mo-2', 'わたしは インドネシアじんです。あの ひと＿ インドネシアじんです。', 'Tôi là người In-đô-nê-xi-a. Người kia cũng là người In-đô-nê-xi-a.', ['も', 'は', 'の', 'を'], 'も', 'Thông tin giống nhau nên dùng も ("cũng").'),
        quiz('b01-mo-3', 'ミラーさんは せんせいじゃ ありません。サントスさん＿ せんせいじゃ ありません。', 'Anh Miller không phải giáo viên. Anh Santos cũng không phải giáo viên.', ['も', 'は', 'が', 'の'], 'も', 'も dùng được cả với câu phủ định để nói "cũng không".'),
      ],
    },
    {
      id: 'b01-no',
      title: 'N1 の N2',
      formula: 'N1 の N2',
      meaning: 'N2 của / thuộc N1',
      explain: [
        "Ý chính: の nối hai danh từ, danh từ đứng trước bổ nghĩa cho danh từ đứng sau.",
        "Ở Bài 1, danh từ 1 cho biết nơi sở thuộc của danh từ 2: công ty của nhân viên, trường của giáo viên, bệnh viện của bác sĩ.",
        "Thứ tự tiếng Nhật ngược tiếng Việt: N1 の N2 dịch là \"N2 của N1\". Ví dụ さくらだいがくの せんせい = giáo viên (của) trường Sakura.",
      ],
      when: [
        "Khi nói ai thuộc công ty, trường học, bệnh viện nào.",
        "Khi muốn nói rõ hơn một danh từ bằng danh từ khác.",
        "Khi giới thiệu nghề nghiệp kèm nơi làm việc.",
      ],
      steps: [
        "Chọn danh từ chỉ nơi sở thuộc làm N1: さくらだいがく.",
        "Chọn danh từ chính làm N2: せんせい.",
        "Nối bằng の, N1 đứng trước: さくらだいがくの せんせい.",
        "Đặt vào câu: あの ひとは さくらだいがくの せんせいです。",
      ],
      table: {
        title: "Ví dụ N1 の N2",
        head: [
          "N1",
          "の",
          "N2",
          "Nghĩa",
        ],
        rows: [
          ["さくらだいがく", "の", "せんせい", "giáo viên trường đại học Sakura"],
          ["フジだいがく", "の", "がくせい", "sinh viên trường đại học Fuji"],
          ["びょういん", "の", "いしゃ", "bác sĩ của bệnh viện"],
        ],
      },
      breakdown: {
        jp: "あの ひとは さくらだいがくの せんせいです。",
        vi: "Người kia là giáo viên của trường đại học Sakura.",
        parts: [
          ["あの ひと", "chủ đề: người kia"],
          ["は", "trợ từ chỉ chủ đề"],
          ["さくらだいがく", "N1: nơi sở thuộc"],
          ["の", "nối N1 với N2"],
          ["せんせい", "N2: nghề nghiệp"],
          ["です。", "kết câu"],
        ],
      },
      mistakes: [
        {
          wrong: "わたしは パワーでんき しゃいんです。",
          right: "わたしは パワーでんきの しゃいんです。",
          why: "Hai danh từ phải được nối bằng の, không để trống.",
        },
        {
          wrong: "わたしは しゃいんの パワーでんきです。",
          right: "わたしは パワーでんきの しゃいんです。",
          why: "Danh từ đứng trước の là phần bổ nghĩa (nơi sở thuộc), danh từ chính đứng sau.",
        },
      ],
      tip: "N1 の N2 đọc ngược lại từ phải sang trái thành \"N2 của N1\".",
      examples: [
        ex('ミラーさんは IMCの しゃいんです。', 'Anh Miller là nhân viên công ty IMC.'),
        ex('あの ひとは さくらだいがくの せんせいです。', 'Người kia là giáo viên của trường đại học Sakura.'),
      ],
      notes: [],
      quiz: [
        quiz('b01-no-1', 'ミラーさんは パワーでんき＿ しゃいんです。', 'Anh Miller là nhân viên công ty điện lực Power.', ['の', 'は', 'も', 'です'], 'の', 'Danh từ chỉ nơi sở thuộc nối với danh từ sau bằng の.'),
        quiz('b01-no-2', 'あの ひとは フジだいがく＿ がくせいです。', 'Người kia là sinh viên của trường đại học Fuji.', ['の', 'は', 'も', 'を'], 'の', 'N1 の N2 cho biết N2 thuộc về N1 (trường đại học).'),
        quiz('b01-no-3', 'ワンさんは びょういん＿ いしゃです。', 'Anh Wang là bác sĩ của bệnh viện.', ['の', 'は', 'も', 'で'], 'の', 'Nối "bệnh viện" với "bác sĩ" bằng の.'),
      ],
    },
    {
      id: 'b01-san',
      title: '～さん',
      formula: 'tên + さん',
      meaning: 'anh/chị/ông/bà + tên',
      explain: [
        "Ý chính: さん là hậu tố lịch sự, thêm sau họ hoặc tên của người nghe hoặc người thứ ba.",
        "Không dùng さん sau tên của chính mình vì さん thể hiện sự tôn trọng dành cho người khác. Với trẻ em, dùng ちゃん thân mật thay cho さん.",
        "Khi đã biết tên người nghe thì không gọi あなた mà gọi tên + さん. あなた chỉ hợp với quan hệ rất thân (vợ chồng, người yêu), dùng sai dễ gây ấn tượng không tốt.",
        "じん là hậu tố khác, nghĩa là \"người ～\" dùng với tên nước: アメリカじん (người Mỹ).",
      ],
      when: [
        "Khi gọi hoặc nhắc tới người khác một cách lịch sự.",
        "Khi gọi người nghe: ミラーさん thay vì あなた.",
        "Khi nói quốc tịch: tên nước + じん.",
      ],
      steps: [
        "Lấy họ hoặc tên của người cần gọi: ミラー.",
        "Thêm さん ngay sau tên: ミラーさん.",
        "Đặt vào câu như danh từ bình thường: ミラーさんは せんせいですか。",
        "Giới thiệu bản thân thì bỏ さん: わたしは ミラーです。",
      ],
      table: {
        title: "Các hậu tố hay gặp",
        head: [
          "Hậu tố",
          "Dùng với",
          "Ví dụ",
        ],
        rows: [
          ["さん", "người nghe, người thứ ba (lịch sự)", "ミラーさん"],
          ["ちゃん", "trẻ em (thân mật)", "たろうちゃん"],
          ["じん", "tên nước, chỉ quốc tịch", "アメリカじん"],
        ],
      },
      breakdown: {
        jp: "あの かたは ミラーさんです。",
        vi: "Vị kia là anh Miller.",
        parts: [
          ["あの かた", "chủ đề: vị kia (lịch sự)"],
          ["は", "trợ từ chỉ chủ đề"],
          ["ミラー", "tên người"],
          ["さん", "hậu tố lịch sự"],
          ["です。", "kết câu"],
        ],
      },
      mistakes: [
        {
          wrong: "わたしは ミラーさんです。",
          right: "わたしは ミラーです。",
          why: "Không thêm さん sau tên của chính mình vì さん dành cho người khác.",
        },
        {
          wrong: "ミラーさんは アメリカさんです。",
          right: "ミラーさんは アメリカじんです。",
          why: "Nói quốc tịch phải dùng じん, không dùng さん.",
        },
      ],
      compare: [
        {
          with: "あなた",
          diff: "あなた nghe xa cách hoặc quá thân mật. Khi biết tên thì gọi tên + さん sẽ tự nhiên hơn.",
        },
      ],
      tip: "さん luôn dành cho người khác, không bao giờ cho mình.",
      examples: [
        ex('あの かたは ミラーさんです。', 'Người kia là anh Miller.'),
        ex('すずき：ミラーさんは がくせいですか。 ミラー：いいえ、かいしゃいんです。', 'Suzuki: Anh Miller có phải là sinh viên không? Miller: Không, tôi là nhân viên công ty.'),
      ],
      notes: ['あなた được sử dụng trong những quan hệ cực kỳ thân mật như vợ chồng, người yêu, v.v. Do đó cần thiết phải chú ý khi sử dụng ngoài những trường hợp trên vì có thể sẽ gây cho đối phương ấn tượng không tốt.'],
      quiz: [
        quiz('b01-san-1', 'あの かたは ミラー＿です。', 'Vị kia là anh Miller.', ['さん', 'ちゃん', 'です', 'じん'], 'さん', 'Gọi người khác (ngôi thứ ba) thì thêm さん sau tên. ちゃん dành cho trẻ em.'),
        quiz('b01-san-2', 'ミラーさんは アメリカ＿です。', 'Anh Miller là người Mỹ.', ['じん', 'さん', 'ちゃん', 'ご'], 'じん', 'Hậu tố ～じん nghĩa là "người ～" (quốc tịch).'),
        quiz('b01-san-3', 'はじめまして。わたしは ＿です。', 'Chào bạn. Tôi là Miller (tự giới thiệu tên mình).', ['ミラー', 'ミラーさん', 'ミラーちゃん', 'ミラーせんせい'], 'ミラー', 'Không dùng さん sau tên của chính người nói.'),
      ],
    },
  ],
};
