Không phải mọi socket channel đều dùng IP + port. JDK hỗ trợ **Unix-domain sockets** qua `SocketChannel` và `ServerSocketChannel`, với endpoint là `UnixDomainSocketAddress` chứa một đường dẫn hệ thống tệp.

```java
Path socketPath = Path.of("/tmp/java-learning.sock");
Files.deleteIfExists(socketPath);

UnixDomainSocketAddress address = UnixDomainSocketAddress.of(socketPath);

try (ServerSocketChannel server =
         ServerSocketChannel.open(StandardProtocolFamily.UNIX)) {
    server.bind(address);
    try (SocketChannel connection = server.accept()) {
        // read/write ByteBuffer như stream-oriented SocketChannel khác
    }
} finally {
    Files.deleteIfExists(socketPath);
}
```

Client có thể mở channel thuộc `StandardProtocolFamily.UNIX` rồi `connect(address)`. Transport này dành cho IPC trên cùng máy; nó không phải một cách viết khác của `InetSocketAddress`.

Khả năng hỗ trợ phụ thuộc nền tảng/provider. Mã phải chấp nhận trường hợp protocol family không được hỗ trợ. Ngoài ra, khi bind Unix-domain server vào một đường dẫn có tên, socket file **vẫn tồn tại sau khi channel đóng** theo Java API; ứng dụng chịu trách nhiệm dọn đường dẫn trước khi bind lại khi phù hợp.

`UnixDomainSocketAddress` dùng `Path` từ hệ thống tệp mặc định của hệ thống, và nền tảng còn có giới hạn độ dài đường dẫn phụ thuộc cách triển khai. Những chi tiết này là lý do abstraction endpoint ở Java rộng hơn IP address + port.
