Cancellation không chỉ có nghĩa là thoát loop.

Task có thể đang giữ:

- file;
- socket;
- temporary resource;
- transaction/resource scope;
- trạng thái cần reset.

Vì vậy lifecycle an toàn thường có dạng:

```java
try {
    while (!Thread.currentThread().isInterrupted()) {
        // work
    }
} finally {
    // cleanup
}
```

Hoặc với blocking operation:

```java
try {
    doBlockingWork();
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
} finally {
    cleanup();
}
```

`finally` quan trọng vì cleanup không nên phụ thuộc vào worker kết thúc theo đường "happy path" hay cancellation path.

### Demo trong module

Tham khảo:

```text
InterruptionController#cancelWithCleanup()
```

Endpoint:

```text
GET /interruption/cleanup
```

Experiment mô phỏng một resource được mở trước khi worker bắt đầu làm việc.

Sau khi gửi `interrupt()`, hãy quan sát:

```text
interruptionObserved = true
cleanupCalled = true
resourceOpen = false
workerAlive = false
```

Worker có thể nhận interrupt trước lần kiểm tra điều kiện loop hoặc trong lúc `sleep()`.
Ở trường hợp đầu, nó thoát loop mà không đi qua `catch`; ở trường hợp sau, `sleep()` ném `InterruptedException`.
`interruptionObserved` ghi nhận tín hiệu cancellation ở cả hai đường, không dùng việc có exception hay không để kết luận Thread đã nhận interrupt.

**Kết luận:** cancellation đúng không chỉ dừng execution mà còn phải đưa resource về trạng thái hợp lệ.
