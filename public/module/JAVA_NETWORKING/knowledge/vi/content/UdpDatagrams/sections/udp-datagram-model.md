UDP dùng mô hình **datagram**: mỗi lần gửi tạo ra một đơn vị dữ liệu độc lập có payload và endpoint đích. Java biểu diễn socket UDP bằng `DatagramSocket` và đơn vị gửi/nhận bằng `DatagramPacket`.

Khác với TCP, phía nhận không có `listen()`/`accept()` để tạo một kết nối mới cho từng peer. Một `DatagramSocket` thường bind vào endpoint local rồi nhận nhiều datagram trên cùng socket:

```text
bên gửi A ---- datagram ----\
                              > DatagramSocket bind vào cổng local
bên gửi B ---- datagram ----/
```

Ví dụ phía nhận tối giản:

```java
try (DatagramSocket socket = new DatagramSocket(9000)) {
    byte[] buffer = new byte[2048];
    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

    socket.receive(packet);

    String text = new String(
            packet.getData(),
            packet.getOffset(),
            packet.getLength(),
            StandardCharsets.UTF_8);
}
```

`receive()` trên `DatagramSocket` ở chế độ blocking thông thường sẽ chờ cho tới khi một datagram đến hoặc thao tác kết thúc vì timeout/lỗi/đóng socket. Mỗi lần `receive()` xử lý tối đa một datagram; Java không ghép nhiều datagram thành một byte stream như TCP.

UDP phù hợp khi ứng dụng muốn giữ ranh giới message và chấp nhận tự quyết định cách xử lý mất gói, thứ tự, retry hoặc dữ liệu cũ. Những chính sách đó thuộc protocol/tầng ứng dụng; `DatagramSocket` chỉ cung cấp cơ chế gửi và nhận datagram.
