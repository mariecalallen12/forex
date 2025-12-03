# Phân tích chi tiết trang web CME‑Trading.online

## 1. Giao diện người dùng (UI)

### Bố cục tổng thể

Thanh trên cùng (Header) – Ở trang landing page chưa đăng nhập, header cố định ở đầu trang chứa logo/biểu tượng, các liên kết Home, Features, About, Review, Help và nút Get started nổi bật màu vàng. Khi đăng nhập, header đổi thành thanh màu đen với avatar người dùng, biểu tượng thông báo và lựa chọn ngôn ngữ (ví dụ cờ Anh để chọn tiếng Anh).
Khu vực nội dung (Content area) – Ở trang chủ (dashboard), dưới hero có hai thẻ lớn: một thẻ Deposit với icon ví và mũi tên; thẻ còn lại là Customer service màu xanh lam, dẫn tới trang chat hỗ trợ trực tuyến. Dưới cùng là danh sách cặp giao dịch phổ biến trình bày theo dạng lưới (cards) hiển thị tên cặp, giá và % thay đổi 24h[[1]](https://cme-trading.online/market).
Lưới chức năng – Bên dưới danh sách giao dịch là lưới 2×4 gồm các icon và nhãn: Study, Help Center, Invite friends, Savings interest, VIP, Trading Robot, Leaderboard, Mining[[2]](https://cme-trading.online/board). Mỗi ô mở ra trang chức năng riêng.
Thanh điều hướng dưới (Bottom navigation) – Cố định ở cuối màn hình với bốn icon: Home, Market, Trade, Asset. Thanh này được thiết kế theo phong cách ứng dụng di động và luôn hiển thị khi người dùng cuộn trang.
Trang “Market” – Chia tab rõ ràng: GOODS, CRYPTOCURRENCY, MONEY. Mỗi tab hiển thị bảng gồm cột tên cặp và khối lượng giao dịch, giá hiện tại và % tăng/giảm 24 giờ[[1]](https://cme-trading.online/market).
Trang “Trade” (Giao dịch) – Có hai tab Chart và Transaction. Tab Transaction hiển thị giao diện mua bán với các tùy chọn mức lợi nhuận/thời gian (5 % – 1 phút, 10 % – 2 phút …), thanh trượt đặt số tiền đầu tư và hai nút Buy up (xanh) & Buy down (đỏ). Bên phải là biểu đồ sổ lệnh (order book) hiển thị mức giá và khối lượng[[3]](https://cme-trading.online/contract).
Trang “Asset” – Thể hiện tổng tài sản, lợi nhuận trong ngày, biểu đồ đường nhỏ và các nút tác vụ: Deposit, Withdraw, Order, Bill. Dưới đó là danh sách số dư theo danh mục (Money, Financial Management, Trading Robot, Healing)[[4]](https://cme-trading.online/member/withdraw).

### Thiết kế responsive

Trang sử dụng thiết kế mobile‑first. Mọi nội dung hiển thị trong khung tối đa ~450 px giống ứng dụng di động; khi mở trên màn hình lớn vẫn giữ bố cục dọc với phần tử co dãn.
Thanh điều hướng dưới và các thẻ có kích thước lớn, phù hợp thao tác cảm ứng.
Source code cho thấy sử dụng hệ lưới của Tailwind CSS và các lớp lg:col-span-* để chia cột khác nhau trên màn hình lớn[[5]](https://cme-trading.online/). Điều này gợi ý bố cục thay đổi khi chuyển sang desktop (ví dụ hero được chia thành 7/12 và 5/12 cột).
Ở chế độ desktop, trang landing có thêm thanh menu ngang và các hình ảnh/animation lớn; ở chế độ di động (sau đăng nhập) layout tối giản hơn, chỉ hiển thị các tính năng chính qua lưới icon và bottom nav.

### Màu sắc và font chữ

Tông màu chủ đạo là đen (#13111a) cho nền, với văn bản trắng/xám. Màu nhấn gồm xanh lam (#006aff và #196aff) cho nút thông thường, xanh lá (#00ac47) cho hành động tích cực, đỏ (#ff4d4f) cho hành động giảm/giá giảm, vàng (#f7a600) cho nút “Get started” và CTA trên landing[[2]](https://cme-trading.online/board).
Font chữ sử dụng họ Mulish (import từ Google Fonts) với nhiều độ dày; tiêu đề dùng font to (~24–40 px) và đậm, nội dung dùng kích thước 14–16 px, nhẹ hơn[[6]](https://cme-trading.online/#:~:text=%3Chead%3E%3Cmeta%20charset%3D%22utf,fff%5D%22%20href%3D%22%2F%23%22%3E%3Cspan%3EHelp%3C%2Fspan%3E%3C%2Fa%3E%3C%2Fdiv%3E%3Ca).
Độ tương phản cao giúp nội dung nổi bật trên nền tối; các nút có màu nền sáng và chữ tối để thu hút sự chú ý.

### Hình ảnh và Icons

Phong cách hình ảnh: Trang landing sử dụng hình minh họa 3D, biểu tượng tiền điện tử và đồ họa gradient; trang dashboard sử dụng hình nền video/ảnh stock liên quan tới giao dịch hàng hóa.
Định dạng ảnh: Nhiều ảnh ở trang landing dùng định dạng WebP (*.webp) để tối ưu kích thước; ngoài ra còn có PNG/JPG.
Icons: Các chức năng (Deposit, VIP…) dùng icon nét đơn giản theo phong cách line‑art. Trang sử dụng biểu tượng ngoài như flag cho ngôn ngữ, bell cho thông báo và icon mũi tên cho navigation.
Tối ưu hóa tải ảnh: View‑source cho thấy có lớp page-loading với ảnh loading và CSS lazy (ứng dụng effect). Hầu hết ảnh có thuộc tính alt[[5]](https://cme-trading.online/).

## 2. Trải nghiệm người dùng (UX) và Tương tác

### Luồng điều hướng

Đăng nhập/đăng ký: Người dùng được chuyển tới trang /m, chọn ngôn ngữ và nhấn Skip để vào trang Login. Tại đây có hai tab Phone number và Email; sau khi nhập số điện thoại và mật khẩu và bấm Login sẽ chuyển sang dashboard.
Điều hướng chính: Sau đăng nhập, người dùng chủ yếu sử dụng thanh nav dưới để truy cập Home, Market, Trade và Asset. Phần lưới icon trên trang Home giúp truy cập nhanh Study, Help Center, Invite friends, VIP, Savings interest, Trading Robot, Leaderboard, Mining.
CTA: Nút Deposit (gửi tiền), Buy up/Buy down (mở lệnh), Contact customer service và Invite friends được thiết kế nổi bật. Nút màu xanh/đỏ giúp phân biệt lệnh mua lên – mua xuống[[3]](https://cme-trading.online/contract).
Breadcrumbs: Mỗi trang con có nút mũi tên “Back” ở góc trên để trở về trang trước; không có thanh breadcrumb dạng chuỗi.

### Hiệu ứng và chuyển động

Trang landing có nhiều animation: các hình tròn và biểu tượng chuyển động nhẹ; nút Get started có hiệu ứng dịch chuyển viền khi hover[[7]](https://cme-trading.online/#:~:text=class%3D%22relative%20group%20flex%20items,20px%5D%20bitcoin%22%3E%3Cimg%20class%3D%22%22%20src%3D%22https%3A%2F%2Fapi.demo92.apptestlive.com%2Fassets%2Fimages%2Fbitcoin3.png).
Trong ứng dụng nội bộ, khi nhấn vào icon, trang mới trượt từ phải sang (transition).
Order book trong trang Transaction hiển thị histogram màu xanh/đỏ trượt theo thời gian, tạo cảm giác trực tiếp[[3]](https://cme-trading.online/contract).
Không thấy pop‑up quảng cáo; tuy nhiên trang Invite friends chứa landing với bố cục đơn giản.

### Form và Tương tác

Các loại form:
- Đăng nhập bằng số điện thoại hoặc email (yêu cầu mật khẩu).
Đăng ký (không truy cập trong quá trình nhưng dự kiến tương tự).
Deposit chỉ có một thẻ “Artificial Recycling”; khi nhấn sẽ mở hướng dẫn liên hệ dịch vụ AI.
Withdraw: form với các trường Account (select), Quantity, Security code và các nút Manage withdrawal password & Withdrawal Management; phía dưới hiển thị phí xử lý và nút Confirm[[4]](https://cme-trading.online/member/withdraw).
Trading: form đặt lệnh cho phép chọn % lợi nhuận/thời gian, nhập số USDT qua thanh trượt và bấm Buy up/Buy down[[3]](https://cme-trading.online/contract).
Validation: Khi bỏ trống trường số tiền/không đủ số dư, nút mua bán không hoạt động (xám).
Thành phần tương tác khác:
- Chat trực tuyến: Trang Customer service hiển thị khung chat với tin nhắn chào “How can we help you?” và ô nhập tin nhắn ở cuối trang[[8]](https://cme-trading.online/cskh).
Slider: Trang Transaction dùng thanh trượt để điều chỉnh số tiền đầu tư.
Tab: Chart/Transaction, Position/Order, Goods/Cryptocurrency/Money cho phép chuyển đổi nội dung.

## 3. Chức năng

### Xác thực người dùng

Đăng ký/Đăng nhập: Trang Login cho phép lựa chọn đăng nhập bằng số điện thoại hoặc email. Có liên kết Forgot password và Sign up (không thử do nhiệm vụ chỉ đăng nhập).
Quên mật khẩu: có tùy chọn nhưng chưa kiểm tra luồng.
Đăng nhập mạng xã hội: không thấy nút Google/Facebook, chỉ hỗ trợ tài khoản riêng.

### Chức năng cốt lõi

Giao dịch hợp đồng nhanh: Người dùng chọn một cặp (ví dụ COCOA/USDT), sau đó trên tab Transaction lựa chọn % lợi nhuận và thời gian, nhập số tiền (USDT) rồi bấm Buy up (dự đoán giá lên) hoặc Buy down (dự đoán giá xuống)[[3]](https://cme-trading.online/contract). Bảng order book ở bên phải giúp theo dõi giá.
Thị trường (Market): Xem danh sách hàng hóa (GOLD, SILVER, COFFEE…), tiền điện tử (BTC, ETH, BNB, LTC…) và tiền tệ (GBP/USDT, JPY/USDT…). Mỗi hàng có giá, khối lượng, % thay đổi; màu xanh/đỏ biểu thị tăng/giảm[[1]](https://cme-trading.online/market).
Tài sản (Asset): Hiển thị tổng tài sản, lợi nhuận, biểu đồ và phân chia danh mục. Cho phép gửi tiền (deposit), rút tiền (withdraw), xem lịch sử lệnh (Order) và lịch sử số dư (Bill) – đều hiển thị No data nếu chưa giao dịch[[4]](https://cme-trading.online/member/withdraw).
Leaderboard: Trang rank xếp hạng người dùng theo lợi nhuận và thu nhập 7 ngày; thông tin người dùng được ẩn bằng dấu ***; tỷ lệ lợi nhuận và thu nhập hiển thị theo % và số USDT[[9]](https://cme-trading.online/board).
VIP & Savings interest: Cả hai trang đều yêu cầu “Contact customer service consultant” để nâng cấp thành viên hoặc gửi tiết kiệm lấy lãi 1 %/ngày; trong vòng 24 giờ không thể rút tiền[[10]](https://cme-trading.online/saving).
Invite friends: Giải thích chương trình giới thiệu – chia sẻ liên kết, mời bạn nạp trên 50 USD và nhận voucher hoàn phí 100 USDT; có nút Trade để bắt đầu[[11]](https://cme-trading.online/invite).
Help Center/Study: Cung cấp bài viết hướng dẫn như How to make a deposit?, USDT vs. USDC vs. BUSD với ảnh minh hoạ và văn bản dài[[12]](https://cme-trading.online/help/detail/1).
Trading Robot & Mining: Chưa triển khai – khi truy cập hiển thị trang “Coming soon”.
Customer service: Chat trực tuyến với nhân viên hỗ trợ; có sẵn tin nhắn tự động chào hỏi và ô gửi ảnh/file[[8]](https://cme-trading.online/cskh).

### Tích hợp bên thứ ba

Chat trực tuyến: Tích hợp trình chat tùy chỉnh cho phép gửi tin nhắn, ảnh.
Bản đồ/Analytics: Không thấy bản đồ. Có thể sử dụng Google Analytics trong script nhưng không hiện rõ trong front‑end.
PWA: Có file manifest.json và meta tag mobile-web-app-capable – trang hỗ trợ cài đặt như ứng dụng di động[[6]](https://cme-trading.online/#:~:text=%3Chead%3E%3Cmeta%20charset%3D%22utf,fff%5D%22%20href%3D%22%2F%23%22%3E%3Cspan%3EHelp%3C%2Fspan%3E%3C%2Fa%3E%3C%2Fdiv%3E%3Ca).

## 4. Nội dung

### Trang tĩnh

About us & Features: Ở trang landing (chưa đăng nhập) có các mục Features, About, Review, Help trong menu. View‑source cho thấy trang giới thiệu slogan “New‑gen of digital exchange”, mô tả CME Group là nền tảng giao dịch đáng tin cậy, hình ảnh khách hàng và phần Discover more[[13]](https://cme-trading.online/).
Liên hệ (Contact us): Phần Customer service cung cấp khung chat trực tuyến, không có địa chỉ công ty hay email.
Chính sách/Điều khoản: Không thấy liên kết trong giao diện, có thể ẩn ở footer của trang landing (không hiển thị khi đăng nhập).
FAQ: Chưa thấy trang FAQ riêng, nhưng Help Center chứa bài viết hướng dẫn.

### Nội dung động

Tin tức/Bài viết: Mục Study và Help Center chứa nhiều bài viết giáo dục liên quan tới tiền điện tử và hướng dẫn sử dụng sàn[[12]](https://cme-trading.online/help/detail/1).
Thông tin sản phẩm: Trang Market cập nhật giá và % thay đổi của các cặp giao dịch theo thời gian thực; tuy nhiên giá của nhiều cặp hiển thị “0” nên dữ liệu có thể không đồng bộ.
Đánh giá/bình luận: Không có khu vực bình luận hay đánh giá của người dùng.

## 5. Kỹ thuật và Tối ưu hóa (Technical & SEO)

### Cấu trúc URL

Các URL sử dụng dạng RESTful, dễ hiểu: /market (danh sách thị trường), /contract?symbol=cocoa&type=commodity (giao dịch cặp cụ thể), /board/wallet (tài sản), /board/histories/balance (lịch sử số dư) v.v.
Trang bài viết sử dụng đường dẫn /news/detail/ID và /help/detail/ID; đường dẫn ngắn gọn, không chứa tham số dư thừa.
Khi xem trang landing, URL gốc / hiển thị trang giới thiệu; /m hiển thị trang login dạng di động; /board là dashboard sau đăng nhập.

### SEO On‑page

View‑source cho thấy trang có thẻ title và meta description mô tả “Futures & Options Trading for Risk Management – TOCOM”; cũng có các thẻ og:title, og:image, twitter:title phục vụ chia sẻ trên mạng xã hội[[6]](https://cme-trading.online/#:~:text=%3Chead%3E%3Cmeta%20charset%3D%22utf,fff%5D%22%20href%3D%22%2F%23%22%3E%3Cspan%3EHelp%3C%2Fspan%3E%3C%2Fa%3E%3C%2Fdiv%3E%3Ca).
meta viewport đặt chế độ phù hợp trên thiết bị di động (width=device-width, initial-scale=1, maximum-scale=1), giúp responsive.
Hầu hết hình ảnh có thuộc tính alt – điều này cải thiện khả năng truy cập và SEO[[14]](https://cme-trading.online/).
Các trang con (dashboard) không thay đổi tiêu đề trình duyệt; khi mở nhiều trang, tiêu đề vẫn là “Futures & Options Trading for Risk Management – TOCOM”, điều này có thể ảnh hưởng SEO (nên đặt tiêu đề riêng cho từng trang).

### Hiệu năng

Trang sử dụng Minified JS/CSS (tập tin main.4c2c0360.js và main.c455ed8c.css) để giảm kích thước tải.
Ảnh định dạng WebP, sử dụng thuộc tính preconnect với Google Fonts và manifest.json để tối ưu tải tài nguyên[[6]](https://cme-trading.online/#:~:text=%3Chead%3E%3Cmeta%20charset%3D%22utf,fff%5D%22%20href%3D%22%2F%23%22%3E%3Cspan%3EHelp%3C%2Fspan%3E%3C%2Fa%3E%3C%2Fdiv%3E%3Ca).
Tuy nhiên, việc dùng nhiều ảnh nền/video và animation có thể làm tăng thời gian tải trên mạng chậm. PageSpeed nên được kiểm tra thêm.
Không thấy lazy‑loading cho danh sách market; việc cuộn dài bảng giá có thể gây tiêu tốn tài nguyên.

## Tổng kết

CME‑Trading.online là một nền tảng giao dịch hợp đồng nhanh với giao diện tối ưu cho thiết bị di động. Trang dashboard hiển thị gọn gàng các cặp giao dịch phổ biến, lưới chức năng và thanh điều hướng dưới giống như ứng dụng. Giao diện tối, màu sắc tương phản và font Mulish mang lại cảm giác hiện đại. Người dùng có thể xem thị trường hàng hóa, tiền điện tử, tiền tệ; mở lệnh mua lên/mua xuống theo phần trăm lợi nhuận cố định; quản lý tài sản, rút và gửi tiền; xem bảng xếp hạng lợi nhuận; tham gia chương trình giới thiệu và đọc các bài hướng dẫn. Nhiều tính năng như VIP, gửi tiết kiệm, robot giao dịch và mining vẫn chưa hoạt động (chỉ hiển thị “Coming soon” hoặc yêu cầu liên hệ hỗ trợ). Website tích hợp khung chat trực tuyến nhưng thiếu thông tin liên hệ doanh nghiệp và trang điều khoản. Để clone 1‑1, nhóm phát triển cần tái tạo đầy đủ bố cục mobile‑first, hệ thống navigation, hiệu ứng, các form và chức năng kể trên, đồng thời tối ưu SEO/hiệu năng và bổ sung tiêu đề riêng cho từng trang.

[[1]](https://cme-trading.online/market) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/market](https://cme-trading.online/market)
[[2]](https://cme-trading.online/board) [[9]](https://cme-trading.online/board) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/board](https://cme-trading.online/board)
[[3]](https://cme-trading.online/contract) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/contract](https://cme-trading.online/contract)
[[4]](https://cme-trading.online/member/withdraw) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/member/withdraw](https://cme-trading.online/member/withdraw)
[[5]](https://cme-trading.online/) [[6]](https://cme-trading.online/#:~:text=%3Chead%3E%3Cmeta%20charset%3D%22utf,fff%5D%22%20href%3D%22%2F%23%22%3E%3Cspan%3EHelp%3C%2Fspan%3E%3C%2Fa%3E%3C%2Fdiv%3E%3Ca) [[7]](https://cme-trading.online/#:~:text=class%3D%22relative%20group%20flex%20items,20px%5D%20bitcoin%22%3E%3Cimg%20class%3D%22%22%20src%3D%22https%3A%2F%2Fapi.demo92.apptestlive.com%2Fassets%2Fimages%2Fbitcoin3.png) [[13]](https://cme-trading.online/) [[14]](https://cme-trading.online/) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/](https://cme-trading.online/)
[[8]](https://cme-trading.online/cskh) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/cskh](https://cme-trading.online/cskh)
[[10]](https://cme-trading.online/saving) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/saving](https://cme-trading.online/saving)
[[11]](https://cme-trading.online/invite) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/invite](https://cme-trading.online/invite)
[[12]](https://cme-trading.online/help/detail/1) Futures & Options Trading for Risk Management - TOCOM
[https://cme-trading.online/help/detail/1](https://cme-trading.online/help/detail/1)