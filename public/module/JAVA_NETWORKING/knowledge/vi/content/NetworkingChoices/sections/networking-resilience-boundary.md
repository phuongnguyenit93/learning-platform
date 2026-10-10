Networking phát hiện lỗi; **resilience policy quyết định phải làm gì sau lỗi**.

Không nên viết:

~~~text
catch IOException
→ retry forever
~~~

Retry an toàn phụ thuộc nhiều thông tin ngoài transport:

- thao tác có idempotent không?
- request đã tới server nhưng response bị mất hay chưa?
- timeout là connect timeout hay read timeout?
- có backoff/jitter không?
- có retry budget/circuit breaker không?
- lỗi là transient hay lỗi cấu hình/lỗi vĩnh viễn?

Ví dụ HTTP POST có thể đã tạo dữ liệu phía server trước khi client mất connection. Tự động retry chỉ vì thấy IOException có thể tạo duplicate side effect.

Networking có trách nhiệm:

- cung cấp phân loại lỗi đủ tốt;
- giữ timeout/cancellation/trạng thái tài nguyên rõ ràng;
- không che mất original cause.

Module Resilience/tầng integration mới quyết định retry, circuit breaker, fallback, deadline propagation hay chiến lược idempotency.

Boundary này giúp code tránh “transport layer tự đoán business safety”.
