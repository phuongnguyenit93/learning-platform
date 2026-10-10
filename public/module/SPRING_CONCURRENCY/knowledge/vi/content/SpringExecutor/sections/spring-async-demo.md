Tham khảo controller:

```text
TaskExecutorController#asyncWithContext()
GET /spring-executor/async-context
```

Controller đặt:

```text
DemoContext = REQUEST-123
MDC[requestId] = REQUEST-123
RequestAttributes = request hiện tại do Spring Web quản lý
```

rồi gọi bean khác có:

```java
@Async("threadLearningTaskExecutor")
```

Response `CompletableFuture` cho biết:

- caller thread;
- worker thread;
- DemoContext worker quan sát được;
- MDC request id worker quan sát được;
- worker có nhận được Spring RequestAttributes hay không.

Kỳ vọng:

```text
callerThread != workerThread
workerContext = REQUEST-123
workerMdcRequestId = REQUEST-123
workerHasRequestAttributes = true
```

Controller cũng capture context/MDC trước khi đặt giá trị demo và restore chúng trong `finally`. Vì vậy experiment không làm mất context đã tồn tại sẵn trên caller thread.
