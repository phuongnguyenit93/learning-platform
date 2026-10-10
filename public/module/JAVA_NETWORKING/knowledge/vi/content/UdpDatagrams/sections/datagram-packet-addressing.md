`DatagramPacket` mang cả **vùng dữ liệu** và **địa chỉ peer**. Ý nghĩa của địa chỉ phụ thuộc packet đang được dùng để gửi hay vừa được nhận.

Khi gửi, packet chứa địa chỉ đích:

```java
byte[] data = "PING".getBytes(StandardCharsets.UTF_8);
InetSocketAddress target = new InetSocketAddress("127.0.0.1", 9000);

DatagramPacket packet = new DatagramPacket(data, data.length, target);
socket.send(packet);
```

Khi nhận, `receive(packet)` điền buffer và cập nhật packet với địa chỉ/cổng của bên gửi. Vì thế một socket chưa `connect()` có thể trả lời đúng peer của từng datagram:

```java
byte[] buffer = new byte[2048];
DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
socket.receive(packet);

SocketAddress sender = packet.getSocketAddress();
int receivedLength = packet.getLength();

DatagramPacket reply = new DatagramPacket(
        packet.getData(),
        packet.getOffset(),
        receivedLength,
        sender);
socket.send(reply);
```

`getOffset()` và `getLength()` xác định vùng dữ liệu hợp lệ trong mảng nền; không nên xử lý toàn bộ `getData()` như thể mọi byte trong mảng đều thuộc message hiện tại.

Buffer nhận cũng đặt giới hạn cho datagram. Nếu message đến dài hơn length hiện tại của `DatagramPacket`, Java chỉ đặt phần vừa vào packet và **phần vượt quá bị cắt bỏ (truncate)** cho lần nhận đó. UDP không biến phần còn lại thành một `receive()` tiếp theo. Vì vậy kích thước buffer phải phù hợp với contract của protocol.

Sau khi nhận, `getLength()` cho biết độ dài message vừa nhận. Nếu ứng dụng chủ động gọi `setLength(...)`, giá trị đó sẽ đặt giới hạn vùng buffer dùng cho lần nhận tiếp theo; vì vậy chỉ thay đổi length khi protocol hoặc cách quản lý buffer thực sự yêu cầu.
