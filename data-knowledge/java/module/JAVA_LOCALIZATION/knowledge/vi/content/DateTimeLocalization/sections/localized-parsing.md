Việc phân tích dữ liệu người dùng nhập cũng cần Locale nếu văn bản có tên tháng/ngày hoặc mẫu phụ thuộc Locale:

```java
DateTimeFormatter formatter = DateTimeFormatter
        .ofPattern("d MMMM uuuu", Locale.forLanguageTag("vi-VN"));

LocalDate date = LocalDate.parse(input, formatter);
```

Nhưng hợp đồng ngày giờ giữa các hệ thống nên dùng định dạng chuẩn, rõ ràng như ISO thay vì văn bản hiển thị phụ thuộc Locale:

```java
Instant.parse("2026-09-27T08:30:00Z");
LocalDate.parse("2026-09-27");
```

Quy tắc:

```text
hiển thị/nhập liệu cho con người
→ bộ định dạng theo Locale khi phù hợp

hợp đồng dành cho máy / dữ liệu lưu trữ
→ định dạng ổn định và tường minh, thường là ISO
```

Khi phân tích văn bản theo Locale, ứng dụng cũng phải quyết định chính sách phân giải/kiểm tra dữ liệu và xử lý `DateTimeParseException`; đừng coi dữ liệu hiển thị là biểu diễn chuẩn của giá trị nghiệp vụ.

Chương kế tiếp chuyển sang cột mốc về **văn bản ngôn ngữ tự nhiên**: trước hết là cách `BreakIterator` tìm ranh giới ký tự/từ/câu/dòng, sau đó là cách `Bidi` phân tích văn bản trộn hướng LTR/RTL. Cơ chế dự phòng của `ResourceBundle` sẽ được tổng hợp ở cột mốc cuối cùng cùng các rủi ro của Locale mặc định.
