Một custom stop flag vẫn là một kỹ thuật cooperative cancellation hợp lệ trong một số loop:

```java
while (!stopRequested) {
    doWork();
}
```

Nếu `stopRequested` được chia sẻ giữa nhiều Thread, visibility phải được bảo đảm, ví dụ bằng `volatile` hoặc một primitive tương đương.

Điểm khác biệt quan trọng là **stop flag chỉ là application state**. Nó không tích hợp với interruption protocol của Java và không tự đánh thức một Thread đang ở operation interruptible như `sleep()`, `wait()` hoặc `join()`.

Ví dụ:

```java
volatile boolean stopRequested;

while (!stopRequested) {
    Thread.sleep(30_000);
}
```

Nếu Thread đang ở giữa `sleep(30_000)` và Thread khác chỉ làm:

```java
stopRequested = true;
```

worker chưa có cơ hội đọc lại flag cho tới khi `sleep()` kết thúc tự nhiên.

Trong khi:

```java
worker.interrupt();
```

có thể làm `sleep()` kết thúc sớm bằng `InterruptedException`.

So sánh mental model:

| Cơ chế | Visibility signal | Đánh thức `sleep/wait/join` | Có interrupt status | Tích hợp với nhiều API concurrency |
| --- | --- | --- | --- | --- |
| `volatile boolean stop` | Có | Không | Không | Không |
| `interrupt()` | Có interruption signal | Có với API hỗ trợ interruption | Có | Có |

Điều này không có nghĩa lúc nào cũng phải dùng `interrupt()` thay cho mọi flag. Một state flag có thể biểu diễn business lifecycle rõ hơn, ví dụ `RUNNING`, `PAUSED`, `STOPPING`. Nhưng nếu task có thể block và cần cancellation responsive, interruption thường là protocol phù hợp hơn.

### Demo trong module

Tham khảo:

```text
InterruptionController#stopFlagVsInterrupt()
GET /interruption/stop-flag-vs-interrupt
```

Experiment cho worker đi vào `sleep(30s)`, sau đó:

```text
set volatile stop flag = true
→ worker vẫn còn alive
→ interrupt worker
→ sleep ném InterruptedException
→ worker kết thúc
```

Response quan trọng:

```text
stopFlagVisible = true
aliveAfterOnlyStopFlag = true
stateAfterOnlyStopFlag = TIMED_WAITING
interruptWokeBlockingOperation = true
workerAliveAfterCleanup = false
```

**Kết luận:** stop flag giúp worker biết *nên dừng*, còn `interrupt()` ngoài việc mang cancellation signal còn có khả năng làm nhiều blocking API kết thúc sớm để worker có cơ hội phản ứng ngay.
