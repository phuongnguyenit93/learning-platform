Không phải mọi socket endpoint đều đi qua IP network. Java hỗ trợ **Unix-domain sockets**, nơi endpoint được định danh bằng pathname trên hệ điều hành có hỗ trợ.

~~~java
UnixDomainSocketAddress address =
        UnixDomainSocketAddress.of("/tmp/my-service.sock");
~~~

UnixDomainSocketAddress vẫn là một SocketAddress, vì vậy mô hình tư duy bind/connect giữ nguyên dù protocol family không còn là Internet socket.

Unix-domain socket thường hữu ích cho giao tiếp giữa các tiến trình trên cùng máy:

- không cần cấp TCP port;
- endpoint nằm trong filesystem-like namespace;
- phù hợp cho daemon hoặc local service.

Trong JDK, hỗ trợ chủ yếu nằm ở SocketChannel và ServerSocketChannel khi mở với protocol family tương ứng. Khả năng hỗ trợ phụ thuộc platform/OS, vì vậy mã portable phải chấp nhận trường hợp không được hỗ trợ.

Repo có module Java Version cho lịch sử Unix-domain socket channels ở Java 16. Networking sở hữu cách dùng và mô hình tư duy hiện tại; Java Version sở hữu góc nhìn lịch sử release.

Sau khi đã phân biệt tên, địa chỉ và endpoint, chương tiếp theo chuyển sang TCP để theo dõi đầy đủ vòng đời của một kết nối stream-oriented từ bind/connect/accept đến read/write và close.
