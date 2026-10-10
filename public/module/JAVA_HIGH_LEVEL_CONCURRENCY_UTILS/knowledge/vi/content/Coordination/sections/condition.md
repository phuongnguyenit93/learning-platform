`Condition` cung cấp condition queue gắn với explicit `Lock`.

```java
lock.lock();
try {
    while (!ready) {
        condition.await();
    }
} finally {
    lock.unlock();
}
```

Một `ReentrantLock` có thể tạo nhiều `Condition`, hữu ích khi nhiều nhóm waiter chờ các predicate khác nhau.

Giống `wait/notify` yêu cầu ownership của monitor, các operation như `await()`, `signal()` và `signalAll()` phải được dùng khi Thread đang giữ **associated Lock**. Nếu không, implementation có thể ném `IllegalMonitorStateException`.

`Condition.await()` có mental model tương tự condition wait của monitor:

```text
caller đang giữ associated Lock
→ await()
→ release Lock trong lúc chờ
→ được signal / interrupt / timeout
→ phải reacquire Lock trước khi await() return/throw theo contract
```

Vì vậy code sau `await()` vẫn chạy trong critical section cho tới khi `finally` gọi `unlock()`.

Tham khảo:

```text
CoordinationController#condition()
GET /coordination/condition
```

Experiment tạo hai wait-set độc lập trên cùng một lock:

```text
dataAvailable      → đánh thức data waiter
shutdownRequested  → đánh thức shutdown waiter
```

Sau `dataAvailable.signal()`, shutdown waiter vẫn tiếp tục chờ cho tới khi chính `shutdownRequested.signal()` được gọi.

**Kết luận:** `Condition` là phiên bản explicit-lock của condition waiting; vẫn cần predicate loop.
