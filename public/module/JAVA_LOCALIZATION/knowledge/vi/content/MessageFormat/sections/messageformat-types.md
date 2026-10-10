`MessageFormat` có thể áp dụng bộ định dạng con cho đối số:

```text
Total: {0,number}
Created: {1,date,medium}
```

```java
MessageFormat format = new MessageFormat(
        "Total: {0,number} - Created: {1,date,medium}",
        Locale.US
);
```

Các kiểu lịch sử của `MessageFormat` gắn với bộ định dạng trong `java.text` và các kiểu `Date`/số. Với miền nghiệp vụ dùng `java.time`, ứng dụng thường kiểm soát việc định dạng ngày giờ riêng bằng `DateTimeFormatter` rồi truyền văn bản đã được trình bày theo Locale vào thông điệp, hoặc thiết kế lớp chuyển đổi rõ ràng.

Kiểu `choice` tồn tại để chọn văn bản theo khoảng số, nhưng quy tắc số ít/số nhiều thực tế của nhiều ngôn ngữ phức tạp hơn rất nhiều. Không nên giả định một quy tắc kiểu `1 item / many items` đủ cho mọi ngôn ngữ.

Điểm học chính ở mô-đun Java Core là: **thông điệp có tham số phải tôn trọng Locale và cho phép bản dịch sở hữu cấu trúc câu**.
