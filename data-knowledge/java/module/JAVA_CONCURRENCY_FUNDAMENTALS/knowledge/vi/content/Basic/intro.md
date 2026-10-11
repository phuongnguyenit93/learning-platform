# Thread cơ bản trong Java

Phần này xây dựng mental model nền tảng trước khi đi vào interruption, Java Memory Model, synchronization, coordination hay thread pool.

Mục tiêu sau khi học xong:

- Phân biệt được Process, Thread và Task.
- Hiểu `start()` khác `run()` ở điểm nào.
- Biết hai cách trực tiếp để tạo Platform Thread bằng `Thread` và `Runnable`.
- Hiểu `Callable` không tự tạo Thread; nó chỉ mô tả một task có kết quả.
- Đọc được các trạng thái trong `Thread.State`.
- Hiểu chính xác Daemon Thread ảnh hưởng tới thời điểm JVM kết thúc như thế nào.
