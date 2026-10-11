NIO networking giữ nguyên các khái niệm transport đã học ở TCP/UDP, nhưng thay lớp bọc stream bằng **channel + `ByteBuffer`** và cho phép chọn blocking hoặc non-blocking ở các channel có thể select.

- `SocketChannel` là channel cho socket hướng luồng và hỗ trợ `read`/`write` bằng `ByteBuffer`. Channel có thể đang chưa connect, đang chờ hoàn tất connect hoặc đã connected. `open()` mặc định dùng cho Internet stream socket; khi mở với `StandardProtocolFamily.UNIX`, cùng abstraction này dùng endpoint Unix-domain thay vì địa chỉ Internet.
- `ServerSocketChannel` bind/listen và `accept()` kết nối mới; kết quả là một `SocketChannel` riêng cho kết nối đó.
- `DatagramChannel` gửi/nhận datagram; nó giữ message boundary của UDP thay vì biến dữ liệu thành byte stream.

```java
try (ServerSocketChannel server = ServerSocketChannel.open()) {
    server.bind(new InetSocketAddress(8080));

    try (SocketChannel connection = server.accept()) {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        int read = connection.read(buffer);
    }
}
```

Các channel mới mặc định hoạt động theo blocking mode. Giá trị của NIO không nằm ở việc "channel luôn non-blocking"; cùng abstraction có thể dùng theo luồng xử lý blocking đơn giản hoặc chuyển sang non-blocking để đăng ký với `Selector`.

Với Internet stream socket, `SocketChannel` vẫn biểu diễn **byte stream**. Chuyển từ `Socket` sang `SocketChannel` không làm TCP xuất hiện message boundary. Protocol framing ở chương TCP vẫn áp dụng nguyên vẹn.
