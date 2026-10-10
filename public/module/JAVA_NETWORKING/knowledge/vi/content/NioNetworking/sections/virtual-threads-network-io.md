Trước virtual threads, một lý do phổ biến để chọn Selector là tránh giữ một platform thread đắt cho mỗi kết nối đang block. Java 21 thay đổi trade-off đó.

Theo JEP 444, khi mã trong virtual thread block trên phần lớn I/O mạng của `java.net` và `java.nio.channels`, runtime có thể tạm dừng virtual thread và giải phóng carrier platform thread để chạy việc khác. Vì vậy **nhiều kết nối đồng thời không tự động đồng nghĩa phải chuyển sang non-blocking Selector**.

Trên Java 21, lợi ích này giả định virtual thread có thể unmount khỏi carrier. Nếu mã xung quanh làm virtual thread bị pinned, ví dụ block trong một số vùng `synchronized` hoặc native call, carrier có thể vẫn bị giữ trong thời gian block. Cơ chế pinning chi tiết thuộc module Virtual Threads/Concurrency; Networking chỉ cần giữ giới hạn này khi so sánh các mô hình I/O.

Ví dụ mô hình thread-per-connection vẫn có thể giữ luồng xử lý tuần tự, dễ đọc:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor();
     ServerSocket server = new ServerSocket(8080)) {

    while (!server.isClosed()) {
        Socket socket = server.accept();
        executor.submit(() -> {
            try (socket) {
                handle(socket);
            }
            return null;
        });
    }
}
```

JDK 21 còn quy định các thao tác blocking của `Socket`, `ServerSocket` và `DatagramSocket` mặc định hệ thống là interruptible khi chạy trong virtual thread: interrupt sẽ đánh thức virtual thread và đóng socket. Các channel vốn là `InterruptibleChannel` đã có semantics cancellation/interrupt riêng.

Virtual threads không làm I/O nhanh hơn và không xóa các giới hạn khác như bandwidth, độ trễ từ xa, connection pool hoặc năng lực xử lý phía sau. Selector vẫn phù hợp khi cần event-loop state machine và kiểm soát readiness rõ ràng; asynchronous channels vẫn hữu ích khi API/composition cần kiểu completion.
