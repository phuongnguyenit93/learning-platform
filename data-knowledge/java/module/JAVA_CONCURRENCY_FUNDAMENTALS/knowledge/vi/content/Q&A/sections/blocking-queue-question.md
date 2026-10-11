`ConcurrentLinkedQueue` là concurrent non-blocking queue API; `poll()` khi rỗng trả `null`.

`BlockingQueue` có condition-waiting semantics như `put/take` và timed operations.

Nếu Producer–Consumer cần backpressure/waiting rõ ràng, `BlockingQueue` thường phù hợp hơn việc tự busy-poll `ConcurrentLinkedQueue`.
