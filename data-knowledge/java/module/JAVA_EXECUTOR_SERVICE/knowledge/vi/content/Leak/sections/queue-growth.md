Thread count ổn định không có nghĩa hệ thống an toàn.

Nếu producer nhanh hơn consumer và queue không được giới hạn hợp lý:

```text
arrival rate > service rate
        ↓
backlog tăng
        ↓
queued task giữ object/context
        ↓
memory + latency tăng
```

Đây là lý do pool sizing phải xem cả queue, không chỉ worker count.

Tham khảo:

```text
LeakController#queuePressure()
GET /leak/queue-pressure
```

Demo dùng bounded queue nhỏ, cố tình làm đầy rồi quan sát rejection; không tạo unbounded backlog thật.
