SocketAddress là abstraction cho **địa chỉ mà socket/channel có thể bind hoặc connect**. Với Internet socket, cách triển khai thường dùng InetSocketAddress.

~~~java
InetSocketAddress remote =
        new InetSocketAddress("example.com", 443);
~~~

InetSocketAddress có hai trạng thái đáng chú ý:

- **resolved**: hostname đã gắn với một InetAddress;
- **unresolved**: giữ hostname + port nhưng chưa resolve.

Có thể tạo unresolved address bằng InetSocketAddress.createUnresolved(...). Điều này hữu ích khi một tầng khác, ví dụ proxy logic, cần giữ nguyên hostname.

Bind local và connect tới remote là hai vai trò khác nhau của cùng abstraction:

~~~java
server.bind(new InetSocketAddress("0.0.0.0", 8080));
client.connect(new InetSocketAddress("example.com", 443));
~~~

Bind wildcard address nghĩa là lắng nghe trên các interface local phù hợp; không có nghĩa remote peer là 0.0.0.0.

Giữ rõ sự khác nhau giữa local endpoint và remote endpoint sẽ giúp chương TCP và NIO dễ hiểu hơn: socket/channel có local endpoint và, sau connect/accept, có remote endpoint tương ứng.
