Kết nối mạng giữ tài nguyên hệ điều hành, vì vậy mã cần xác định rõ **ai sở hữu socket và ai chịu trách nhiệm đóng nó**. Quy tắc đơn giản nhất là thành phần nhận trách nhiệm sở hữu kết nối sẽ đóng kết nối trong `try-with-resources` khi phiên làm việc kết thúc.

```java
void handleClient(ServerSocket server) throws IOException {
    try (Socket socket = server.accept()) {
        process(socket);
    } // socket của client được đóng ở đây
}
```

`ServerSocket` và các `Socket` đã được `accept()` là các tài nguyên độc lập:

- đóng một `Socket` đã được `accept()` sẽ kết thúc kết nối đó nhưng server vẫn có thể `accept()` kết nối khác;
- đóng `ServerSocket` dừng listener và đánh thức thread đang block trong `accept()` bằng lỗi đóng socket;
- đóng `ServerSocket` không phải là cơ chế tự động quản lý mọi kết nối đã được `accept()` và chuyển cho phần xử lý khác.

`Socket` cũng sở hữu hai stream gắn với cùng kết nối. Theo Java API, đóng `InputStream` hoặc `OutputStream` lấy từ socket sẽ đóng socket liên kết. Vì vậy tránh thiết kế trách nhiệm sở hữu trong đó nhiều lớp độc lập cùng "sở hữu" từng stream mà không biết rằng một lớp đóng stream sẽ ảnh hưởng cả kết nối.

`try-with-resources` giúp dọn tài nguyên khi xử lý thành công lẫn khi có exception:

```java
try (Socket socket = new Socket("example.com", 8080)) {
    InputStream in = socket.getInputStream();
    OutputStream out = socket.getOutputStream();
    exchange(in, out);
}
```

Ở đây `Socket` là tài nguyên có chủ sở hữu rõ ràng; việc đóng socket cũng kết thúc các stream gắn với kết nối đó. Cách này tránh tạo cảm giác rằng ba tài nguyên độc lập có ba vòng đời mạng khác nhau.

Khi cần half-close, quản lý vòng đời ở cấp `Socket` và dùng `shutdownOutput()`/`shutdownInput()` đúng mục đích thay vì đóng stream sớm. Timeout, reset, cancellation và các dạng lỗi khác được tách sang chương Failure Control; nguyên tắc xuyên suốt ở đây là mọi đường thoát đều phải đưa tài nguyên về trạng thái đóng xác định.

Trước khi đi vào các failure control dùng chung đó, chương kế tiếp sẽ đối chiếu byte stream có kết nối của TCP với mô hình datagram độc lập của UDP để tách rõ transport/data semantics khỏi lifecycle policy.
