Tên `DatagramSocket.connect(...)` dễ gây nhầm nếu áp mental model của TCP. Với UDP, `connect` **không thực hiện handshake kiểu TCP và không tạo một phiên đáng tin cậy**. Nó gắn socket với một IP/port từ xa cụ thể.

Sau khi connect:

- socket có một peer từ xa mặc định;
- với peer unicast thông thường, datagram nhận qua socket được lọc theo đúng peer đã gắn;
- `send()` phải nhắm tới peer phù hợp; packet mang địa chỉ khác với peer từ xa đã connect sẽ bị từ chối;
- mã có thể dùng thông tin peer từ xa từ `getRemoteSocketAddress()` và một số API trở nên thuận tiện hơn.

Địa chỉ multicast là trường hợp đặc biệt: datagram socket connect tới địa chỉ multicast chỉ dùng để gửi và không có cùng mô hình lọc phía nhận như unicast.

```java
try (DatagramSocket socket = new DatagramSocket()) {
    InetSocketAddress peer = new InetSocketAddress("127.0.0.1", 9000);
    socket.connect(peer);

    byte[] data = "PING".getBytes(StandardCharsets.UTF_8);
    DatagramPacket packet = new DatagramPacket(data, data.length, peer);
    socket.send(packet); // target phải khớp peer đã connect
}
```

`connect()` không làm peer phải tồn tại hay phải "accept" kết nối. Việc một datagram gửi đi có đến hay được ứng dụng phía bên kia xử lý vẫn tuân theo UDP semantics. Với datagram socket đã connect, lỗi đích không thể truy cập **có thể** xuất hiện dưới dạng `PortUnreachableException`, nhưng Java API không bảo đảm exception này luôn xảy ra.

Khi `disconnect()` thành công, nó bỏ liên kết với peer từ xa và đưa socket trở lại cách dùng chưa connect, nơi mỗi packet có thể chỉ định peer riêng. Java 21 còn cho phép `disconnect()` ném `UncheckedIOException` nếu việc ngắt liên kết gặp lỗi; khi đó trạng thái socket có thể không xác định và cách an toàn là đóng socket thay vì tiếp tục tái sử dụng. Vì vậy hãy dùng UDP `connect()` khi một socket chủ yếu giao tiếp với một peer và việc lọc peer/địa chỉ đích mặc định có ích, chứ không phải vì cần vòng đời kết nối kiểu TCP.
