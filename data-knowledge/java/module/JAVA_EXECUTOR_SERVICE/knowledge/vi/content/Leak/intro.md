# Thread / Pool Lifecycle & Leak

Leak trong concurrency thường không phải Java object leak đơn thuần. Một resource có lifecycle dài hơn ý định của application có thể giữ theo Thread, native stack, queue, task hoặc context.

Rule của learning module:

```text
unsafe pattern
→ quan sát trong phạm vi bounded
→ cleanup ngay trong cùng experiment
```

Không tạo endpoint mà mỗi lần gọi để lại một Thread/pool sống vô hạn.
