Ba thao tác `bind`, `connect` và `accept` mô tả ba vai trò khác nhau trong quá trình hình thành kết nối TCP.

- `bind` gắn socket với một endpoint local. `ServerSocket` thường phải bind trước khi nhận kết nối. Client cũng có thể bind `Socket` vào một địa chỉ/cổng local cụ thể khi có yêu cầu; nếu không, hệ điều hành thường chọn địa chỉ và ephemeral port phù hợp khi kết nối.
- `connect` thuộc phía chủ động: `Socket` client yêu cầu thiết lập kết nối tới endpoint của server.
- `accept` thuộc phía thụ động: `ServerSocket` chờ một kết nối đến và trả về một `Socket` mới khi kết nối được chấp nhận.

Ví dụ tạo server socket chưa bind rồi bind rõ ràng:

```java
try (ServerSocket server = new ServerSocket()) {
    server.bind(new InetSocketAddress("0.0.0.0", 8080));

    try (Socket client = server.accept()) {
        // client là kết nối riêng vừa được accept.
    }
}
```

`0.0.0.0` là wildcard address cho IPv4 trong ví dụ này: server nhận kết nối tới các địa chỉ local phù hợp trên máy. Nếu bind với port `0`, hệ thống chọn một ephemeral port; có thể đọc port thực tế bằng `getLocalPort()` sau khi bind.

`ServerSocket.bind(endpoint, backlog)` còn nhận `backlog`, tức độ dài tối đa **được yêu cầu** cho hàng đợi kết nối đến đang chờ xử lý. Giá trị thực tế và cách áp dụng backlog phụ thuộc cách triển khai/hệ điều hành, vì vậy không nên coi nó là một giới hạn ứng dụng chính xác tuyệt đối.

`accept()` là lời gọi blocking trong kiểu `ServerSocket` thông thường: nếu chưa có kết nối phù hợp, thread chờ tại đó. Timeout/cancellation và kiểm soát lỗi được xử lý sâu hơn ở chương riêng; ở đây điều cần giữ là `accept()` tạo ra một socket kết nối mới, không biến chính `ServerSocket` thành kết nối với client.
