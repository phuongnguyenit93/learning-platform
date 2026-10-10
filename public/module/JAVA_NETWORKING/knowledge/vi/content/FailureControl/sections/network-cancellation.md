Cancellation của network I/O phải trả lời được hai câu hỏi: **thao tác nào cần dừng, và tài nguyên có còn dùng được sau khi dừng không?**

Trên Java 21, cách triển khai mặc định của hệ thống cho Socket, ServerSocket và DatagramSocket có hành vi đặc biệt khi thao tác blocking chạy trong **virtual thread**: nếu virtual thread bị interrupt khi đang block trên socket I/O, thread được đánh thức và socket bị đóng.

~~~java
Thread worker = Thread.ofVirtual().start(() -> {
    try (Socket socket = new Socket("localhost", 8080)) {
        socket.getInputStream().read(); // may block
    } catch (IOException e) {
        // cancellation / close is observed here
    }
});

worker.interrupt();
~~~

Đây là lý do quan trọng khiến cancellation phải đi cùng suy luận về vòng đời tài nguyên. Không nên catch exception rồi tiếp tục giả định socket vẫn còn dùng được.

Với InterruptibleChannel, interrupt/async close cũng có ngữ nghĩa riêng của channel API. Chapter NIO sẽ đi sâu hơn vào mô hình đó.

Ở cấp module, quy tắc cần giữ là: cancellation không chỉ là “dừng thread”; nó phải dẫn hệ thống tới một **trạng thái tài nguyên xác định**.
