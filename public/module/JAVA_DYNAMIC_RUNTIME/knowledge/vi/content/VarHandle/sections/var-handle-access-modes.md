VarHandle nhóm access theo semantics:

```text
plain
→ get / set

opaque
→ getOpaque / setOpaque

acquire / release
→ getAcquire / setRelease

volatile
→ getVolatile / setVolatile

atomic / update
→ compareAndSet
→ compareAndExchange...
→ getAndSet
→ getAndAdd...
```

Mode mạnh hơn không mặc định “tốt hơn”. Nó biểu diễn hợp đồng ordering/atomicity khác và có thể có chi phí khác.

Ở module này, mục tiêu là biết VarHandle cho phép **chọn hợp đồng truy cập** thay vì dùng một get/set duy nhất. Việc chứng minh memory ordering chính xác thuộc Concurrency.

Không phải VarHandle nào cũng hỗ trợ mọi access mode. Ví dụ:

- VarHandle tới `final` field không hỗ trợ write và atomic-update modes;
- numeric atomic update chỉ áp dụng cho các variable type số được API hỗ trợ;
- bitwise atomic update chỉ áp dụng cho các variable type mà API cho phép.

Gọi một access mode không được hỗ trợ sẽ ném `UnsupportedOperationException`. Có thể kiểm tra trước bằng `isAccessModeSupported`.
