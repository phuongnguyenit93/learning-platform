Mục tiêu cuối cùng không phải nhớ càng nhiều class càng tốt.

Mental model cần giữ là:

```text
Correctness
→ JMM + synchronization

Progress
→ coordination + liveness design

Resource control
→ executor + queue + rejection + lifecycle

Result composition
→ Future / CompletableFuture

Context
→ explicit propagation + cleanup

Scalability
→ chọn execution model phù hợp, bao gồm Virtual Thread
```

Khi đã phân loại đúng vấn đề, việc chọn API sẽ dễ hơn nhiều.
