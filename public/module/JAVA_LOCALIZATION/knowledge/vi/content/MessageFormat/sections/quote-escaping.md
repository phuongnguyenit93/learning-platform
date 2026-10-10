`MessageFormat` dùng dấu `'` làm ký tự trích dẫn trong mẫu. Đây là nguồn lỗi rất phổ biến.

Ví dụ để tạo dấu nháy đơn hiển thị trực tiếp, thường phải dùng hai dấu nháy đơn:

```java
MessageFormat format = new MessageFormat(
        "User ''{0}'' has {1,number} orders",
        Locale.US
);
```

Vì người dịch có thể thêm dấu nháy đơn tự nhiên trong một ngôn ngữ, mẫu cần được kiểm thử như mã nguồn. Không nên cho rằng văn bản dịch “chỉ là String nên không thể làm hỏng bộ định dạng”.

Quy tắc an toàn:

```text
giá trị tài nguyên dùng MessageFormat
→ được xem là mẫu
→ tham số giữ chỗ và dấu nháy đơn có cú pháp riêng
→ phải kiểm thử với đối số thực tế
```

Nếu thông điệp không cần tham số, không bắt buộc phải đưa qua `MessageFormat`.
