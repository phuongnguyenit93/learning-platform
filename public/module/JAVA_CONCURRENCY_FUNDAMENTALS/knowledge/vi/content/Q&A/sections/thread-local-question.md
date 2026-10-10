ThreadLocal giúp tránh sharing một context value giữa Thread.

Nó không làm object shared khác tự thread-safe và không phải replacement cho lock/Atomic trên shared state.

Đặc biệt với pool, luôn nghĩ tới worker reuse và cleanup.

Bean scope cũng không phải Thread scope. `@RequestScope` không có nghĩa "mỗi worker Thread một bean", còn session-scoped mutable state vẫn có thể bị nhiều request cùng session truy cập concurrent.
