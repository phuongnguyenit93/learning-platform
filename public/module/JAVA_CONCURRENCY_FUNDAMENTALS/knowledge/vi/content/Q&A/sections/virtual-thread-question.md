Với task concurrency, virtual-thread-per-task giảm nhu cầu pool virtual threads để giới hạn số OS worker như platform-thread pool truyền thống.

Nhưng hệ thống vẫn cần giới hạn **resource downstream**:

- DB connections;
- API rate limit;
- memory;
- file descriptors;
- critical resource capacity.

Semaphore/rate limiter/pool của resource vẫn có vai trò.

Trong Java 21, virtual thread là daemon thread và dùng `Thread.NORM_PRIORITY`; không dùng thread priority để điều khiển scalability. `InheritableThreadLocal` vẫn có thể được inherit khi virtual thread được tạo, nhưng `Thread.ofVirtual().inheritInheritableThreadLocals(false)` cho phép tắt inheritance. Vì vậy explicit context propagation vẫn là mental model an toàn hơn cho request/security/logging context.
