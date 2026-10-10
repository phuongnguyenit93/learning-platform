Không phải mọi `BlockingQueue` chỉ khác implementation detail.

| Queue | Capacity / ordering | Điểm cần nhớ |
| --- | --- | --- |
| `ArrayBlockingQueue` | bounded, array-backed | capacity cố định; constructor có fairness option |
| `LinkedBlockingQueue` | bounded nếu truyền capacity; mặc định capacity rất lớn | phù hợp backlog FIFO nhưng vẫn cần chủ động giới hạn trong production |
| `SynchronousQueue` | không lưu phần tử | direct handoff giữa producer và consumer |
| `PriorityBlockingQueue` | priority-ordered, effectively unbounded | ưu tiên theo comparator/natural order, không phải FIFO thông thường |

`PriorityBlockingQueue` không cung cấp backpressure bằng capacity như `ArrayBlockingQueue`. Nếu producer nhanh hơn consumer, backlog vẫn có thể tăng.

Ngoài ra, nếu hai phần tử có cùng priority thì không nên dựa vào FIFO như một contract mặc định. Nếu business cần stable ordering, comparator/data model phải encode thêm tie-breaker rõ ràng, ví dụ sequence number.

`drainTo(...)` hữu ích khi cần lấy một batch phần tử khỏi `BlockingQueue` mà không lặp `poll()` từng item.

Tham khảo:

```text
CoordinationController#blockingQueueVariants()
GET /coordination/blocking-queue-variants
```

Experiment cho thấy:

```text
ArrayBlockingQueue đầy → offer() trả false
LinkedBlockingQueue → drainTo lấy batch hữu hạn
PriorityBlockingQueue → otp trước delivery trước promotion theo priority
```

**Kết luận:** chọn queue dựa trên capacity, ordering và handoff semantics; không chọn chỉ dựa trên benchmark tổng quát.
