Hãy chỉ rõ Charset ở ranh giới:

```java
byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
String restored = new String(bytes, StandardCharsets.UTF_8);
```

`StandardCharsets.UTF_8` làm hợp đồng rõ ràng và không phụ thuộc ngầm vào cấu hình máy chạy.

Nếu hai phía dùng Charset không khớp:

```text
văn bản
→ mã hóa UTF-8
→ byte
→ giải mã ISO-8859-1
→ mojibake / văn bản sai
```

Hệ thống truyền tải có thể đã chuyển byte hoàn toàn chính xác; lỗi nằm ở việc hai đầu không thống nhất cách diễn giải byte.

Vòng mã hóa/giải mã chỉ giữ được văn bản khi Charset và chính sách xử lý lỗi hỗ trợ toàn bộ đầu vào. Nếu Charset đích không biểu diễn được ký tự ban đầu, quá trình mã hóa có thể phải thay thế hoặc báo lỗi.

Một vòng mã hóa/giải mã đúng cần:

```text
văn bản
→ mã hóa bằng Charset A
→ byte
→ giải mã bằng Charset A
→ văn bản tương ứng
```
