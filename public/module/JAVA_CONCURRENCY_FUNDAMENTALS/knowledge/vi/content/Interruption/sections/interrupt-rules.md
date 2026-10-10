### Không swallow InterruptedException

Code như sau làm mất cancellation signal:

```java
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    // bỏ qua
}
```

Thay vào đó, thường chọn một trong hai hướng:

```text
1. propagate InterruptedException

hoặc

2. restore interrupt status rồi kết thúc/return
```

### Task CPU-bound phải có cancellation point

Nếu task chạy loop dài mà không gọi API interruptible, cần chủ động kiểm tra:

```java
Thread.currentThread().isInterrupted()
```

Không nhất thiết kiểm tra sau từng instruction; cancellation point nên được đặt ở vị trí hợp lý để cân bằng responsiveness và chi phí kiểm tra.

### Cleanup phải deterministic

Normal learning demo không được để lại Thread sống sau khi endpoint hoàn tất.

Service trong chapter này luôn `join()` worker với timeout và có cleanup fallback nếu cần.

### Không trộn Thread Pool shutdown vào mental model cơ bản

`ExecutorService.shutdown()`, `shutdownNow()`, `awaitTermination()` và Spring executor lifecycle có liên quan tới interruption nhưng thuộc abstraction cao hơn.

Chúng sẽ được học ở phần Thread Pool / Executor và Lifecycle thay vì dùng để giải thích interrupt cơ bản ở đây.
