Với đầu ra có bộ đệm, dữ liệu ứng dụng vừa ghi có thể vẫn chỉ nằm trong bộ nhớ của lớp bọc. `flush()` yêu cầu stream hoặc writer đẩy dữ liệu đang chờ xuống **tầng bên dưới**.

```text
ứng dụng
    ↓ write
bộ đệm
    ↓ flush
stream/writer bên dưới
    ↓
hệ điều hành / thiết bị / đầu bên kia
```

`flush()` quan trọng khi bên nhận cần thấy dữ liệu **trước khi luồng bị đóng**, ví dụ:

- giao thức yêu cầu/phản hồi đang chờ thông điệp hiện tại;
- chương trình tương tác cần hiển thị lời nhắc ngay;
- một `Writer` sống lâu nhưng một nhóm dữ liệu có ý nghĩa đã hoàn thành.

Ví dụ:

```java
try (java.io.BufferedWriter writer =
         new java.io.BufferedWriter(
             new java.io.OutputStreamWriter(
                 socketOutputStream,
                 java.nio.charset.StandardCharsets.UTF_8))) {
    writer.write("PING");
    writer.newLine();
    writer.flush(); // đẩy phần đang chờ xuống tầng dưới ngay lúc này
}
```

`socketOutputStream` trong ví dụ là biến minh họa đại diện cho một luồng đầu ra đã được lấy từ socket; nó không phải tên API JDK đặc biệt.

`flush()` **không đồng nghĩa dữ liệu đã bền vững trên đĩa vật lý**. Nó chỉ đẩy dữ liệu qua các bộ đệm do lớp hiện tại kiểm soát xuống tầng tiếp theo. **Độ bền dữ liệu (durability)** là mức bảo đảm dữ liệu vẫn tồn tại sau các sự cố mà hệ thống quan tâm; với tệp, yêu cầu này liên quan tới hệ thống tệp và các cơ chế sâu hơn như `FileDescriptor.sync()` hoặc `FileChannel.force(...)`.

Các lớp bọc đầu ra thông thường thực hiện phần đẩy dữ liệu cần thiết khi `close()`. Với tài nguyên sống ngắn trong `try-with-resources`, gọi `flush()` ngay trước `close()` chỉ theo thói quen thường là dư thừa. Chủ động gọi `flush()` có ý nghĩa khi mã cần tạo một ranh giới để bên nhận quan sát dữ liệu hoặc hoàn tất một bước giao thức trong khi tài nguyên vẫn mở.
