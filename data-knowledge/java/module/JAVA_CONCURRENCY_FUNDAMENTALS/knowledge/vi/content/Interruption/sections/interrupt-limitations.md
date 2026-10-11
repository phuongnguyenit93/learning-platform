Không nên hiểu:

```text
interrupt()
→ mọi blocking operation lập tức bị phá vỡ
```

Ví dụ quan trọng là thread đang chờ intrinsic monitor của `synchronized`.

```java
synchronized (monitor) {
    // Thread khác đang giữ monitor
}
```

Nếu worker đang ở `Thread.State.BLOCKED` vì chờ monitor này, gọi `interrupt()`:

- đặt interrupt status;
- **không** làm worker thoát khỏi việc chờ monitor;
- worker vẫn phải đợi monitor được release.

Sau khi lấy được monitor, code có thể kiểm tra interrupt status và xử lý cancellation.

Nếu cần lock acquisition có khả năng phản ứng với interruption, chapter Synchronization sẽ giới thiệu `ReentrantLock.lockInterruptibly()`.

Blocking I/O cũng không nên được gom thành một rule chung. Khả năng interruption phụ thuộc vào API cụ thể; một số NIO channel có semantics interruption riêng trong khi nhiều blocking API khác cần cơ chế đóng resource hoặc cancellation khác.

### Demo trong module

Tham khảo:

```text
InterruptionController#interruptSynchronizedWaiter()
```

Endpoint:

```text
GET /interruption/synchronized-blocked
```

Service giữ một monitor, start worker để worker rơi vào `BLOCKED`, sau đó gọi `interrupt()` khi worker vẫn chưa lấy được monitor.

Điểm cần quan sát:

```text
state before interrupt = BLOCKED
state immediately after interrupt = BLOCKED
interrupt flag = true
```

Sau khi service release monitor:

```text
worker lấy được monitor
→ vẫn quan sát interrupt flag = true
→ worker kết thúc
```

**Kết luận:** interrupt signal có thể tồn tại trong khi Thread vẫn tiếp tục bị `BLOCKED`; khả năng "đánh thức" phụ thuộc vào operation mà Thread đang chờ.
