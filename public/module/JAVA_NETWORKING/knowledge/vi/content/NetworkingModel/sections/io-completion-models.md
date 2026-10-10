Ba thuật ngữ thường bị trộn lẫn là **blocking**, **non-blocking** và **asynchronous completion**.

**Blocking I/O** nghĩa là lời gọi có thể giữ luồng thực thi ở đó cho tới khi thao tác có thể tiến triển hoặc kết thúc. Ví dụ đọc từ Socket InputStream có thể chờ dữ liệu.

**Non-blocking I/O** nghĩa là lời gọi trở về khi hiện tại chưa thể làm việc. Với SocketChannel ở non-blocking mode, chương trình thường kết hợp Selector để biết channel nào đã ready.

**Asynchronous I/O** nghĩa là chương trình khởi động thao tác rồi nhận kết quả sau qua Future hoặc CompletionHandler, ví dụ AsynchronousSocketChannel.

~~~text
blocking       → chờ ngay trong lời gọi
non-blocking   → lời gọi return; quan sát readiness
asynchronous   → thao tác hoàn tất sau
~~~

Đây là mô hình I/O, không phải toàn bộ kiến trúc đồng thời. Java 21 còn thay đổi lựa chọn này: blocking network I/O chạy trong virtual thread có thể tạm dừng virtual thread thay vì giữ carrier thread. Vì thế “blocking” không đồng nghĩa “không thể mở rộng”.

Networking chỉ dùng các khái niệm concurrency để hiểu hành vi I/O; scheduling, synchronization và Java Memory Model vẫn thuộc module Concurrency.
