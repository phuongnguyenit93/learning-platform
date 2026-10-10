`ByteBuffer` vừa chứa byte vừa giữ trạng thái `position`, `limit` và `capacity`. I/O mạng cập nhật `position`, nên code phải quản lý trạng thái buffer cùng với trạng thái protocol.

Một lần `read()` hoặc `write()` **không đồng nghĩa toàn bộ frame đã được xử lý**:

- `read(buffer)` có thể đọc ít byte hơn `buffer.remaining()`; trong non-blocking mode nó có thể trả `0`; `-1` báo end-of-stream.
- `write(buffer)` có thể ghi ít hơn số byte còn lại. Nếu `buffer.hasRemaining()` vẫn đúng, phần còn lại phải được giữ để ghi tiếp.

Một thao tác ghi blocking đơn giản có thể lặp tới khi buffer hết dữ liệu:

```java
ByteBuffer out = StandardCharsets.UTF_8.encode("hello\n");
while (out.hasRemaining()) {
    channel.write(out);
}
```

Với non-blocking channel, không nên biến vòng lặp trên thành busy-spin khi `write()` trả `0`. Event loop thường giữ buffer đang gửi trong trạng thái kết nối và chỉ đăng ký `OP_WRITE` khi còn dữ liệu đang chờ gửi.

Phía đọc thường dùng chuỗi trạng thái:

```text
channel.read(buffer)
        ↓
buffer.flip()      // chuyển từ ghi vào buffer sang đọc dữ liệu đã nhận
        ↓
parse/tiêu thụ byte
        ↓
buffer.compact()   // giữ phần chưa parse, tạo chỗ cho lần read tiếp theo
```

`clear()` phù hợp khi toàn bộ dữ liệu cũ đã được tiêu thụ; `compact()` phù hợp khi còn partial frame. Đây là lý do trạng thái buffer và protocol framing phải được thiết kế cùng nhau trong mã mạng non-blocking.
