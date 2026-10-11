`DatagramChannel` là đối tác NIO của `DatagramSocket`. Nó vẫn gửi và nhận **datagram**, nhưng dùng `ByteBuffer` và mô hình channel thay vì `DatagramPacket` làm abstraction chính.

Channel chưa connect dùng `send`/`receive` với địa chỉ của từng datagram:

```java
try (DatagramChannel channel = DatagramChannel.open()) {
    channel.bind(new InetSocketAddress(9000));

    ByteBuffer buffer = ByteBuffer.allocate(2048);
    SocketAddress sender = channel.receive(buffer);

    if (sender != null) {
        buffer.flip();
        channel.send(buffer, sender);
    }
}
```

Sau `connect(remote)`, `DatagramChannel` gắn với một peer cho tới khi `disconnect()` hoặc `close()`. Khi đó `read`/`write` có thể được dùng với peer đã connect; channel vẫn là transport datagram chứ không trở thành TCP stream.

Ranh giới quan trọng với NIO là mô hình thực thi:

- blocking mode: `receive()` có thể chờ tới khi datagram đến;
- non-blocking mode: nếu chưa có datagram sẵn, `receive()` trả `null` ngay;
- vì là `SelectableChannel`, `DatagramChannel` có thể đăng ký với `Selector` trong luồng xử lý non-blocking;
- multicast membership cũng có API channel riêng thông qua `join(...)` và `MembershipKey`.

Chương này chỉ đặt `DatagramChannel` vào đúng mô hình tư duy UDP. Chương kế tiếp trước hết thiết lập timeout, lỗi, cancellation và vòng đời tài nguyên áp dụng xuyên các kiểu socket; chương NIO Networking sau đó mới phát triển trạng thái `ByteBuffer`, selector readiness, registration/interest set và các mô hình thực thi của channel.
