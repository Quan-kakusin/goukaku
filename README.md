# ja_paines

**ja_paines** là web app học tiếng Nhật theo **25 bài của Minna no Nihongo (Sơ cấp 1)**: mỗi bài có Từ vựng, Ngữ pháp và Bài tập. Chạy hoàn toàn trên máy, không cần backend hay tài khoản.

**Bài học và bài tập chỉ dùng kana** (hiragana, katakana, có khoảng trắng giữa các cụm như sách Minna). Chữ Hán học riêng ở mục **Kanji**: 80 chữ cần thiết nhất cho N5.

## Chạy

Lần đầu (hoặc sau khi kéo code mới) cài công cụ build một lần:

```bash
cd ~/code/personal/nihongo-n5
npm install        # chỉ cài Vite, công cụ chạy dev và đóng gói
npm start          # dev server tại http://localhost:8000 (tự tải lại khi sửa code)
```

App vẫn là JavaScript thuần (không React/Vue); Vite chỉ lo dev server, gom và nén file khi build. Cổng 8000 bị chiếm thì `npm start` báo lỗi thay vì đổi cổng: hãy tắt server cũ (Ctrl+C) rồi chạy lại. Nếu trình duyệt vẫn hiện giao diện cũ, nhấn Ctrl+Shift+R một lần.

Mở <http://localhost:8000> bằng trình duyệt (trên Windows cũng được, WSL2 tự chuyển tiếp `localhost`).
Tên app là ja_paines (tab trình duyệt chỉ hiện favicon, không có chữ), favicon là mặt Peter (file `public/logo.png`; thay file này để đổi), thanh bên không còn logo; tên khóa lưu dữ liệu trong trình duyệt vẫn giữ nguyên (`nihongo-n5:...`) để tiến độ cũ không mất.
Luôn mở đúng địa chỉ này: tiến độ lưu trong `localStorage` theo từng địa chỉ và cổng.

## Cách học

1. Mở app là vào **Bài học**: chọn bài bằng dải số 1–25 (không có trang chủ).
2. Mỗi bài có 4 tab: **Tổng quan** (mục tiêu, hướng dẫn cách học, bảng công thức, lưu ý), **Từ vựng**, **Ngữ pháp** (công thức, giải thích, ví dụ, lưu ý) và **Luyện đề**.
3. App không có trạng thái "đang học" hay "đã học xong", không theo dõi từng từ, không đếm chuỗi ngày, không nhắc nhở: nhịp học do bạn quyết định. Chỉ lưu điểm luyện tập cao nhất của từng bài.
4. Chữ Hán học riêng ở mục **Kanji** (danh sách 80 chữ, luyện đọc có chấm điểm).
5. Vào **Luyện đề** để làm đề, được chấm điểm và xem giải thích chi tiết từng câu. Câu sai tự vào **Sổ lỗi sai**.

## Tính năng

- **25 bài**, chọn bài ở danh sách bài và từng trang bài. Mỗi bài có số từ, số mẫu câu và điểm luyện tập cao nhất.
- **Thi thử N5 đầy đủ** (mục Luyện thi → Thi thử N5): mỗi đề theo cấu trúc đề thật, các phần thi nối tiếp có giờ riêng, nộp phần nào rồi thì không quay lại. Mỗi đề có nút **Làm cả đề** và các nút **Chỉ phần 1** / **Chỉ phần 2** (/ **Chỉ phần 3** nếu có phần nghe) để làm riêng từng phần (có giờ riêng của phần đó). Làm một phần thì kết quả chỉ báo số câu đúng của phần ấy (chưa quy ra thang 120 điểm, chưa so mức sàn); làm đủ cả hai phần mới có điểm. "Làm lại đề này" ở màn kết quả làm lại đúng những phần đã làm. Đáp án đang chọn tô xanh đậm, chữ đáp án cỡ lớn. Hiện có 2 đề:
  - **Đề số 1** (app soạn): 67 câu, gồm 文字・語彙 (35 câu, 25 phút) và 文法・読解 (32 câu, 50 phút). Chữ Hán chỉ thuộc 80 chữ của mục Kanji. Chưa có phần nghe vì chưa có file âm thanh.
  - **Đề số 2** (chép từ file PDF của bạn, kèm bảng đáp án): 89 câu, gồm 文字・語彙 (33 câu, 25 phút), 文法・読解 (32 câu, 50 phút: điền từ, sắp xếp câu ★, điền đoạn văn, đọc hiểu đoạn ngắn / vừa / tìm thông tin) và **聴解 (24 câu, 30 phút)** dùng 4 file âm thanh của đề (`public/audio/de-02/N5Q1.mp3`…`N5Q4.mp3`, mỗi file một もんだい, tổng khoảng 28 phút). Màn nghe có thanh phát âm thanh gắn cố định phía trên, vẫn chạy khi bạn chuyển câu; câu có hình thì hình đề hiện ngay trong câu, đáp án chọn theo số. Các câu 例 (ví dụ) không tính điểm và không có trong app; chưa chép lời thoại nên phần giải thích của câu nghe chỉ nêu đáp án đúng (theo bảng 正答表).
  - **Đề số 1 chưa có phần nghe 聴解**: chấm phần chữ・ngữ pháp・đọc hiểu theo thang 120 (mức sàn JLPT N5 là 38) và chưa kết luận đậu/rớt cả kỳ thi. Thêm phần nghe cho một đề: thêm một phần `choukai` vào file đề, mỗi もんだい khai báo `audioSrc` (file âm thanh) và mỗi câu có thể có `image` (hình đề) và `bare: true` (nút chỉ ghi số); xem `data/jlpt/de-02.js`. Nếu không có file âm thanh, câu nghe có thể dùng lời thoại đọc bằng giọng máy (`audio` + `js/tts.js`).
  - Đề có phần nghe (hiện là đề số 2) chấm theo thang JLPT 180 điểm (120 + 60): đậu khi tổng ≥ 80, phần chữ・ngữ pháp・đọc hiểu ≥ 38, phần nghe ≥ 19. Điểm là ước tính từ tỉ lệ câu đúng, không phải điểm quy đổi chính thức. Có thể làm riêng phần 聴解 (nút "Chỉ phần 3"); khi đó kết quả chỉ báo số câu đúng.
  - Thêm đề: tạo `data/jlpt/de-03.js` theo mẫu `de-01.js` / `de-02.js` rồi thêm vào `PAPERS` trong `js/mock.js`. Dạng sắp xếp câu chép từ sách đặt `keepOrder: true` để giữ thứ tự phương án như đề in.
  - Đề số 2 chép từ ảnh scan nên có thể sai sót nhỏ: đáp án nhiễu của 問題2 (chữ Hán na ná) có chỗ ảnh mờ nên phải dựng lại, và câu có hình minh họa (câu 28, 問題4) được mô tả bằng chữ. Nếu để repo ở nơi công khai, hãy cân nhắc bản quyền của đề gốc.
- **Luyện từ vựng** (mục Từ vựng): **Thẻ flash** (lật thẻ, tự đánh giá nhớ / chưa nhớ, mặt trước chọn tiếng Nhật hoặc tiếng Việt, học lại thẻ chưa nhớ; phím Space để lật, 1/2 để đánh giá) và **Gõ romaji** (đề là nghĩa tiếng Việt, bạn tự nhớ từ tiếng Nhật rồi gõ romaji; ô nhập tự đổi sang hiragana khi gõ như bàn phím tiếng Nhật: gõ "hoteru" ra ほてる, "-" ra ー, "nn" hoặc n + phụ âm ra ん, chữ n ở cuối từ hiện luôn là ん (gõ "ichiban" ra いちばん; gõ thêm nguyên âm thì tự ghép lại, vd "kana" vẫn ra かな), gõ đôi phụ âm ra っ; từ katakana gõ bằng hiragana vẫn đúng, kể cả ティ/ディ gõ "ti"/"di"/"thi"; chữ Nhật chỉ hiện sau khi trả lời xong; gõ đúng thì hiện đáp án khoảng 4 giây rồi tự sang từ kế (`Enter` để sang ngay), không có nút "Từ tiếp theo"; gõ sai thì gõ lại; "Xem đáp án" hiện đáp án vài giây rồi ẩn đi và bạn phải gõ lại từ đó mới sang từ kế (không đổi điểm: xem đáp án là 0 điểm); có nút "Bỏ qua từ"; phím tắt: `Enter` kiểm tra, `Esc` bỏ qua từ, `Ctrl+Enter` xem đáp án (có ngay từ đầu); chấm điểm: đúng ngay 1 điểm, đúng sau khi gõ lại nửa điểm, bỏ qua hoặc xem đáp án 0 điểm; luyện lại các từ chưa đúng). Chọn bài bằng dải số 1–25 (bấm nhiều số để luyện nhiều bài một lượt, có nút Tất cả / Bỏ chọn); luyện toàn bộ từ của các bài đã chọn. Có ô "Trộn thứ tự từ" (mặc định bật; bỏ tích để luyện đúng thứ tự trong sách). Không lưu theo dõi từng từ, chỉ là một lượt luyện. Tab **Tra từ** để tìm từ.
- **Luyện tập theo bài** (tab Luyện tập trong trang từng bài): một chế độ duy nhất, chọn số câu (5/10/15/20 hoặc tất cả). Câu điền chỗ trống theo các mẫu ngữ pháp của bài (toàn kana), không tính giờ, chọn xong thấy đúng sai và giải thích ngay. Có thêm bài tập riêng cho từng mục ngữ pháp.
  - Cuối mỗi lần làm có **chấm điểm** theo phần trăm với xếp loại, giải chi tiết từng câu (lý do từng đáp án nhiễu sai, mẫu ngữ pháp liên quan), nút làm lại và luyện lại câu sai. Câu sai vào **Sổ lỗi sai**. Mục Thi thử N5 lưu lịch sử, điểm trung bình và các bài làm yếu.
- **Ngữ pháp giảng giải chi tiết** (141 mục của sách): mỗi mục theo thứ tự học: công thức → ý chính và giải thích từng thành phần → dùng khi nào → cách tạo câu từng bước (kèm bảng chia/bảng so sánh khi cần) → bóc tách một câu ví dụ thành từng phần có vai trò → ví dụ → lỗi hay gặp (câu sai ✗ và câu đúng ✓ kèm lý do) → dễ nhầm với mẫu nào → mẹo nhớ → lưu ý trong sách → bài tập. Mỗi bài có thêm "Hướng dẫn của bài" ở tab Tổng quan nói bài xoay quanh khung câu nào và nên học theo thứ tự nào. Phần giảng giải mở rộng do AI soạn dựa trên nội dung sách, nên có thể có chỗ cần đối chiếu lại với giáo trình.
- **Ngữ pháp theo mẫu tài liệu** của bạn: công thức, giải thích, ví dụ, lưu ý, đánh số (12.1, 12.2…), kèm bài tập từng mục.
- **Nhập từ vựng của sách**: dán danh sách cho từng bài, hoặc thêm từng từ. Có thể ẩn các từ gợi ý của app để chỉ dùng từ của bạn.
- **Furigana** (chữ hiragana nhỏ phía trên chữ Hán): mục Kanji hiện cách đọc chính trên từng chữ và furigana ở từ ví dụ; trong đề thi thử, chữ Hán trong câu hỏi, đáp án và đoạn văn tự có furigana theo từ vựng của app (công tắc "Hiện furigana" khi làm bài và khi xem lại, nhớ lựa chọn). Câu đọc kanji và viết kanji (問題1, 問題2) và phần luyện đọc ở mục Kanji **không** hiện furigana vì đó chính là đáp án. Chữ Hán app chưa biết cách đọc thì để nguyên, không đoán.
- **Kanji N5** (mục riêng, 80 chữ cần thiết, có Hán Việt, âm On/Kun, từ ví dụ; luyện đọc có chấm điểm, giải chi tiết), **Kana**, **Tra từ** (lọc theo bài, tìm bằng kana, romaji, nghĩa hoặc cả chữ Hán gốc).
- **Sổ lỗi sai**, **sao lưu** JSON và xuất sang Anki.
- Giao diện sáng kiểu hoạt hình Family Guy (nền trời xanh, viền đen, ảnh meme sau mỗi câu đúng/sai; xem mục Meme), bàn phím là chính, theo WCAG 2.2 AA. Xem [docs/DESIGN.md](docs/DESIGN.md).

Nghe phát âm cần máy có giọng tiếng Nhật (Windows: Settings → Time & language → Language → thêm Japanese).

## Nội dung hiện có và nguồn gốc

- **Từ vựng và ngữ pháp của 25 bài** được nhập từ 100 ảnh chụp giáo trình Minna no Nihongo Sơ cấp 1 (bản tiếng Việt) của bạn: 1036 mục từ vựng (đúng như danh sách "I. Từ vựng" của sách, giữ dạng ます của động từ) và 141 mục ngữ pháp theo đúng đánh số của sách ("IV. Giải thích ngữ pháp"), kèm phần giải thích và ví dụ của sách. Chữ viết tay trong ảnh bị bỏ qua.
- **Phần do app soạn thêm:** toàn bộ câu hỏi bài tập (437 câu), ví dụ khi sách thiếu (đủ 2 ví dụ mỗi mục) và tên chủ đề của từng bài. Ví dụ và câu hỏi được viết bằng kana có dấu cách, vì bài học không dùng chữ Hán.
- **Chỗ lệch có chủ ý so với sách:** bỏ tên riêng giả định (công ty, trường, bệnh viện), cột cách đọc không có dấu ～, từ trùng giữa các bài được giữ lại với mã riêng (vd `飲みます#16`) nên có thể thấy một từ hiện ở hai bài với nghĩa khác nhau.
- Việc nhập do AI đọc ảnh nên có thể còn sai sót ở chỗ ảnh nghiêng hoặc bị cắt mép. Thấy chỗ nào sai so với sách thì sửa thẳng trong file `data/minna/bai-NN.js` hoặc báo để sửa.
- Bản cũ (nội dung app tự soạn trước khi nhập sách): `~/code/personal/nihongo-n5-truoc-khi-nhap-sach.tar.gz`.

## Meme sau mỗi câu đúng/sai

Meme là ảnh của bạn trong `public/memes/dung/` (hiện khi trả lời đúng) và `public/memes/sai/` (khi trả lời sai), mỗi nhóm đang có 5 ảnh (`dung-1.png`…, `sai-1.png`…). Meme hiện sau mỗi câu trả lời (luyện tập, gõ romaji, luyện kana) và ở đầu màn kết quả (thi thử, luyện tập, thẻ flash, gõ romaji; chưa đạt thì dùng ảnh sai).

Muốn thêm ảnh: bỏ thêm file (png, jpg, gif, webp, svg, tên gì cũng được) vào hai thư mục `public/memes/dung/` và `public/memes/sai/` rồi tải lại trang. `npm start` đọc lại cả thư mục mỗi lần; khi deploy thì `npm run build` sinh `memes/list.json`. Server khác không có danh sách này nên chỉ dùng 5 + 5 ảnh `dung-N.png` / `sai-N.png`, vì vậy đừng xóa hoặc đổi tên các file này.

## Đưa lên GitHub / Vercel

App là web tĩnh (JavaScript thuần đóng gói bằng Vite, không backend), dữ liệu học nằm trong `localStorage` của từng trình duyệt và **không** được đưa lên host.

- **Đóng gói:** `npm run build` (= `vite build`) gom JS/CSS thành vài file có mã băm trong tên (trình duyệt tự tải bản mới sau mỗi lần deploy), chép `public/` (logo, memes, audio) nguyên vẹn vào `dist/` và sinh `dist/memes/list.json`. Không kèm tests, docs, scripts. Xem thử bản build bằng `npm run preview`. Vercel tự nhận ra dự án Vite; `vercel.json` khai báo lệnh build, thư mục `dist` và các header.
- **Vercel không cần GitHub:** `npx vercel login` (tài khoản cá nhân) rồi `npx vercel` trong thư mục này; `vercel.json` đã khai báo lệnh build và thư mục `dist`. Lên bản chính thức bằng `npx vercel --prod`. Mỗi tên miền có `localStorage` riêng: tiến độ ở `localhost` không tự sang, hãy xuất JSON ở trang Cài đặt rồi nhập lại.
- **GitHub:** nên để repo **private**. Repo chứa nội dung từ sách Minna no Nihongo, đề thi chép từ PDF (kể cả file nghe `public/audio/` và hình đề) và ảnh meme tải về, là tài liệu có bản quyền. `.gitignore` đã bỏ qua `*.pdf`, `sources/`, `dist/`, `.vercel/`, `*.tar.gz`. Workflow `.github/workflows/test.yml` chạy `npm test` mỗi lần push.
- **Không lập chỉ mục:** trang có `<meta name="robots" content="noindex">` và header `X-Robots-Tag: noindex` (trong `vercel.json`) để công cụ tìm kiếm không đưa lên kết quả. Link Vercel vẫn công khai với ai có link.

## Thêm dữ liệu

Mỗi bài một file: `data/minna/bai-01.js` … `bai-25.js`, gồm `meta` (tên bài), `vocab` (từ vựng) và `grammar` (ngữ pháp). Sau khi sửa, chạy `npm test`: các test bắt lỗi nhập liệu thường gặp.

**Quy tắc kana:** mọi câu ví dụ, câu hỏi, đáp án, giải thích trong file bài phải viết bằng kana, **không chứa chữ Hán** (test `bài học và bài tập không chứa chữ Hán` sẽ báo lỗi). Cột đầu của một dòng từ vựng là ngoại lệ: có thể ghi chữ Hán của sách (`['猫', 'ねこ', ...]`) để làm id và để tra cứu, nhưng app chỉ hiển thị cách đọc.

**Cách nhanh nhất cho từ vựng:** mở bài trong app → tab Từ vựng → "Thêm từ vào Bài N" → dán danh sách, mỗi dòng:

```
chữ | cách đọc | nghĩa | câu ví dụ | nghĩa câu ví dụ
```

Chỉ ba cột đầu là bắt buộc. Muốn chỉ dùng từ của sách thì tích "Ẩn các từ gợi ý của app".

**Từ vựng trong file** (`vocab`): thêm một dòng `['猫', 'ねこ', 'Con mèo', 'ねこが すきです。', 'Tôi thích mèo.']`. Phần tử thứ 6 là romaji ghi tay, chỉ cần khi は đọc là "wa". `id` tự sinh từ chữ Nhật (`n5:猫`), nên đổi thứ tự hay chuyển bài không làm mất tiến độ. Cách đọc phải toàn kana.

**Ngữ pháp** (`grammar`): thêm một đối tượng, số mục (12.3…) tự đánh theo thứ tự:

```js
{
  id: 'ten-mau-cau',
  title: 'N1 は N2 より adj',
  formula: 'N1 は N2 より adj です',
  meaning: 'N1 hơn N2',
  explain: ['Đoạn giải thích...'],
  examples: [ex('とうきょうは ハノイより おおきいです。', 'Tokyo lớn hơn Hà Nội.') /* tối thiểu 2 */],
  notes: ['Lưu ý...'],                       // có thể để []
  quiz: [quiz('id-duy-nhat-1', 'とうきょうは ハノイ＿ おおきいです。', 'Tokyo lớn hơn Hà Nội.', ['より', 'から', 'まで', 'だけ'], 'より', 'Giải thích đáp án') /* tối thiểu 2 */],
},
```

Câu điền chỗ trống có đúng một `＿`, đúng 4 lựa chọn khác nhau, đáp án nằm trong đó. Câu hỏi nên có gợi ý nghĩa để chỉ có một đáp án đúng. Id câu hỏi (`g:...`, `k:...`, `v:...`) được lưu trong sổ lỗi sai, nên **không đổi id** sau khi đã có người học.

**Kanji** (`data/kanji-n5.js`, hiện 80 chữ; test kiểm tra đúng 80, sửa số trong `tests/content.test.mjs` nếu bạn đổi danh sách): `[chữ, Hán Việt IN HOA, nghĩa, âm On, âm Kun, [[từ, cách đọc, nghĩa], ...]]`, tối thiểu 2 từ ví dụ, mỗi từ phải chứa chữ Hán đó. Đây là nơi duy nhất dùng chữ Hán.

## Cấu trúc

```
index.html          trang duy nhất, các màn hình đổi theo #/route
css/tokens.css      design token (nơi duy nhất có giá trị thô: màu, px)
css/style.css       component, chỉ dùng token
data/minna/         25 file bài (từ vựng + ngữ pháp + bài tập)
data/lessons.js     ghép 25 bài thành LESSONS, VOCAB, GRAMMAR
data/kanji-n5.js    kanji N5
vite.config.js      cấu hình Vite (thư mục public/, plugin danh sách meme)
js/main.js          router (có tham số)
js/progress.js      ngưỡng điểm "đạt"
js/import.js        phân tích danh sách từ dán vào (hàm thuần)
js/storage.js       lưu/đọc/kiểm tra dữ liệu trong localStorage
js/mistakes.js      sổ lỗi sai
js/questions.js     sinh câu hỏi trắc nghiệm (ngữ pháp cho Luyện đề, đọc kanji cho mục Kanji) và giải thích đáp án
js/exam.js          dựng đề theo bài, chấm điểm, xếp loại, thống kê lịch sử (hàm thuần)
js/mock.js          dựng và chấm đề thi thử N5 đầy đủ theo thang 180 điểm (hàm thuần)
data/jlpt/          đề thi thử N5 (de-01.js: app soạn, 67 câu; de-02.js: chép từ PDF của bạn, 65 câu + 24 câu nghe)
js/exam-session.js  chuyển đề từ nơi tạo sang màn làm bài
js/insights.js      lời nhận xét, lời khen
js/furigana.js      furigana: cách đọc chính của 80 kanji, tự gắn furigana cho câu trong đề (hàm thuần)
js/ime.js           đổi romaji sang hiragana khi gõ (hàm thuần)
js/words.js         chọn từ và chấm điểm cho thẻ flash, gõ romaji (hàm thuần)
js/deck.js          bộ từ đang dùng (gợi ý + từ của bạn)
js/views/           lessons, lesson, flash, typing (+ word-setup), vocab, exams, exam (+ exam-run, exam-result), launch, kanji, kana, notebook, data, parts
tests/              node --test
scripts/memes.mjs   đọc danh sách ảnh meme (dùng cho dev server và lúc build)
vercel.json         cấu hình Vercel (lệnh build, thư mục kết quả, header)
public/             file tĩnh chép nguyên vào bản build:
  logo.png          favicon
  memes/            ảnh meme: dung/ (trả lời đúng), sai/ (trả lời sai)
  audio/de-02/      file nghe N5Q1-4.mp3 và hình đề nghe (c1-q*.jpg, c3-q*.jpg) của đề số 2
.github/workflows/  chạy test trên GitHub
```

## Test

```bash
npm test
```

Gồm test logic ( dựng đề và chấm điểm, nhập từ, lưu trữ, sổ lỗi, sinh câu hỏi), kiểm tra dữ liệu 25 bài (cấu trúc, id duy nhất, đáp án hợp lệ, số mục Bài 11–16 khớp tài liệu), và kiểm tra bộ thiết kế (tương phản WCAG, CSS không dùng giá trị thô, đủ trạng thái). Giao diện trong trình duyệt chưa có test tự động trong `npm test` (đã kiểm tra thủ công bằng trình duyệt headless).

## Kế hoạch

- Đối chiếu từ vựng, ngữ pháp 25 bài với giáo trình khi bạn cung cấp dữ liệu.
- Phần nghe thật (file âm thanh) cho các đề, dạng nghe nhìn tranh (問題3) cần có hình, và hiển thị hình minh họa trong đề.
- Đếm ngược ngày thi.
- Bản trước khi chuyển bài học sang kana (còn chữ Hán trong ví dụ, 101 kanji): `~/code/personal/nihongo-n5-truoc-khi-bo-kanji.tar.gz`.
- Nếu muốn dùng lại thẻ ghi nhớ ngắt quãng (SRS) và chuỗi ngày: bản cũ nằm trong `~/code/personal/nihongo-n5-truoc-khi-lam-nhe.tar.gz`.
