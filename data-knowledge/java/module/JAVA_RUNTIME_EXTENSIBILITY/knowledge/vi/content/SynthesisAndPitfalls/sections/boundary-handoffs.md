Biết lúc nào **không tiếp tục đào sâu trong module này** cũng quan trọng.

Handoff khi câu hỏi chính trở thành:

```text
ClassLoader delegation/class identity mechanics chi tiết?
→ Java Core ClassLoader

module readability/exports/opens/resolution đầy đủ?
→ JPMS / Module System

framework extension points, DI scopes, bean lifecycle?
→ framework plugin/module owner

redefine/retransform bytecode hoặc Java Agent?
→ Instrumentation

process sandbox/security/OS isolation?
→ system/infrastructure architecture
```

Runtime Extensibility chỉ giữ đủ boundary concept để thiết kế host/plugin đúng; nó không duplicate full curriculum của các owner trên.

Boundary rõ giúp learner biết concept nào là “tool dùng để implement plugin system” và concept nào chính là core responsibility của module này.
