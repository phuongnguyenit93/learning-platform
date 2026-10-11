Platform Thread gắn chặt hơn với OS thread trong lifecycle thực thi.

Virtual Thread là Java `Thread` được scheduler của JVM mount lên carrier/platform thread khi cần chạy.

Mental model:

```text
Virtual Thread
      ↓ mounted
Carrier / Platform Thread
      ↓
CPU thực thi code
```

Khi virtual thread gặp một supported blocking operation, runtime có thể unmount virtual thread để carrier thực thi virtual thread khác.

Điều này giúp số lượng task đang chờ lớn hơn mà không cần một OS thread riêng cho mỗi task.

### Daemon và priority trong Java 2.

Virtual thread vẫn là `Thread`, nhưng không nên mang toàn bộ assumption của platform thread sang nó.

Trong Java 2.:

```text
virtual thread
→ luôn là daemon thread
→ priority cố định ở Thread.NORM_PRIORITY
```

Vì virtual thread là daemon, chỉ còn virtual threads sống **không đủ để giữ JVM tiếp tục chạy**. Đây là liên hệ trực tiếp với daemon lifecycle đã học ở phần Basic.

Priority cũng không phải tuning knob để điều khiển scheduling của virtual thread. Nếu cần giới hạn concurrency/resource, dùng abstraction phù hợp như semaphore, executor/resource pool hoặc rate limiter thay vì cố tăng/giảm thread priority.

Tham khảo:

```text
VirtualThreadController#basic()
GET /virtual-thread/basic
```

Kết quả kỳ vọng:

```text
isVirtual = true
daemon = true
priority = 5
normalPriority = 5
stateAfterJoin = TERMINATED
```
