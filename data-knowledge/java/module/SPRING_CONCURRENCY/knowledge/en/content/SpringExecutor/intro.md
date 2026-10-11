# Spring TaskExecutor, ThreadPoolTaskExecutor, and @Async

Spring does not replace Java concurrency primitives. It provides abstraction and lifecycle integration to make their use more convenient in the application.

```text
Java Executor concepts
        ↓
Spring TaskExecutor / ThreadPoolTaskExecutor
        ↓
@Async proxy dispatch
```
