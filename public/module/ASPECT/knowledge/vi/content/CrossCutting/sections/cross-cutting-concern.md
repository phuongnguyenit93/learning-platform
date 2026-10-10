Business concern là logic cốt lõi của use case, ví dụ tạo đơn hàng hoặc hủy đơn hàng.

Cross-cutting concern là behavior xuất hiện ở nhiều nơi nhưng không phải business logic chính, ví dụ:

- logging;
- đo thời gian;
- auditing;
- tracing;
- authorization check.

Nếu mỗi business method tự viết logging, code dễ lặp:

```text
createOrder()
→ log before
→ business logic
→ log after

cancelOrder()
→ log before
→ business logic
→ log after
```

AOP cho phép tách phần lặp đó thành một Aspect:

```text
LoggingAspect
        ↓
createOrder()
cancelOrder()
```

Điểm quan trọng: AOP không làm business logic biến mất. Nó chỉ đặt một cross-cutting behavior ở boundary phù hợp.
