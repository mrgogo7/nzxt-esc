# NZXT-ESC - Tích Hợp Web NZXT Tốt Nhất

### Trình Chỉnh Sửa Bố Cục Tùy Biến Màn Hình Nâng Cao Cho NZXT Kraken AIO

Tạo các bố cục LCD NZXT Kraken có thể chỉnh sửa hoàn toàn với lớp phủ cảm biến kéo-thả, phông chữ tùy chỉnh, hình ảnh, GIF, APNG, video MP4, WebM, đồng hồ, biểu đồ, dữ liệu Now Playing và hiệu ứng hình ảnh phản ứng theo âm thanh, được hiển thị trực tiếp thông qua **NZXT CAM Web Integration**.

[![Latest Release](https://img.shields.io/github/v/release/mrgogo7/nzxt-esc?style=flat-square&label=release&color=8b5cf6)](https://github.com/mrgogo7/nzxt-esc/releases/latest)
[![NZXT CAM](https://img.shields.io/badge/NZXT%20CAM-Web%20Integration-8b5cf6?style=flat-square)](https://nzxt-esc.pages.dev/)
[![Languages](https://img.shields.io/badge/languages-25-22c55e?style=flat-square)](#languages)
[![License](https://img.shields.io/badge/license-personal%20use-lightgrey?style=flat-square)](#license)

[Mở trong NZXT CAM](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)
· [Mở Bản Xem Trước Trực Tiếp](https://nzxt-esc.pages.dev/)
· [Các Mẫu Kraken Được Hỗ Trợ](#supported-nzxt-kraken-lcd-models)
· [Tính Năng](#features)
· [Bắt Đầu Nhanh](#quick-start)
· [Câu Hỏi Thường Gặp](#faq)

  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/nzxt-esc-editor.png"
       alt="Trình chỉnh sửa bố cục LCD NZXT Kraken kéo-thả của NZXT-ESC"
       width="70%" />

> [!NOTE]
> **NZXT-ESC là một dự án cộng đồng độc lập.** Dự án này không liên kết, không được tài trợ và không được NZXT chứng thực.

Nếu NZXT-ESC đã cải thiện thiết lập của bạn, bạn có thể ủng hộ để dự án tiếp tục phát triển:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

## Tùy biến màn hình LCD NZXT Kraken không giới hạn bởi bố cục cố định

NZXT-ESC biến màn hình NZXT Kraken thành một khung vẽ tự do. Xây dựng một màn hình LCD tùy chỉnh bằng cách đặt từng cảm biến, hình ảnh đồ họa, đồng hồ, hình ảnh hoặc thành phần media chính xác nơi bạn muốn. Thay đổi kích thước, xoay, sắp xếp lại thứ tự, đổi tên, khóa và tạo kiểu cho các thành phần trong khi xem kết quả cập nhật trực tiếp thông qua NZXT CAM.

Trình chỉnh sửa cốt lõi không yêu cầu **tài khoản** và không yêu cầu **cài đặt riêng cho người dùng cuối**. Các preset và media cục bộ được lưu trong bộ nhớ trình duyệt. Các lớp phủ âm nhạc tùy chọn sử dụng ứng dụng đồng hành Windows cục bộ [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket).

<a id="supported-nzxt-kraken-lcd-models"></a>

## Các Mẫu LCD NZXT Kraken Được Hỗ Trợ

NZXT-ESC hỗ trợ các bộ tản nhiệt nước AIO NZXT Kraken có màn hình LCD và NZXT CAM Web Integration, bao gồm các mẫu Kraken Elite, Kraken Plus, Kraken và Kraken Z thế hệ hiện tại và trước đó.

NZXT Kraken Elite (2024)
NZXT Kraken Elite 240
NZXT Kraken Elite 360
NZXT Kraken Elite 240 RGB
NZXT Kraken Elite 280 RGB
NZXT Kraken Elite 360 RGB
NZXT Kraken Elite 420 RGB
NZXT Kraken Plus (2025)
NZXT Kraken Plus 240
NZXT Kraken Plus 280
NZXT Kraken Plus 360
NZXT Kraken Plus 240 RGB
NZXT Kraken Plus 360 RGB
NZXT Kraken Elite (2023)
NZXT Kraken Elite 240 (2023)
NZXT Kraken Elite 280 (2023)
NZXT Kraken Elite 360 (2023)
NZXT Kraken Elite 240 RGB (2023)
NZXT Kraken Elite 280 RGB (2023)
NZXT Kraken Elite 360 RGB (2023)
NZXT Kraken (2023)
NZXT Kraken 240
NZXT Kraken 280
NZXT Kraken 360
NZXT Kraken 240 RGB
NZXT Kraken 280 RGB
NZXT Kraken 360 RGB
NZXT Kraken Z Series
NZXT Kraken Z53
NZXT Kraken Z63
NZXT Kraken Z73
NZXT Kraken Z53 RGB
NZXT Kraken Z63 RGB
NZXT Kraken Z73 RGB

NZXT-ESC tự động điều chỉnh bố cục theo độ phân giải, kích thước và hình dạng màn hình LCD của Kraken được báo cáo thông qua API của NZXT CAM, cho phép các bố cục tùy chỉnh, lớp phủ cảm biến, nền động, đồ họa và media được hiển thị thông qua NZXT CAM Web Integration.

<a id="quick-start"></a>
## Bắt Đầu Nhanh

### Mở trực tiếp trong NZXT CAM

[![Open NZXT-ESC in NZXT CAM](https://img.shields.io/badge/Open%20NZXT--ESC%20in-NZXT%20CAM-8b5cf6?style=for-the-badge)](https://cam-redirect.nzxt.com/action/load-web-integration?url=https://nzxt-esc.pages.dev/)

1. Nhấp vào **Open NZXT-ESC in NZXT CAM**.
2. Cho phép trình duyệt của bạn mở NZXT CAM.
3. Xác nhận **Load Web Integration**.
4. Mở thẻ Web Integration mới và chọn **Configure**.
5. Tạo bố cục của bạn; các thay đổi sẽ được đồng bộ với màn hình Kraken.

<details>
<summary><strong>Thiết lập thủ công trong NZXT CAM</strong></summary>

1. Mở **NZXT CAM**.
2. Vào **Lighting → Kraken → LCD Display**.
3. Chọn **Web Integration**.
4. Mở phần cài đặt **Custom Web Integration**.
5. Nhập:

   ```text
   https://nzxt-esc.pages.dev/
   ```

6. Chọn **Apply**, sau đó **Add as Card**.
7. Mở thẻ mới và chọn **Configure**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/40ddafa3-77b9-4320-b50a-9df137cfd4e7"
       alt="Màn hình thiết lập NZXT CAM Web Integration"
       width="48%" />
  <img src="https://github.com/user-attachments/assets/445b8470-219a-45b2-b4e4-b10ba034ee99"
       alt="Thêm NZXT-ESC như một thẻ NZXT CAM Web Integration"
       width="48%" />
</p>

</details>

## Xem nó hoạt động

<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo1.gif"
       alt="Preset màn hình LCD NZXT Kraken tùy chỉnh được tạo bằng NZXT-ESC"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/newdemo2.gif"
       alt="Bố cục màn hình NZXT Kraken có hiệu ứng động trong NZXT-ESC"
       width="48%" />
</p>
<p align="center">
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live1.gif"
       alt="Lớp phủ cảm biến NZXT CAM trực tiếp trên màn hình LCD Kraken"
       width="48%" />
  <img src="https://github.com/mrgogo7/nzxt-esc/blob/main/docs/demo-live2.gif"
       alt="Màn hình LCD Kraken tùy chỉnh có hiệu ứng động chạy qua NZXT CAM"
       width="48%" />
</p>

<a id="features"></a>
## Tính Năng

| Khả năng | Lợi ích mang lại cho bạn |
|---|---|
| **Trình chỉnh sửa bố cục tự do** | Kéo, thay đổi kích thước, xoay, sắp xếp lớp, khóa, đổi tên và định vị chính xác từng thành phần. |
| **Dữ liệu cảm biến NZXT CAM trực tiếp** | Xây dựng màn hình tùy chỉnh cho CPU, GPU, RAM, nhiệt độ dung dịch làm mát, công suất, tần số và tốc độ quạt. |
| **Đồ họa nâng cao** | Kết hợp đồ họa cảm biến dạng tia, tuyến tính, tròn và lịch sử trong cùng một bố cục. |
| **Nền có hiệu ứng động** | Sử dụng màu sắc, gradient, hình ảnh cục bộ, GIF, video MP4, URL media trực tiếp, YouTube và các nguồn Pinterest. |
| **Tích hợp Now Playing** | Hiển thị ảnh bìa album, thông tin bài hát và hiệu ứng hình ảnh phản ứng theo âm thanh từ ứng dụng Windows cục bộ. |
| **Explore và Library** | Nhập preset từ cộng đồng, chỉnh sửa mọi phần, sắp xếp mục yêu thích và duy trì bộ sưu tập preset cục bộ của riêng bạn. |
| **Ưu tiên lưu trữ cục bộ** | Preset sử dụng LocalStorage; media cục bộ sử dụng IndexedDB và được giữ trên thiết bị của bạn. |
| **Trình chỉnh sửa đa ngôn ngữ** | Sử dụng giao diện với 25 ngôn ngữ được hỗ trợ. |

### Các thành phần lớp phủ

Trình chỉnh sửa hiện tại nhóm các thành phần lớp phủ thành bốn danh mục rõ ràng:

| Nội dung | Dữ liệu | Thời gian | Âm thanh |
|---|---|---|---|
| Văn bản | Cảm biến | Đồng hồ số | Ảnh bìa album |
| Hình dạng | Đồ họa dạng tia | Đồng hồ kim | Văn bản Now Playing |
| Biểu tượng | Đồ họa tuyến tính | Ngày tháng | Bộ hiển thị âm thanh |
| Sticker | Đồ họa hình tròn |  |  |
| Hình ảnh | Biểu đồ cảm biến |  |  |

Mỗi thành phần sử dụng cùng một quy trình trực quan bất cứ khi nào có thể: chọn thành phần đó trong bản xem trước hoặc danh sách lớp, sau đó điều chỉnh vị trí, kích thước, góc xoay, thứ tự, kiểu dáng và các cài đặt riêng theo từng loại.

### Giám sát phần cứng

Tạo các bố cục trực tiếp bằng dữ liệu giám sát có sẵn của NZXT CAM, bao gồm:

`nhiệt độ CPU` · `tải CPU` · `tần số CPU` · `công suất CPU` · `tốc độ quạt CPU` · `nhiệt độ GPU` · `tải GPU` · `tần số GPU` · `công suất GPU` · `tốc độ quạt GPU` · `mức sử dụng RAM` · `nhiệt độ dung dịch làm mát`

Các hệ thống nhiều GPU có thể tự động chọn GPU đang hoạt động hoặc sử dụng một GPU cụ thể. Trình chỉnh sửa trên trình duyệt cũng cung cấp các giá trị giả lập khi API của NZXT CAM không khả dụng, để bố cục vẫn có thể được thiết kế và xem trước.

### Nền và media

Sử dụng một màu đặc hoặc gradient làm nền, sau đó thêm media từ:

- Tệp PNG, JPG, GIF, WebP hoặc MP4 cục bộ
- URL hình ảnh và video trực tiếp
- Video YouTube
- Liên kết media từ Pinterest

Media nền có thể được định vị, thay đổi tỷ lệ, căn chỉnh và kết hợp với bất kỳ bố cục lớp phủ nào. Các tệp cục bộ được lưu trong IndexedDB và không được NZXT-ESC tải lên bất kỳ nơi nào.

### Preset, Explore và Library

- Lưu và sắp xếp tối đa **20 preset tùy chỉnh** trong Library cục bộ.
- Xây dựng mỗi preset với tối đa **40 thành phần lớp phủ**.
- Nhập và xuất các tệp preset có thể chỉnh sửa để sao lưu hoặc chia sẻ.
- Duyệt các bố cục do cộng đồng tạo ra thông qua **Explore**.
- Thêm một preset từ Explore vào Library, tùy chỉnh nó và biến nó thành của riêng bạn.
- Giữ việc chỉnh sửa và hiển thị trên Kraken đồng bộ giữa hai chế độ xem của NZXT CAM.

## Now Playing và Bộ Hiển Thị Âm Thanh

Ứng dụng đồng hành Windows tùy chọn [NowPlaying.WebSocket](https://github.com/mrgogo7/NowPlaying.WebSocket) chạy cục bộ và gửi dữ liệu phiên media cùng phổ âm thanh đến NZXT-ESC thông qua kết nối WebSocket cục bộ.

Sử dụng nó để thêm:

- **Ảnh bìa album** ảnh bìa hiện tại với các tùy chỉnh kích thước, viền và góc bo
- **Văn bản Now Playing** tiêu đề, nghệ sĩ hoặc album với hiệu ứng cuộn văn bản dài
- **Bộ hiển thị âm thanh** hiệu ứng hình ảnh phổ và dạng sóng thời gian thực có thể tùy chỉnh

Không giới hạn ở Spotify. Ứng dụng đồng hành đọc các phiên media Windows được hỗ trợ và đầu ra âm thanh hệ thống từ trình duyệt, trình phát media và các ứng dụng khác.

<a id="languages"></a>
## Ngôn Ngữ

Trình chỉnh sửa hiện đang hỗ trợ:

`English` · `Türkçe` · `Español` · `Deutsch` · `Português` · `Français`
· `Italiano` · `日本語` · `ไทย` · `Polski` · `Svenska` · `Nederlands`
· `한국어` · `Русский` · `हिन्दी` · `Bahasa Indonesia` · `Čeština`
· `Filipino` · `العربية` · `Bahasa Melayu` · `Ελληνικά` · `繁體中文` · `Tiếng Việt` · `Українська` · `Magyar`

**Tài liệu đã dịch:**
[English](../README.md) ·
[Türkçe](README.tr.md) ·
[Español](README.es.md) ·
[Deutsch](README.de.md) ·
[Português-BR](README.pt-BR.md) ·
[Français](README.fr.md) ·
[Italiano](README.it.md) ·
[日本語](README.ja.md) ·
[ไทย](README.th.md) ·
[Polski](README.pl.md) ·
[Svenska](README.sv.md) ·
[Nederlands](README.nl.md) ·
[한국어](README.ko.md) ·
[Русский](README.ru.md) ·
[हिन्दी](README.hi.md) ·
[Bahasa Indonesia](README.id.md) ·
[Čeština](README.cs.md) ·
[Filipino](README.fil.md) ·
[العربية](README.ar.md) ·
[Bahasa Melayu](README.ms.md) ·
[Ελληνικά](README.el.md) ·
[繁體中文](README.zh-TW.md) ·
[Tiếng Việt](README.vi.md) ·
[Українська](README.uk.md) ·
[Magyar](README.hu.md)

## Quyền riêng tư và lưu trữ cục bộ

NZXT-ESC được thiết kế xoay quanh việc lưu trữ cục bộ trên trình duyệt:

- Cấu hình preset được lưu trong **LocalStorage**.
- Hình ảnh và video cục bộ được lưu trong **IndexedDB**.
- Dữ liệu cảm biến NZXT CAM và các preset do người dùng tạo ra không được gửi đến hệ thống phân tích.
- Ứng dụng không cố ý thu thập bất kỳ thông tin nhận dạng cá nhân nào.

Trang web sản phẩm sử dụng **Google Tag Manager** và **Google Analytics 4** cho phân tích sản phẩm ẩn danh tùy chọn. **CookieYes** quản lý sự đồng ý khi cần thiết, và cookie của Google Analytics chỉ được kích hoạt theo lựa chọn đồng ý của người dùng.

Trang web đã triển khai cũng sử dụng **Cloudflare Web Analytics**, được kích hoạt thông qua Cloudflare Pages và hoạt động độc lập với Google Tag Manager. Nó cung cấp phân tích lưu lượng truy cập và hiệu suất trang web ưu tiên quyền riêng tư mà không sử dụng cookie hay LocalStorage.

### Đóng góp

Các đóng góp và pull request có mục tiêu rõ ràng đều được hoan nghênh. Trước khi thực hiện các thay đổi về kiến trúc, hãy đọc:

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Quy Tắc Ứng Xử](../CODE_OF_CONDUCT.md)
- [Chính Sách Bảo Mật](../SECURITY.md)

<a id="faq"></a>
## Câu Hỏi Thường Gặp

<details>
<summary><strong>Tôi có cần cài đặt NZXT-ESC không?</strong></summary>

Trình chỉnh sửa cốt lõi không yêu cầu cài đặt riêng. Mở nó thông qua NZXT CAM Web Integration. Chỉ các lớp phủ âm nhạc tùy chọn mới cần ứng dụng đồng hành Windows NowPlaying.WebSocket cục bộ.

</details>

<details>
<summary><strong>NZXT-ESC có hoạt động mà không cần NZXT CAM không?</strong></summary>

Trình chỉnh sửa có thể được mở trong một trình duyệt thông thường và sử dụng các giá trị cảm biến giả lập để thiết kế. Việc giám sát phần cứng trực tiếp và hiển thị trên màn hình Kraken yêu cầu NZXT CAM Web Integration.

</details>

<details>
<summary><strong>Những mẫu NZXT Kraken nào được hỗ trợ?</strong></summary>

NZXT-ESC hỗ trợ các bộ tản nhiệt có LCD thuộc dòng **NZXT Kraken Elite, Kraken Plus, Kraken (2023) và Kraken Z series** cung cấp chế độ hiển thị NZXT CAM Web Integration.

Xem danh sách đầy đủ [Các Mẫu LCD NZXT Kraken Được Hỗ Trợ](#supported-nzxt-kraken-lcd-models).

</details>

<details>
<summary><strong>Preset và media cục bộ được lưu ở đâu?</strong></summary>

Preset được lưu trong LocalStorage của trình duyệt. Hình ảnh và video cục bộ được lưu trong IndexedDB. Hãy xuất các preset quan trọng thường xuyên khi chuyển sang trình duyệt, bản cài đặt Windows hoặc máy tính khác.

</details>

<details>
<summary><strong>Now Playing có cần Spotify không?</strong></summary>

Không. NowPlaying.WebSocket sử dụng các phiên media Windows được hỗ trợ và âm thanh hệ thống, nên nó có thể hoạt động với trình duyệt và các ứng dụng media tương thích khác.

</details>

<details>
<summary><strong>Preset của cộng đồng có thể chỉnh sửa được không?</strong></summary>

Có. Các preset được nhập từ Explore có thể chỉnh sửa hoàn toàn sau khi được thêm vào Library.

</details>

<details>
<summary><strong>Supporter Access hoạt động như thế nào?</strong></summary>

NZXT-ESC được phát triển và duy trì một cách độc lập. Sau khi bạn đã có đủ thời gian để thực sự trải nghiệm dự án, NZXT-ESC có thể hỏi liệu bạn có muốn ủng hộ để dự án tiếp tục phát triển hay cần thêm chút thời gian để quyết định.

Ủng hộ không nhất thiết phải là tiền bạc. Phản hồi, báo cáo lỗi, ý tưởng, chia sẻ dự án, giúp người khác biết đến dự án và các đóng góp ý nghĩa khác từ cộng đồng đều giúp NZXT-ESC phát triển.

Mã Supporter Access dành cho những người ủng hộ dự án và cũng có thể được tặng cho các thành viên cộng đồng có đóng góp ý nghĩa cho NZXT-ESC.

Thời gian sử dụng chỉ được tính khi NZXT-ESC đang chạy trực tiếp trên màn hình Kraken.

</details>

<a id="license"></a>
## Giấy Phép

NZXT-ESC được phát hành theo **Giấy Phép Sử Dụng Cá Nhân**.

**Được phép:** sử dụng cá nhân, tùy chỉnh cá nhân và phân phối lại kèm ghi công rõ ràng cho dự án gốc.

**Sử dụng thương mại:** bán, đóng gói kèm sản phẩm khác, cho thuê, tích hợp vào một sản phẩm trả phí hoặc bất kỳ hình thức sử dụng kiếm lợi nhuận nào khác đều cần có sự cho phép bằng văn bản trước từ chủ sở hữu dự án.
Xem [toàn bộ điều khoản trong LICENSE](../LICENSE).

## Hỗ trợ và cộng đồng

- **Website:** [nzxt-esc.pages.dev](https://nzxt-esc.pages.dev/)
- **YouTube:** [@nzxt-esc](https://youtube.com/@nzxt-esc)
- **Instagram:** [@nzxtesc](https://www.instagram.com/nzxtesc/)
- **Phiên bản mới nhất:** [GitHub Releases](https://github.com/mrgogo7/nzxt-esc/releases/latest)
- **Báo cáo lỗi và ý tưởng:** [GitHub Issues](https://github.com/mrgogo7/nzxt-esc/issues)

Theo dõi NZXT-ESC trên YouTube và Instagram để xem các bản demo, tính năng mới, hướng dẫn, thiết lập của cộng đồng và các cập nhật của dự án.

Nếu NZXT-ESC đã có một vị trí trong thiết lập của bạn, có nhiều cách để ủng hộ dự án: chia sẻ phản hồi và ý tưởng, báo cáo lỗi, giúp người khác biết đến NZXT-ESC, đóng góp cho cộng đồng, hoặc đơn giản là mời tôi một tách cà phê.

Mọi hình thức đóng góp đều giúp NZXT-ESC tiến xa hơn, trong khi việc ủng hộ cà phê giúp trang trải chi phí server, API, hosting và bảo trì.

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge)](https://buymeacoffee.com/mrgogo)

Được xây dựng bởi **Gökhan AKGÜL (mRGogo)** - vận hành bằng cà phê và những giờ giấc ngủ đáng ngờ.

</div>
