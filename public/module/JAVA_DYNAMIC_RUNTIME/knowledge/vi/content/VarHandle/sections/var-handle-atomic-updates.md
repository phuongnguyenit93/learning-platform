Compare-and-set family dùng expected value để cập nhật có điều kiện:

```java
boolean updated =
        (boolean) VALUE.compareAndSet(
                counter,
                expected,
                next
        );
```

Mental model:

```text
read witness/current value
→ witness khớp expected theo ngữ nghĩa của access mode?
    ├─ yes → write next + success
    └─ no  → không ghi + thất bại
```

Với reference và phần lớn primitive, mental model trên gần với phép so sánh `==`. Riêng `float`/`double`, numeric và atomic update modes so sánh **bitwise representation**, vì vậy NaN hoặc `-0.0`/`+0.0` có thể cho kết quả khác trực giác từ toán tử `==`.

`compareAndExchange` trả lại witness/current value thay vì boolean. Weak CAS variants có thể thất bại giả (spurious failure) ngay cả khi expected khớp, nên thường được dùng trong vòng lặp retry.

`getAndAdd`, `getAndSet` và các bitwise atomic update variants là những thao tác read-modify-write.

Đừng từ đây nhảy thẳng tới “lock-free luôn tốt hơn lock”. Tính đúng đắn, contention và progress guarantees thuộc curriculum Concurrency.
