Khi plugin model vượt qua discovery đơn giản, một `PluginManager` hoặc component tương đương thường xuất hiện để tập trung orchestration.

Ví dụ responsibilities:

```text
discover providers
→ validate metadata/compatibility
→ build registry
→ activate selected plugins
→ expose immutable/read-only view cho business code
→ stop/cleanup khi shutdown hoặc replacement
```

Pseudo-code:

```java
final class PluginManager {
    private final Map<String, ReportExporter> exporters;

    void start() { ... }
    ReportExporter exporterFor(String format) { ... }
    void stop() { ... }
}
```

`PluginManager` không nhất thiết là framework lớn. Nó chỉ cần tạo một nơi rõ ràng chứa lifecycle và selection policy thay vì để business code gọi `ServiceLoader` ở nhiều chỗ.

Tránh biến manager thành “god object” biết mọi plugin-specific detail. Nó nên orchestration qua contract/metadata ổn định.
