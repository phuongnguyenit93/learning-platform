### volatile

Phù hợp cho visibility/order của một state variable khi update không cần compound atomic invariant.

```text
stop flag
ready flag
published configuration reference
```

### Atomic

Phù hợp cho atomic state transition đơn giản:

```text
counter
CAS reference update
```

CAS chỉ kiểm tra expected value/reference hiện tại. Với reference có thể xảy ra ABA (`A → B → A`): plain CAS có thể thấy state cuối lại là A và không biết đã có thay đổi ở giữa. Khi version của state là một phần correctness, cân nhắc abstraction như `AtomicStampedReference` thay vì mặc định plain `AtomicReference` đủ cho mọi protocol.

### synchronized / Lock

Phù hợp khi cần bảo vệ critical section hoặc invariant nhiều bước.

Không dùng `volatile int count` rồi kỳ vọng `count++` atomic.
