**OpenRewrite** là một công cụ mã nguồn mở mạnh mẽ được thiết kế để tự động hóa việc tái cấu trúc mã nguồn (refactoring) trên quy mô lớn. Nó không chỉ đơn thuần là tìm kiếm và thay thế văn bản, mà nó thực sự "hiểu" cấu trúc của mã để thực hiện các thay đổi một cách thông minh và an toàn.

## 1. Cách thức hoạt động
OpenRewrite sử dụng một khái niệm gọi là **Lossless Semantic Tree (LST)**.

* **Phân tích:** Khi bạn chạy OpenRewrite, nó quét mã nguồn và xây dựng một cây sơ đồ chi tiết về cú pháp và ngữ nghĩa của code.
* **"Lossless" (Không mất mát):** Giữ nguyên định dạng gốc của bạn (khoảng trắng, chú thích, dấu ngoặc) để sau khi sửa đổi, mã trông vẫn tự nhiên.
* **Recipe (Công thức):** Áp dụng các quy tắc lập trình sẵn để tìm và sửa các mẫu mã cụ thể.

## 2. Các ứng dụng phổ biến
OpenRewrite đặc biệt mạnh mẽ trong hệ sinh thái Java và Spring Boot:

* **Nâng cấp Framework:** Tự động chuyển đổi từ Spring Boot 2.x lên 3.x, hoặc nâng cấp từ Java 8 lên Java 17/21.
* **Sửa lỗi bảo mật:** Tự động tìm các thư viện lỗi thời có lỗ hổng bảo mật (CVE) và cập nhật chúng.
* **Tuân thủ quy chuẩn (Linting):** Tự động sửa các lỗi phong cách code (xóa import thừa, đổi tên biến đúng chuẩn).
* **Di chuyển thư viện:** Chuyển đổi từ JUnit 4 sang JUnit 5 hoặc cập nhật Mockito.

## 3. Tại sao nó lại hữu ích?
Trong các dự án lớn (Multi-module hoặc Microservices), việc nâng cấp thủ công là cực kỳ rủi ro. OpenRewrite giúp:

* **Tiết kiệm thời gian:** Thực hiện hàng nghìn thay đổi chỉ trong vài giây.
* **Đảm bảo tính nhất quán:** Tất cả các module đều áp dụng cùng một tiêu chuẩn sửa đổi.
* **Tích hợp dễ dàng:** Chạy thông qua Gradle hoặc Maven plugin mà không cần cài đặt phức tạp.

## 4. Ví dụ lệnh chạy với Gradle
Để sử dụng OpenRewrite kiểm tra các Best practices cho dự án Java, bạn thêm plugin vào `build.gradle` và chạy lệnh sau:

	```bash
	./gradlew rewriteRun
	```

---

### 💡 Lưu ý cho dự án java-learning:
Khi bạn có kế hoạch chuyển đổi dự án từ Java 11 lên Java 21 để sử dụng **Virtual Threads**, OpenRewrite sẽ là "trợ thủ" đắc lực giúp bạn quét lại toàn bộ mã nguồn và gợi ý những thay đổi cần thiết để tương thích với phiên bản mới nhất.
