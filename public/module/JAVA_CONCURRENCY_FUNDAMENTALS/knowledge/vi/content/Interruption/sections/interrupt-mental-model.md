Java không thiết kế `interrupt()` như một lệnh cưỡng bức kết thúc Thread.

Khi gọi:

```java
worker.interrupt();
```

caller đang gửi một **interruption request** tới `worker`.

Điều gì xảy ra tiếp theo phụ thuộc vào trạng thái và code của worker.

Nếu worker đang chạy code bình thường:

```text
interrupt()
    ↓
interrupt status = true
    ↓
worker phải tự kiểm tra tín hiệu
    ↓
worker quyết định cleanup và kết thúc
```

Nếu worker đang ở một operation có hỗ trợ interruption như `sleep()`, `wait()` hoặc `join()`, operation đó có thể kết thúc sớm bằng `InterruptedException`.

Vì vậy khái niệm đúng là:

```text
Cooperative Cancellation

caller
  → yêu cầu dừng

worker
  → quan sát yêu cầu
  → cleanup
  → kết thúc an toàn
```

### Vì sao không dùng Thread.stop()?

`Thread.stop()` là API deprecated vì có thể dừng Thread tại một thời điểm không an toàn và làm invariant của shared state bị phá vỡ.

Code hiện đại nên thiết kế task có khả năng phản ứng với cancellation thay vì cưỡng bức kill Thread.

### Demo trong module

Tham khảo:

```text
InterruptionController#interruptBusyWorker()
```

Endpoint:

```text
GET /interruption/busy-loop
```

Experiment tạo một worker chạy CPU loop:

```java
while (!Thread.currentThread().isInterrupted()) {
    // work
}
```

Controller gọi service, service start worker rồi gửi `interrupt()`.

Khi chạy, cần quan sát:

```text
worker bắt đầu
→ interrupt được gửi
→ worker quan sát interrupt flag
→ loop kết thúc
→ Thread TERMINATED
```

**Kết luận:** với code không block ở API interruptible, `interrupt()` chỉ đặt tín hiệu; worker phải chủ động kiểm tra tín hiệu đó.
