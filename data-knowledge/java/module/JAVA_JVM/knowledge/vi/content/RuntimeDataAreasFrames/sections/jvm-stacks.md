Mỗi JVM thread có một JVM stack riêng. Stack này chủ yếu chứa **frames** tương ứng với active method invocations của thread.

```text
Thread A JVM Stack
┌─────────────────┐
│ methodC frame   │ ← current
├─────────────────┤
│ methodB frame   │
├─────────────────┤
│ methodA frame   │
└─────────────────┘
```

Khi method được gọi, frame mới được tạo; khi invocation hoàn tất, frame bị hủy. Vì stack là thread-private, local variable trong frame không tự động trở thành shared state chỉ vì object referent nằm trên heap.

Stack size có thể fixed hoặc dynamically expanded tùy implementation. Specification tập trung vào semantics và hành vi khi thất bại, không áp một physical layout duy nhất.
