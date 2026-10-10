```text
Thread lifecycle
    ↓
Interruption / Cancellation
    ↓
Shared mutable state
    ↓
Atomicity / Visibility / Ordering / JMM
    ↓
Synchronization
    ↓
Coordination
    ↓
Executor / Thread Pool
    ↓
Future / CompletableFuture
    ↓
ThreadLocal / Context propagation
    ↓
Spring TaskExecutor / @Async
    ↓
Lifecycle / Leak
    ↓
Virtual Thread
```

Nếu một vấn đề concurrency xuất hiện, trước tiên hãy xác định nó thuộc nhóm nào thay vì chọn tool theo tên API.
