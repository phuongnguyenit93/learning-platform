# Concurrency Problems & Java Memory Model

Phần này trả lời câu hỏi quan trọng nhất trước khi học synchronization:

> Vì sao một đoạn code đúng khi chạy một Thread lại có thể sai khi nhiều Thread cùng chạy?

Mental model xuyên suốt:

```text
Shared Mutable State
        ↓
Concurrent Access
        ↓
Atomicity / Visibility / Ordering problems
        ↓
Java Memory Model + Happens-Before
        ↓
Synchronization tools ở chapter tiếp theo
```

Sau phần này cần phân biệt được:

- race condition và data race;
- atomicity và visibility;
- visibility và ordering;
- happens-before là guarantee của Java Memory Model, không phải mô tả cache CPU;
- `volatile` giải quyết visibility/order nhưng không biến compound operation thành atomic;
- deadlock, livelock và starvation đều là liveness problem nhưng khác nhau về biểu hiện.
