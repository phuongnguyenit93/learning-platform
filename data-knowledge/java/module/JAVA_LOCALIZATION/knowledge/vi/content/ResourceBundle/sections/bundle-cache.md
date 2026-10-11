`ResourceBundle.getBundle(...)` có cơ chế bộ nhớ đệm để tránh đọc và tạo gói tài nguyên lặp lại cho cùng ngữ cảnh tra cứu.

Điều đó có hai ý nghĩa:

```text
hiệu năng
→ không phải tải tài nguyên từ đầu cho mỗi yêu cầu

cập nhật khi chương trình đang chạy
→ sửa tệp tài nguyên trên đĩa không có nghĩa JVM đang chạy sẽ thấy ngay lập tức
```

API hỗ trợ xóa bộ nhớ đệm khi thật sự cần:

```java
ResourceBundle.clearCache();
```

hoặc theo bộ nạp lớp (`ClassLoader`):

```java
ResourceBundle.clearCache(classLoader);
```

`ResourceBundle.Control` còn cho phép tùy biến TTL, tải lại và cách chọn ứng viên, nhưng đó là cơ chế nâng cao. Trước khi tùy biến, hãy xác định ứng dụng thật sự cần nạp lại tài nguyên khi đang chạy hay chỉ cần gói cố định theo mỗi lần triển khai.

Phần phân biệt **thiếu gói tài nguyên** với **thiếu khóa**, cùng chính sách xử lý `MissingResourceException`, được gom về cột mốc cuối trong chương Cơ chế dự phòng để học cùng toàn bộ hành vi dự phòng và xử lý lỗi của `ResourceBundle`.

Chương kế tiếp giải quyết bước sau tra cứu: thông điệp thường chứa dữ liệu động như tên người dùng, số lượng hoặc tổng tiền. **Ghép chuỗi thủ công không an toàn cho ngữ pháp của mọi ngôn ngữ**, nên Java có `MessageFormat`.
