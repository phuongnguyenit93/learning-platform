Đối với CPU, thread và lock, JFR giúp tránh phụ thuộc vào một thread dump đơn lẻ.

**CPU samples** cho biết stack nào xuất hiện thường xuyên trong quá trình lấy mẫu CPU. Đây là bằng chứng thống kê, không phải phép đo chính xác đến từng nanosecond.

**Các event về thread/lock** giúp thấy:

- thời lượng thread bị park/block;
- monitor contention;
- thread giữ lock và ngữ cảnh tùy event;
- virtual-thread pinning;
- tương quan giữa latency window và synchronization activity.

Quy trình:

~~~text
CPU/latency spike time
        ↓
lọc JFR đúng time range
        ↓
top execution stacks
        +
lock/park events
        ↓
đối chiếu với request/log
~~~

Nếu bằng chứng chỉ ra vấn đề về ngữ nghĩa lock, happens-before hoặc tính đúng đắn concurrency, chuyển sang module Concurrency; JFR chỉ cung cấp quan sát runtime.
