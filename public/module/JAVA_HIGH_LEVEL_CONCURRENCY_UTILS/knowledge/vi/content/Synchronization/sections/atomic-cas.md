Atomic classes phù hợp cho nhiều state transition nhỏ như counter/reference update.

Ví dụ:

```java
AtomicInteger count = new AtomicInteger();
count.incrementAndGet();
```

Mental model CAS:

```text
đọc expected value
        ↓
tính new value
        ↓
compare-and-set
   ├─ thành công → hoàn tất
   └─ thất bại  → đọc lại và retry
```

Atomic không đồng nghĩa mọi compound business rule trở nên thread-safe. Nếu invariant trải qua nhiều object/field, có thể vẫn cần locking hoặc thiết kế khác.

### Demo compareAndSet

Tham khảo:

```text
SynchronizationController#atomicCas()
GET /synchronization/atomic-cas
```

Experiment bắt đầu với:

```text
AtomicInteger = 10
```

rồi thử hai CAS:

```text
compareAndSet(10, 20)
→ true
→ value = 20

compareAndSet(10, 30)
→ false vì expected=10 đã stale
→ value vẫn = 20
```

Điểm quan trọng là CAS không có nghĩa "set nếu thích". Update chỉ thành công nếu state hiện tại vẫn đúng expected value/reference mà caller dựa vào để tính transition.

### AtomicReference và ABA

CAS trên reference thường so sánh giá trị hiện tại với expected reference.

Một vấn đề nâng cao là ABA:

```text
A → B → A
```

CAS chỉ nhìn thấy giá trị cuối lại là A và có thể không biết state đã thay đổi ở giữa. Các abstraction như `AtomicStampedReference` có thể kèm version/stamp khi cần phát hiện trường hợp này.

Experiment `/atomic-cas` tạo đúng sequence:

```text
AtomicReference
A → B → A
stale observer vẫn giữ expected reference A
compareAndSet(A, C)
→ thành công trong experiment này
```

vì plain CAS chỉ thấy reference hiện tại lại chính là `A`; nó không mang theo history rằng state đã đi qua `B`.

Sau đó cùng sequence được chạy với `AtomicStampedReference`:

```text
A, stamp=0
→ B, stamp=1
→ A, stamp=2

CAS bằng expected A + stale stamp=0
→ false
```

**Kết luận:** stamp/version giúp phát hiện "giá trị nhìn giống cũ nhưng history đã thay đổi". Không phải mọi use case CAS đều có ABA problem; chỉ thêm versioning khi invariant thực sự cần biết intermediate transition.

### Atomic classes đáng biết

Không cần học thuộc toàn bộ package, nhưng nên nhận ra các nhóm:

| Nhóm | Ví dụ | Mục tiêu |
| --- | --- | --- |
| Primitive-like | `AtomicInteger`, `AtomicLong`, `AtomicBoolean` | state transition đơn giản |
| Reference | `AtomicReference`, `AtomicStampedReference`, `AtomicMarkableReference` | atomic reference / versioned reference |
| Array | `AtomicIntegerArray`, `AtomicLongArray`, `AtomicReferenceArray` | atomic access theo element |
| High-contention counter | `LongAdder`, `DoubleAdder` | update nhiều, aggregate sau |
| Accumulator | `LongAccumulator`, `DoubleAccumulator` | reduction function như max/min/sum |
| Field updater | `AtomicIntegerFieldUpdater`, ... | atomic update field chuyên biệt |

Module dùng hai experiment đại diện:

```text
SynchronizationController#atomicCas()
→ CAS / AtomicReference / ABA / AtomicStampedReference

SynchronizationController#atomicTools()
→ AtomicInteger / LongAdder / LongAccumulator
```
