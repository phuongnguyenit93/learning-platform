Producer–Consumer tách tốc độ tạo dữ liệu khỏi tốc độ xử lý dữ liệu bằng một buffer trung gian.

```text
Producer
   ↓ put
BlockingQueue
   ↓ take
Consumer
```

Với bounded queue, producer có thể bị backpressure khi buffer đầy.

Các nhóm method thường gặp:

| Hành vi | Insert | Remove |
| --- | --- | --- |
| Exception | `add` | `remove` |
| Special value | `offer` | `poll` |
| Block | `put` | `take` |
| Timed wait | `offer(timeout)` | `poll(timeout)` |

Tham khảo:

```text
CoordinationController#blockingQueue()
GET /coordination/blocking-queue
```

Demo sản xuất và tiêu thụ số item hữu hạn rồi join cả hai Thread. Không để consumer `while(true)` tồn tại sau request.

Các operation `put()`, `take()`, `offer(timeout)` và `poll(timeout)` có thể phản ứng với interruption. Vì vậy producer/consumer loop vẫn phải preserve cancellation semantics thay vì swallow `InterruptedException`.
