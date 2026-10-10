Một số operation hỗ trợ interruption trực tiếp, ví dụ:

- `Thread.sleep(...)`;
- `Object.wait(...)`;
- `Thread.join(...)`;
- nhiều API blocking trong `java.util.concurrent`.

Ví dụ:

```java
try {
    Thread.sleep(30_000);
} catch (InterruptedException e) {
    // Thread đã nhận interruption request
}
```

Khi `InterruptedException` được ném bởi các API kiểu này, interrupt status thường đã được **clear**.

Do đó trong `catch`:

```java
Thread.currentThread().isInterrupted()
```

thường trả về `false`.

Nếu method không thể `throw InterruptedException` tiếp nhưng cần bảo toàn tín hiệu cancellation cho code phía trên, pattern phổ biến là:

```java
catch (InterruptedException e) {
    Thread.currentThread().interrupt();
    return;
}
```

Đây gọi là **restore interrupt status**.

Không phải mọi `catch (InterruptedException)` đều bắt buộc restore. Nếu method propagate exception ra ngoài thì caller đã nhận được cancellation signal qua exception. Restore đặc biệt hữu ích khi exception bị bắt lại và không thể/reasonably không nên throw tiếp.

### Demo trong module

Tham khảo:

```text
InterruptionController#interruptSleepingWorker()
```

Endpoint:

```text
GET /interruption/sleep
```

Worker bắt đầu `sleep()` dài, sau đó service gọi `interrupt()`.

Response cần thể hiện:

```text
InterruptedException xảy ra
flag trong catch trước restore = false
flag sau Thread.currentThread().interrupt() = true
worker kết thúc
```

**Kết luận:** interruption của blocking operation thường đi qua `InterruptedException`; exception này và interrupt flag là hai cách biểu diễn cùng cancellation signal ở các thời điểm khác nhau.
