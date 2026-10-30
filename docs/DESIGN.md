# Hướng dẫn thiết kế: ja_paines

## 1. Bối cảnh và mục tiêu

Ý định thiết kế: một giao diện học tập gọn, tối giản, đọc rõ và thao tác hoàn toàn bằng bàn phím, để người học tập trung vào nội dung tiếng Nhật. Bố cục theo Threads (nội dung nằm trong một khung bo góc ở giữa, mục danh sách là các hàng ngăn bằng đường mảnh), phần vẻ ngoài theo phong cách hoạt hình Family Guy: nền trời xanh, viền đen dày, bóng đổ cứng, meme sau mỗi câu trả lời. Chỉ có **một giao diện sáng**, không có chế độ tối.

Nền tảng thị giác lấy từ spec Threads (nền đen, chữ nhỏ 15px/21px, nút bo tròn, token ngữ nghĩa) cùng cấu trúc trang của Threads (thanh icon dọc, thanh tab dưới trên điện thoại, tab gạch chân). Chỉ áp dụng token và phong cách, **không** dùng thương hiệu hay tên Threads. Đối tượng: người tự học tiếng Nhật. Bề mặt: ứng dụng web học tập (content site).

Mục tiêu: nhất quán qua token, đạt WCAG 2.2 AA, giao đồng nhất trên máy tính và điện thoại (reflow tới 320px).

## 2. Token và nền tảng

Giá trị thô chỉ nằm trong `css/tokens.css`. `css/style.css` chỉ dùng `var(--token)`.

| Nhóm | Token |
|---|---|
| Font | `font-family-primary` (system-ui stack + font tiếng Nhật), `font-size-xs/sm/md` = 12/15/20px, weight 400, line-height 21px |
| Khoảng cách | `space-1..5` = 4/8/12/16/36px |
| Bo góc | `radius-xs..step7` = 8/10/16/18/50/1000/9999px |
| Bóng | `shadow-1`, `shadow-2` |
| Chuyển động | `motion-duration-instant` 100ms, `motion-duration-fast` 200ms (về 0 khi `prefers-reduced-motion`) |

**Token mở rộng** (spec không có, app cần): `font-size-lg` 28px (câu hỏi), `font-size-display` 48px (từ/kanji trên thẻ), `font-size-giant` 96px (kana khi luyện), `line-height-tight`, `size-target` 44px (vùng bấm), `size-content` 640px, `size-rail` 80px, `size-nav` 56px, `size-bar` 60px, `size-icon` 24px, `size-ring` 112px (96px trên màn hẹp), `motion-duration-slow` 600ms, `border-width`, `focus-ring-width/offset`.

**Màu ngữ nghĩa** (một bảng màu sáng): `surface-base` (nền trang, xanh da trời), `surface-raised` (khung nội dung), `surface-inset` (ô/thẻ lồng trong khung), `surface-hover`, `border-subtle/strong`, `text-primary/secondary/tertiary`, `accent` (liên kết, chỉ báo chọn), `outline` (viền đen dày của khung/thẻ, cũng là màu bóng đổ cứng `shadow-pop`), `brand`/`on-brand` (cam đất: vòng điểm, dấu tích bài đã học, chữ Hán trên ô truy cập), `action`/`on-action` (nút chính, xanh lá), `focus-ring`, `success`, `danger`/`on-danger` (huy hiệu), `warning`.

### Điều chỉnh so với spec để đạt AA

Một số cặp màu nguyên văn trong spec không đủ tương phản, nên đã đổi (tỉ lệ đo bằng công thức WCAG):

Bảng màu hiện tại không còn theo màu của spec Threads mà tự chọn theo phong cách hoạt hình; mọi cặp chữ/nền vẫn phải đạt AA (kể cả trên nền trời xanh `surface-base`, là nền khó nhất) và được test `tương phản đạt AA` kiểm tra. Khi đổi màu, chỉnh trong `css/tokens.css` rồi chạy `npm test`.

## 3. Quy tắc component

Mọi điều khiển **phải** có đủ trạng thái: default, hover, focus-visible, active, disabled, loading, error.

| Trạng thái | Cách biểu diễn |
|---|---|
| hover | nền `surface-hover` |
| focus-visible | viền `focus-ring-width` màu `focus-ring`, offset `focus-ring-offset`; không bao giờ ẩn |
| active | nền `border-subtle` (nút chính: giảm sáng) |
| disabled | `disabled` hoặc `aria-disabled="true"`, độ mờ 0.4, con trỏ `not-allowed` |
| loading | `aria-busy="true"`: hiện spinner, chặn thao tác (`pointer-events: none`) |
| error | nút: `data-state="error"`; ô nhập: `aria-invalid="true"` + thông báo `.field-error` liên kết bằng `aria-describedby` |

### Khung trang và điều hướng
- **5 mục theo luồng học, mỗi mục có icon kèm nhãn chữ** (không chỉ icon): Bài học · Từ vựng · Chữ viết · Luyện thi · Cài đặt. Không có trang chủ: mở app (hoặc đường dẫn lạ) là vào danh sách bài, nơi chọn bài đang học. Mỗi mục lớn có hàng tab gạch chân bên trong (`wordsTabs`, `writeTabs`, `testTabs`):
  - **Bài học:** danh sách 25 bài có hai tab lớn Bài học / Bài tập (`#/lessons`, `#/lessons/exercise`). Mỗi bài cũng có hai tab lớn: Bài học (Tổng quan / Từ vựng / Ngữ pháp, chỉ để đọc) và Bài tập (để làm).
  - **Từ vựng:** Thẻ flash | Gõ romaji | Tra từ.
  - **Chữ viết:** Kana | Kanji (80 chữ), tách khỏi bài học vì là nơi duy nhất dùng chữ Hán.
  - **Luyện thi:** Thi thử N5 | Sổ lỗi sai. Chấm số lỗi nằm trên icon Luyện thi.
- **Desktop (>768px):** cột điều hướng dọc `size-rail` bên trái (5 mục icon trên nhãn nằm giữa cột theo chiều dọc, mỗi mục là một ô trắng viền đen có bóng đổ cứng, nổi lên khi hover, lún khi bấm, mục đang mở tô `action`; không còn logo trong cột), khung nội dung `surface-raised` bo `radius-lg` rộng tối đa `size-content` ở giữa.
- **Điện thoại (≤768px):** thành thanh tab cố định ở dưới (`size-bar`), 5 mục chia đều chiều ngang (64px ở màn 320px) vừa nhãn chữ.
- **Icon:** SVG nét mảnh, `currentColor`, mục hiện tại nét đậm hơn. Mỗi liên kết icon bắt buộc có `aria-label` và `title`. Mục đang chọn có `aria-current="page"`.
- **Huy hiệu số lỗi:** chấm `danger` trên icon Luyện thi; số mục được đọc trong `aria-label` ("Luyện thi, 3 câu trong sổ lỗi sai cần ôn").
- **Bàn phím:** có liên kết "Bỏ qua tới nội dung"; sau khi đổi trang tiêu điểm về `<main>`.
- **Giao diện:** chỉ có giao diện sáng, không có nút đổi. Khóa lưu cũ `nihongo-n5:theme` (nếu còn) không còn được dùng.
- **Phong cách hoạt hình:** khung, thẻ và điều khiển có viền đen `outline-width` (2px); thẻ và nút có bóng đổ cứng (`shadow-pop`, `shadow-pop-sm`); nút nổi lên khi hover và lún xuống khi bấm.
- **Meme sau mỗi câu** (`meme()` trong `js/ui.js`): ảnh của người dùng trong `public/memes/dung/` (đúng) và `public/memes/sai/` (sai), 5 + 5 ảnh `dung-N.png` / `sai-N.png` làm bộ mặc định (`PRAISE`, `MISS` trong `js/insights.js`); `memes/list.json` (dev server của Vite trả về khi chạy local, `npm run build` sinh khi deploy) cho app đọc cả thư mục, thêm ảnh thì tự có. Đúng thì chỉ hiện dấu ✓ xanh và ảnh, sai thì dấu ✗ đỏ và ảnh (ở bài tập vẫn kèm đáp án đúng); ảnh cao tối đa 16% chiều cao màn hình, nhảy khi đúng, lắc khi sai (thời lượng dùng token nên tắt khi giảm chuyển động). Màn Gõ romaji đặt meme bên trái, đáp án bên phải để vừa một khung nhìn. Test kiểm tra các ảnh mặc định tồn tại. Peter chỉ còn là favicon (`logo.png`) trên tab.

### Nút (`.btn`, `.icon-btn`)
- **Cấu tạo:** nhãn (chữ rõ hành động), tùy chọn `kbd` hiện phím tắt. **Biến thể:** mặc định (viền mảnh), `primary` (nền `action`, đơn sắc), `danger`, `small`, `big`. `icon-btn` chứa icon SVG.
- **Kích thước:** `min-height: size-target` (44px), bo `radius-2xl`.
- **Bàn phím:** `Tab` tới, `Enter`/`Space` kích hoạt. **Chuột/chạm:** vùng bấm tối thiểu 44px.
- **Nội dung dài:** nhãn xuống dòng, không cắt. Nhãn phải mô tả hành động ("Làm 10 câu ngẫu nhiên", không phải "OK"). Nút chỉ có biểu tượng bắt buộc có `aria-label`.

### Tab gạch chân (`.tabs`, `.segmented` > `.seg`)
- Tab đang chọn: chữ `text-primary` và gạch chân dày `focus-ring-width`; tab khác `text-tertiary`. Tab điều hướng dùng liên kết với `aria-current="page"`; nhóm chọn chế độ dùng nút với `aria-pressed`. Nhóm có `role="group"` và `aria-label`.

### Ô nhập (`input`, `select`)
- Viền `border-strong` (≥3:1), nền `surface-raised`, `min-height` 44px. Mọi ô phải có nhãn (`label` hoặc `aria-label`).
- Lỗi: hiện thông báo văn bản (không chỉ đổi màu viền), chuyển tiêu điểm tới ô lỗi.

### Câu hỏi trắc nghiệm (`.choice`)
- Chữ đáp án cỡ `font-size-md`, vùng bấm cao hơn `size-target`. Trong đề thi, đáp án đang chọn (`.selected`) và ô câu đã trả lời trên bảng số câu tô nền `accent` với chữ `on-accent` (tương phản được test), đậm hơn hẳn trạng thái hover.
- Đề thi thử: thẻ mỗi đề có nút "Làm cả n phần" và "Chỉ phần i" (`.mock-start`); làm một phần thì kết quả hiện số câu đúng từng phần, không quy điểm thang 120.
- Phím `1`-`4` chọn đáp án, `Enter`/`Space` sang câu tiếp. Sau khi chọn: các lựa chọn `aria-disabled`, đáp án đúng `.correct` (✓), lựa chọn sai `.incorrect` (✗), phản hồi nằm trong vùng `aria-live="polite"`, tiêu điểm chuyển sang nút "Câu tiếp".
- Không dùng màu làm tín hiệu duy nhất: luôn kèm ký hiệu ✓/✗ và văn bản.
- Màn hình hẹp (≤480px): 1 cột.

### Thẻ học (`.card`), khối và danh sách
- Thẻ và khối (`.panel`, `.done-box`): viền `border-subtle`, nền trong suốt, bo `radius-md`. Ô thống kê và ô kana/kanji dùng nền `surface-inset`. Từ dài dùng `overflow-wrap: anywhere`.
- Danh sách (từ vựng, ngữ pháp, sổ lỗi): mỗi mục là một hàng ngăn bằng đường mảnh, hover nền `surface-inset`, không dùng thẻ rời.

### Furigana
- **Mục Kanji:** cách đọc chính (hiragana, màu `brand`, cỡ `font-size-xs`) nằm phía trên từng chữ trong lưới và ở chữ lớn trong phần chi tiết, bằng thẻ `<ruby>` (có `<rp>` cho trình duyệt không hỗ trợ). Nhãn đọc cho trình đọc màn hình có kèm cách đọc.
- **Đề thi thử:** tự gắn furigana vào chữ Hán trong câu hỏi, đáp án, đoạn văn và phần xem lại. Chỉ gắn khi biết chắc cách đọc từ (từ vựng của app, số + đơn vị đếm, thứ trong tuần, gốc động từ theo chữ kana đứng sau); chữ chưa biết thì để nguyên. Công tắc "Hiện furigana" (nhớ lựa chọn). Câu 問題1/問題2 và luyện đọc kanji không hiện furigana vì kiểm tra chính cách đọc/viết.
- Dãn dòng đủ rộng (`line-height: 2`) để furigana không đè lên dòng trên.

### Luyện từ vựng
- **Chọn bộ từ:** ô "Trộn thứ tự từ" (bật mặc định) và dải nút số 1–25 chọn được nhiều bài (`aria-pressed`, tự xuống dòng cả trên điện thoại), nút Tất cả / Bỏ chọn (nhớ lựa chọn lần trước), và một dòng báo các bài đã chọn có bao nhiêu từ (vùng `aria-live`). Không có ô chọn số từ: luyện hết từ của các bài đã chọn. Bỏ từ trùng cách đọc để gõ romaji không mơ hồ.
- **Thẻ flash:** thẻ lớn, nút Lật thẻ (Space/Enter) rồi hai nút Chưa nhớ (✗, phím 1) / Đã nhớ (✓, phím 2); trạng thái không chỉ dùng màu. Mặt sau có ví dụ nếu có. Kết quả nêu số thẻ nhớ và danh sách thẻ chưa nhớ để học lại.
- **Gõ romaji:** chỉ một kiểu: đề là nghĩa tiếng Việt, người học gõ từ tiếng Nhật (không hiện chữ Nhật trước khi trả lời để luyện nhớ chứ không chỉ luyện gõ; chữ Nhật hiện sau khi trả lời xong). Nhịp làm bài không cần chuột: gõ đúng thì hiện đáp án khoảng 2 giây (vùng `aria-live`; gõ lại đúng thì khoảng 1,5 giây) rồi tự sang từ kế; xem đáp án thì hiện vài giây, ẩn đi và bắt gõ lại. Màn hình cảm ứng không có Enter nên có nút "Từ kế ›" (sau khi gõ đúng) và "Gõ lại" (sau khi xem đáp án) ngay dưới ô nhập; ô nhập không bị `disabled` mà bị khóa chữ, để bàn phím ảo không đóng lại và phím Enter của nó cũng sang từ kế/ẩn đáp án. Phím tắt (có `kbd` trên nút, chỉ hiện ở thiết bị có bàn phím): Enter kiểm tra (hoặc sang từ kế/ẩn đáp án ngay khi đang chờ), Esc bỏ qua, Ctrl+Enter xem đáp án; không bắt phím khi đang dùng bộ gõ của hệ điều hành. Ô nhập có nhãn nêu rõ cách gõ và tự đổi romaji sang hiragana khi gõ (tắt được bằng một ô tích ở màn chọn; không đổi khi đang dùng bộ gõ tiếng Nhật của hệ điều hành; chữ "n" cuối hiện luôn là ん nhưng vẫn là n đang chờ: gõ thêm nguyên âm thì ghép lại như bộ gõ thật, xem `convertInput` trong `js/ime.js`), từ katakana nhận cả hiragana, Enter để kiểm tra; sai thì xóa ô và gõ lại (thông báo bằng chữ trong vùng `aria-live`, ô đổi `aria-invalid`), nút Bỏ qua từ, và nút Xem đáp án có sẵn ngay từ đầu (không cần gõ sai trước). Chấm điểm: đúng ngay 1, đúng sau khi gõ lại 0,5, bỏ qua hoặc xem đáp án 0; xếp loại bằng chữ như đề thi.
- **Không theo dõi lâu dài:** mỗi lượt độc lập, không lưu tiến độ từng từ, giữ ý định "nhẹ, người học tự chủ" của app.

### Nội dung chỉ dùng kana
- Bài học và bài tập (từ vựng, ví dụ, câu hỏi, đáp án, giải thích) viết hoàn toàn bằng kana, có khoảng trắng giữa các cụm như sách Minna. Chữ Hán chỉ có ở mục Kanji (80 chữ). Test tự động bắt chữ Hán lọt vào dữ liệu bài.
- Từ đồng âm (はし: đũa / cầu) không được hỏi dạng "chọn nghĩa" vì chỉ có kana nên không phân biệt được.

### Thi thử N5 đầy đủ
- **Phần nghe 聴解 bằng file âm thanh:** mỗi もんだい có một file; thanh nghe (`.audio-bar`, phần tử `<audio controls>` gốc của trình duyệt) nằm cố định phía trên thẻ câu hỏi (`position: sticky`) và không bị tạo lại khi chuyển câu, chỉ đổi file khi sang もんだい khác; tạm dừng khi sang phần thi khác hoặc nộp bài. Câu có hình đề (`.q-image`, cao tối đa 45% màn hình) và các nút đáp án ghi "Đáp án N" (`.choice.bare`) khi lựa chọn là hình hoặc chỉ nghe được. Màn xem lại có file nghe và hình đề của từng câu.
- **Mỗi đề một thẻ ở đầu trang Thi thử N5:** nêu các phần thi (tên 日本語, số câu, số phút), cách chấm, kết quả lần gần nhất. Đề có phần nghe còn có ô chọn "Có phần nghe" và trạng thái giọng đọc tiếng Nhật; hiện cả hai đề chưa có phần nghe nên ô này không hiện.
- **Chạy theo phần thi:** mỗi phần có màn giới thiệu (đồng hồ chưa chạy), đồng hồ riêng, nút "Nộp phần này, sang phần tiếp" kèm xác nhận nêu rõ không quay lại được; hết giờ tự nộp phần và chuyển tiếp. Bảng câu hỏi chỉ hiện câu của phần đang làm.
- **Thành phần câu hỏi:** hướng dẫn dạng bài (tiếng Nhật + tiếng Việt), đoạn văn trong khung `surface-inset`, phần gạch chân bằng `<u>`, khung nghe có nút Nghe và số lượt còn lại (đọc cho trình đọc màn hình qua vùng `aria-live`).
- **Kết quả:** điểm theo thang 180 với sàn từng phần, ghi rõ là ước tính; xem lại có đoạn văn, bản dịch, lời thoại (kèm bản dịch và nút nghe lại).

### Luyện tập và kết quả
- **Nội dung đề:** chỉ câu điền chỗ trống theo mẫu ngữ pháp của bài, không có câu hỏi từ vựng (từ vựng học ở tab Từ vựng).
- **Bài tập tách khỏi bài học:** tab Bài tập của trang từng bài có thẻ "Luyện tổng hợp" (ô chọn 10/20/30/50 câu mỗi lượt), các nhóm dạng bài (từ vựng, câu và trợ từ, công thức, lỗi hay gặp, câu hỏi trong sách) mỗi dạng một dòng có mô tả, số câu có sẵn và nút "Làm N câu", rồi bài tập từng mục ngữ pháp và lối tắt sang Gõ romaji. Cuối mỗi trang bài học có thẻ dẫn sang Bài tập; không còn đề nhanh, form tạo đề hay chế độ thi thử theo bài. Trang Thi thử N5 (`#/exams`) chỉ có đề đầy đủ, thống kê, bài làm yếu và lịch sử có xóa.
- **Luyện tập:** chọn xong khóa đáp án, hiện ✓/✗ và giải thích ngay, tiêu điểm chuyển sang nút "Câu tiếp".
- **Thi thử (đề N5 đầy đủ, hoặc làm lại đề cũ):** đồng hồ đếm ngược (`role="timer"`, thông báo mốc còn lại cho trình đọc màn hình, không đọc từng giây), đổi đáp án tự do, đánh dấu câu (`aria-pressed`, phím `F`), bảng điều hướng câu `.qn` (mỗi ô nêu trạng thái bằng chữ: đã trả lời, bỏ trống, đánh dấu), hộp xác nhận nêu số câu chưa làm trước khi nộp, tự nộp khi hết giờ.
- **Kết quả:** vòng điểm, xếp loại bằng chữ (Xuất sắc / Đạt / Gần đạt / Chưa đạt), thanh theo phần, dạng câu và bài, bộ lọc xem lại (tất cả / sai / bỏ trống / đánh dấu).
- **Giải chi tiết từng câu:** đáp án đã chọn và đáp án đúng đều có ký hiệu + chữ, lý do từng đáp án nhiễu sai, giải thích, thẻ liên quan (mẫu ngữ pháp, từ, kanji). Đề lưu cả thứ tự đáp án đã hiện nên xem lại luôn đúng như lúc làm.

### Bài học (cấu trúc theo giáo trình)
- **Chọn bài:** dải nút số 1–25 (`lessonPicker`, `aria-current` cho bài đang xem). Máy tính: xuống dòng để thấy đủ 25 bài; điện thoại: một hàng cuộn ngang.
- **Danh sách 25 bài:** mỗi hàng có số bài (vòng nền nhạt, số màu `brand`), tiêu đề, tiếng Nhật, số từ/mẫu câu/điểm luyện tập cao nhất. Không có nhãn trạng thái "đang học" hay "đã học xong": người học tự chủ nhịp học.
- **Trang một bài:** đầu trang có dải chọn bài một hàng cuộn ngang (mờ dần hai đầu); trang Bài học không lặp lại dải này vì danh sách bên dưới đã là nơi chọn bài; hai tab lớn (Bài học · Bài tập, cỡ chữ lớn hơn) và ba tab con của Bài học (Tổng quan · Từ vựng · Ngữ pháp) đều là liên kết có `aria-current`, mỗi tab một đường dẫn riêng (`#/lesson/12/grammar`, `#/lesson/12/exercise`).
- **Tab Tổng quan:** mục tiêu của bài, 4 bước học (mỗi bước có nút mở đúng tab), bảng công thức các mẫu câu, lưu ý gom từ các mục, và từ khóa.
- **Giảng giải ngữ pháp:** mỗi mục là một khối mở rộng gồm các khối nhỏ có tiêu đề (`.gblock`): ý chính in đậm, "Dùng khi nào" (danh sách), "Cách tạo câu" (các bước đánh số trong vòng tròn `action` và bảng `.gtable` cuộn ngang trên màn hẹp, ô đầu hàng là `th scope=row`), "Bóc tách một câu ví dụ" (từng phần câu kèm vai trò), "Lỗi hay gặp" (✗ gạch ngang màu `danger`, ✓ màu `success`, kèm lý do; không chỉ dùng màu vì có ký hiệu và nhãn đọc), "Dễ nhầm với", ô "Mẹo nhớ" (viền `success`). Khối nào thiếu dữ liệu thì không hiện. Tab Ngữ pháp có nút Mở tất cả / Thu gọn tất cả.
- **Ngữ pháp theo mẫu tài liệu:** mỗi mục đánh số `bài.mục` (12.3), gồm khung Công thức (viền `accent`), giải thích, Ví dụ, hộp Lưu ý (viền `warning`) và nút làm bài tập. Hộp Lưu ý và Công thức không dùng màu làm tín hiệu duy nhất (có nhãn chữ).
- **Nhập từ của sách:** ô dán nhiều dòng báo kết quả trong vùng `aria-live`, liệt kê lỗi theo số dòng; từ hợp lệ vẫn được nhận.
- **Ẩn từ gợi ý:** tùy chọn theo từng bài. Ẩn chỉ ảnh hưởng danh sách và đề; sổ lỗi sai của các từ đó vẫn giữ nguyên.

### Trạng thái rỗng và tràn
- Danh sách rỗng luôn có biểu tượng dấu tích, câu giải thích và hành động tiếp theo (xem Sổ lỗi sai, làm một đề).
- Không bao giờ in giá trị rỗng ra màn hình: dùng `show()`/`h()` (lọc `false`/`null`/`undefined`), không gọi `replaceChildren` với biểu thức `&&`.
- Không cuộn ngang ở 320px (đã đo trên mọi trang và các trạng thái sâu).

## 4. Yêu cầu truy cập và tiêu chí kiểm thử

Mục tiêu: **WCAG 2.2 AA**. Tiêu chí tự động nằm trong `tests/design.test.mjs` (chạy bằng `npm test`).

| Tiêu chí | Kiểm tra | Đạt khi |
|---|---|---|
| Tương phản chữ ≥ 4.5:1 | test `tương phản đạt AA` (một bảng màu sáng) | mọi cặp chữ/nền ngữ nghĩa đạt |
| Tương phản viền điều khiển, vòng focus ≥ 3:1 | cùng test | `border-strong`, `focus-ring` đạt trên mọi nền |
| Màu thương hiệu | test `tương phản đạt AA`, `chữ trên nền hero pha màu` | `brand` đạt 4.5:1 trên mọi nền; chữ trên nền hero pha màu vẫn đạt |
| Gợi ý phím tắt, chuyển động | test `kbd chỉ hiện...`, `vòng tiến độ và hiệu ứng...` | `kbd` ẩn trên cảm ứng; mọi animation dùng token thời lượng |
| Không giá trị thô | test `không chứa màu thô`, `không dùng px thô` | `style.css` không có hex/rgb, không px thô cho cỡ chữ/khoảng cách/bo góc |
| Token tồn tại | test `mọi var(--token)...` | không có token sai tên |
| Đủ trạng thái | test `đủ trạng thái` | có selector hover/active/disabled/loading/error/focus-visible |
| Vùng bấm ≥ 44px, giảm chuyển động | test `vùng bấm tối thiểu` | `min-height: size-target` ở các điều khiển, có `prefers-reduced-motion` |
| Token khớp spec | test `token nền tảng khớp spec` | giá trị khớp spec Threads |

Kiểm tra thủ công (chưa tự động hóa): đọc bằng trình đọc màn hình, thao tác chỉ bằng bàn phím trên từng trang, thử 200% zoom.

## 5. Nội dung và giọng điệu

Ngắn gọn, rõ ràng, nói thẳng hành động. Dùng tiếng Việt, thuật ngữ tiếng Nhật giữ nguyên chữ gốc kèm cách đọc.

| Nên | Không nên |
|---|---|
| "Làm 10 câu ngẫu nhiên" | "Bắt đầu" khi không rõ bắt đầu gì |
| "Cách đọc chỉ được gồm hiragana hoặc katakana." | "Dữ liệu không hợp lệ" |
| "Không lưu được tiến độ: trình duyệt đang chặn lưu trữ." | "Lỗi" |

## 6. Phản mẫu và việc bị cấm

- Chữ hoặc viền điều khiển tương phản thấp; ẩn hoặc làm mờ vòng focus.
- Giá trị thô (hex, px) trong `style.css`; ngoại lệ khoảng cách hay cỡ chữ riêng lẻ. Cần giá trị mới thì thêm token.
- Dùng màu làm tín hiệu duy nhất cho đúng/sai hay bài đã học.
- Dùng `brand` làm nền nút hoặc rải khắp giao diện: màu này chỉ để nhấn (vòng điểm, dấu tích bài đã học, chữ Hán đại diện); nút chính luôn là màu `action`.
- Cố định phím tắt trong nhãn cho mọi thiết bị: chỉ hiện trên thiết bị có bàn phím.
- Nhãn mơ hồ ("OK", "Gửi") hoặc nút biểu tượng không có `aria-label`.
- Thêm component mà không định nghĩa đủ trạng thái.
- Dùng `div` có `onclick` thay cho `button`.

**Ghi chú di chuyển:** bản đầu của app dùng bảng màu ấm, thanh menu ngang và thẻ nổi. Đã chuyển sang token và bố cục Threads (thanh icon, khung giữa, tab gạch chân, nút chính đơn sắc). Nếu thêm component mới, bắt đầu từ `css/tokens.css`; màu xanh `accent` chỉ dành cho liên kết và chỉ báo chọn, không dùng làm nền nút.

## 7. Danh sách QA

- [ ] `npm test` qua hết (gồm test thiết kế).
- [ ] Mọi điều khiển mới có đủ 7 trạng thái và vùng bấm ≥ 44px.
- [ ] Thao tác được toàn bộ chỉ bằng bàn phím, vòng focus luôn thấy rõ.
- [ ] Đúng/sai có ký hiệu và văn bản, không chỉ màu.
- [ ] Không cuộn ngang ở 320px; từ dài và trạng thái rỗng hiển thị hợp lý.
- [ ] Desktop có thanh icon dọc; ≤768px có thanh tab dưới đủ 44px, không che nội dung cuối trang.
- [ ] Mỗi liên kết/nút chỉ có icon có `aria-label`.
- [ ] Mở app lần đầu (không dữ liệu) thấy ngay danh sách bài và biết bấm vào đâu để học.
- [ ] Không có chữ `false`/`undefined`/`null` rò rỉ ra giao diện ở bất kỳ trang nào, kể cả khi làm đúng hết.
- [ ] Nhãn nút mô tả hành động; ô nhập có nhãn; lỗi có thông báo văn bản.
