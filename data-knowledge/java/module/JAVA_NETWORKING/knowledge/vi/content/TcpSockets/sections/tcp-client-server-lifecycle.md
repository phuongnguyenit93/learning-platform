Vòng đời cơ bản của client và server có thể đọc theo hai luồng song song:

```text
Server                                  Client
------                                  ------
tạo ServerSocket                        tạo Socket
bind endpoint local                     connect endpoint remote
accept() chờ kết nối đến                kết nối TCP được thiết lập
                                        với endpoint của server
   |
Socket đã được accept
   |                                    |
đọc/ghi byte <------------------------> đọc/ghi byte
   |                                    |
đóng Socket đã accept                  đóng Socket

ServerSocket có thể tiếp tục accept kết nối khác cho tới khi chính nó bị close.
```

Một server tuần tự tối giản có thể minh họa trách nhiệm sở hữu của từng socket:

```java
try (ServerSocket server = new ServerSocket(8080)) {
    while (!server.isClosed()) {
        try (Socket connection = server.accept()) {
            handle(connection);
        }
    }
}
```

Trong server thực tế, việc xử lý nhiều kết nối đồng thời cần một mô hình concurrency phù hợp. Chương Networking này chỉ xác định ranh giới: mỗi kết nối có `Socket` và vòng đời riêng; thiết kế thread/executor/virtual thread thuộc module concurrency tương ứng.

Phía client thường gói toàn bộ phiên giao tiếp trong một `try-with-resources`:

```java
try (Socket socket = new Socket()) {
    socket.connect(new InetSocketAddress("example.com", 8080));

    // sử dụng socket.getInputStream() và socket.getOutputStream()
}
```

Sau khi `close()`, socket không thể tái sử dụng cho một kết nối mới. Nếu cần kết nối khác, tạo socket khác. Tương tự, một `Socket` được `accept()` kết thúc không làm `ServerSocket` tự đóng; listener và kết nối là hai tài nguyên khác nhau.
