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
Executor/Thread Pool
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

If a concurrency issue arises, first determine which group it belongs to instead of selecting the tool by API name.
