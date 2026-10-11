Có thể tạo rất nhiều virtual threads, nhưng database connection pool, API downstream, file descriptor và rate limit vẫn hữu hạn.

Do đó thường vẫn cần concurrency limiter như `Semaphore`.

Tham khảo:

```text
VirtualThreadController#limitedResource()
GET /virtual-thread/limited-resource
```

Demo tạo nhiều virtual task nhưng chỉ cho tối đa 5 task vào critical external-resource section cùng lúc.

Implementation đặc biệt giữ rule:

```text
chỉ release permit nếu acquire thực sự thành công
```

tránh bug làm tăng permit khi Thread bị interrupt trước lúc acquire.
