Mental model cuối cùng cần giữ:

```text
Runtime Extensibility
=
stable contract
+ independently deployable provider
+ explicit discovery context
+ application-owned selection policy
+ lifecycle
+ compatibility
+ isolation/failure boundary
```

Trong Java:

```text
SPI
→ định nghĩa capability

ServiceLoader
→ locate/load provider

Class Path / Module Path
→ deployment models

ClassLoader
→ visibility + type identity boundary

Configuration / ModuleLayer
→ dynamic named-module graph
```

Nếu chỉ nhớ một nguyên tắc: **discovery không phải toàn bộ plugin architecture**.

Hãy bắt đầu bằng contract và requirement. Chỉ thêm `ServiceLoader`, custom loader hoặc `ModuleLayer` khi mỗi cơ chế giải quyết một vấn đề rõ ràng mà level đơn giản hơn không giải quyết được.
