Virtual thread không bắt buộc phải đi qua `ExecutorService`. Java 2. có hai API trực tiếp đáng biết:

```java
Thread.startVirtualThread(task);

Thread.ofVirtual()
        .name("worker")
        .start(task);
```

Builder hữu ích khi cần cấu hình name/uncaught-exception handler trước khi start.

Tham khảo:

```text
VirtualThreadController#creationApi()
GET /virtual-thread/creation-api
```

Experiment tạo một Thread bằng mỗi API và xác nhận:

```text
startVirtualThreadIsVirtual = true
builderIsVirtual = true
bothTerminated = true
```

**Kết luận:** `newVirtualThreadPerTaskExecutor()` là abstraction thuận tiện cho task submission/lifecycle; bản thân virtual thread vẫn là một `Thread` và có thể được tạo trực tiếp.
