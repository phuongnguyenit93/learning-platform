# Spring TaskExecutor, ThreadPoolTaskExecutor và @Async

Spring không thay thế Java concurrency primitives. Nó cung cấp abstraction và lifecycle integration để sử dụng chúng thuận tiện hơn trong application.

```text
Java Executor concepts
        ↓
Spring TaskExecutor / ThreadPoolTaskExecutor
        ↓
@Async proxy dispatch
```
