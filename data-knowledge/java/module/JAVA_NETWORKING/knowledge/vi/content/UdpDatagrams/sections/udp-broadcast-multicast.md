Broadcast và multicast đều gửi datagram tới nhiều phía nhận tiềm năng, nhưng chúng dùng hai mô hình địa chỉ khác nhau.

**Broadcast** dùng một broadcast address của mạng IPv4. `DatagramSocket` có socket option `SO_BROADCAST`; trên các cách triển khai phù hợp, socket mới thường bật option này để cho phép gửi broadcast. Java API khuyến nghị phía nhận muốn nhận broadcast nên bind vào wildcard address vì việc nhận broadcast khi bind vào một địa chỉ cụ thể có thể phụ thuộc cách triển khai.

```java
try (DatagramSocket socket = new DatagramSocket()) {
    socket.setBroadcast(true);

    byte[] data = "DISCOVER".getBytes(StandardCharsets.UTF_8);
    DatagramPacket packet = new DatagramPacket(
            data,
            data.length,
            new InetSocketAddress("255.255.255.255", 9000));
    socket.send(packet);
}
```

Địa chỉ broadcast thực tế thường phụ thuộc mạng/subnet; ví dụ trên chỉ minh họa ranh giới API.

**Multicast** gửi tới một multicast group. Java cung cấp `MulticastSocket`, một lớp con của `DatagramSocket`, để join/leave group và chọn network interface phù hợp. Trên Java 21, overload nên ưu tiên là `joinGroup(SocketAddress, NetworkInterface)` vì nó xác định rõ interface local; overload cũ chỉ nhận `InetAddress` đã deprecated.

```java
NetworkInterface netIf = NetworkInterface.getByName("eth0");
InetSocketAddress group = new InetSocketAddress("239.10.10.10", 9000);

try (MulticastSocket socket = new MulticastSocket(9000)) {
    socket.joinGroup(group, netIf);
    try {
        byte[] buffer = new byte[2048];
        DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
        socket.receive(packet);
    } finally {
        socket.leaveGroup(group, netIf);
    }
}
```

Multicast còn liên quan tới interface gửi ra và phạm vi TTL/hop. Đây là cơ chế socket/networking thuộc module này; việc thiết kế discovery protocol, chiến lược membership hoặc topology multicast lớn hơn thuộc phạm vi hệ thống/protocol tương ứng.
