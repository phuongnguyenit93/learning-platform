Concurrency model và network API liên quan chặt chẽ nhưng không phải cùng một quyết định.

Phong cách blocking truyền thống có luồng code dễ đọc:

~~~text
accept/connect
→ read
→ process
→ write
~~~

Trước virtual threads, thread-per-connection với rất nhiều blocking platform thread có thể tạo chi phí tài nguyên đáng kể. Selector-based non-blocking I/O giải quyết bằng cách multiplex nhiều channel trên ít thread hơn, đổi lại ứng dụng phải quản lý readiness và trạng thái theo từng kết nối rõ ràng.

Java 21 thay đổi trade-off: virtual thread có thể block trên network I/O mà không giữ carrier thread trong lúc chờ ở các thao tác được hỗ trợ. Vì vậy:

~~~text
many concurrent connections
≠ automatically require Selector
~~~

Chọn **blocking + virtual threads** khi:

- luồng xử lý tự nhiên là tuần tự;
- thread-per-task giúp code rõ hơn;
- không cần readiness-level control đặc biệt.

Chọn **Selector/event-driven** khi:

- architecture đã dựa trên event loop;
- cần explicit readiness multiplexing/control;
- muốn quản lý rất nhiều channel với state machine riêng.

Chọn **asynchronous channels** khi completion-style API thật sự phù hợp integration/concurrency model.

Đừng benchmark abstraction bằng microbenchmark không có hành vi mạng thật. Throughput, latency, memory, scheduling và độ phức tạp đều phải được đánh giá trong workload thực tế.
