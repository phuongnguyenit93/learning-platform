Executor do code tạo ra phải có owner chịu trách nhiệm shutdown.

Pattern Java Core:

```java
executor.shutdown();

if (!executor.awaitTermination(timeout, unit)) {
    executor.shutdownNow();
}
```

`shutdown()`:

- không nhận task mới;
- cho queued/running task tiếp tục.

`shutdownNow()`:

- cố interrupt running task;
- trả về task chưa bắt đầu;
- không thể cưỡng bức code không hợp tác với interruption phải dừng ngay.

Tham khảo:

```text
ThreadPoolController#gracefulShutdown()
GET /thread-pool/graceful-shutdown
```

Demo tạo executor cục bộ, hoàn thành task, gọi shutdown và xác nhận pool terminated trước khi request kết thúc.

### Experiment forced shutdown

Tham khảo:

```text
ThreadPoolController#forcedShutdown()
GET /thread-pool/forced-shutdown
```

Một worker giữ task đang chạy ở latch; task thứ hai nằm trong queue. Sau `shutdown()`, worker chưa được release nên `awaitTermination(50 ms)` trả `false` một cách có kiểm soát.
Sau đó `shutdownNow()` interrupt running task và trả lại task chưa bắt đầu:

```text
terminatedBeforeForce = false
interruptedWorkers = 1
queuedTaskReturned = true
neverStartedCount = 1
queuedTaskRuns = 0
terminatedAfterForce = true
```

Task đang chạy dừng được vì `await()` hỗ trợ interruption và worker kết thúc sau catch. Điều này không chứng minh `shutdownNow()` có thể kill một task không hợp tác. Service dùng executor cục bộ và cleanup cả khi caller bị interrupt.
