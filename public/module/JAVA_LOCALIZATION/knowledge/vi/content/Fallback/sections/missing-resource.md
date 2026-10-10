Hai trường hợp lỗi cần phân biệt:

```text
không tìm được gói tài nguyên hợp lệ
→ ResourceBundle.getBundle(...) có thể ném MissingResourceException

gói tài nguyên tồn tại nhưng khóa không tồn tại trong chuỗi tra cứu
→ getString(key) có thể ném MissingResourceException
```

Ví dụ:

```java
try {
    String message = bundle.getString("order.created");
} catch (MissingResourceException ex) {
    // ghi log/chuyển đổi/dự phòng theo chính sách của ứng dụng
}
```

Trong môi trường thật, tốt hơn là phát hiện lỗi sớm bằng kiểm thử:

```text
khóa của gói gốc
        ↓ so sánh
khóa của từng Locale
        ↓
báo khóa bị thiếu / dư
```

Không nên bắt mọi `MissingResourceException` rồi trả khóa như văn bản mà không ghi log/giám sát, vì điều đó có thể biến lỗi triển khai thành giao diện sai tồn tại lâu.

Cơ chế dự phòng là lớp an toàn và cơ chế tái sử dụng, không phải lý do để bỏ qua chất lượng bản dịch.

Chương cuối gom các lỗi thực tế khi lập trình viên để Locale mặc định hoặc văn bản đã định dạng len vào những nơi cần dữ liệu ổn định.
