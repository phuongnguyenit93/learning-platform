Sau khi layer được define, provider có thể được khám phá trực tiếp theo layer:

```java
ServiceLoader<ReportExporter> exporters =
        ServiceLoader.load(layer, ReportExporter.class);
```

Overload này tìm provider trong:

```text
current layer
→ ancestor layers theo traversal rules
```

Nó **không** tìm provider từ unnamed modules/class path trong phạm vi khám phá của overload theo layer này.

Named-module caller vẫn phải thỏa service usage contract (`uses`).

Điểm mạnh của layer-based discovery là ngữ cảnh khám phá được chỉ rõ: host biết chính xác module-layer graph nào đang đại diện thế hệ plugin hiện tại.

Việc lựa chọn và quản lý vòng đời vẫn là trách nhiệm của ứng dụng. `ServiceLoader.load(layer, ...)` không tự activate plugin hay tự giải quyết trường hợp nhiều provider cùng phù hợp.
