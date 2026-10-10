TCP bảo toàn thứ tự byte, nhưng **không bảo toàn ranh giới giữa các lần `write()`**. Vì vậy mã kiểu "bên gửi gọi `write()` một lần thì bên nhận gọi `read()` một lần" không phải một protocol hợp lệ.

Giả sử bên gửi gửi hai payload:

```text
write("HELLO")
write("JAVA")
```

Bên nhận có thể quan sát các lần đọc như `"HEL"`, `"LOJA"`, `"VA"`, hoặc một cách chia khác. Chuỗi byte cuối cùng vẫn theo thứ tự `HELLOJAVA`; chỉ có kích thước từng lần đọc thay đổi.

Ứng dụng cần một quy tắc **framing**. Một số cách phổ biến:

- fixed length: mọi record có kích thước cố định;
- delimiter: ví dụ protocol text kết thúc từng dòng bằng `\n`, kèm quy tắc escape/encoding nếu payload có thể chứa delimiter;
- length prefix: gửi độ dài trước, sau đó đọc đúng số byte của payload;
- self-describing format: parser xác định điểm kết thúc theo format, nhưng vẫn cần xử lý dữ liệu đến theo từng phần.

Ví dụ length-prefix đơn giản:

```java
// sender
byte[] payload = "hello".getBytes(StandardCharsets.UTF_8);
DataOutputStream out = new DataOutputStream(socket.getOutputStream());
out.writeInt(payload.length);
out.write(payload);
out.flush();

// receiver
DataInputStream in = new DataInputStream(socket.getInputStream());
int length = in.readInt();
if (length < 0 || length > 1_048_576) {
    throw new IOException("Invalid frame length: " + length);
}
byte[] message = in.readNBytes(length);
if (message.length != length) {
    throw new EOFException("Connection ended in the middle of a frame");
}
```

Giới hạn `length` trước khi cấp phát bộ nhớ là một phần của framing an toàn. `readNBytes(length)` giúp mã yêu cầu đủ số byte, nhưng EOF vẫn có thể xuất hiện giữa frame và phải được xử lý như lỗi protocol hoặc việc kết thúc kết nối phù hợp với thiết kế ứng dụng.
