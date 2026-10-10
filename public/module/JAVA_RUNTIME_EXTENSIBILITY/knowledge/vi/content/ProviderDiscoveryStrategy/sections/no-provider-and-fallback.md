Không có provider là một trạng thái hợp lệ của `ServiceLoader`; service có thể có zero provider.

Host phải quyết định semantic:

```text
required extension
→ fail fast lúc startup/activation

optional extension
→ disable feature

default implementation
→ fallback có chủ đích
```

Ví dụ fallback:

```java
ReportExporter exporter = loader.stream()
        .map(ServiceLoader.Provider::get)
        .filter(p -> p.format().equals("txt"))
        .findFirst()
        .orElse(DEFAULT_TEXT_EXPORTER);
```

Không nên fallback âm thầm nếu provider thiếu là lỗi deployment nghiêm trọng. Fallback âm thầm có thể che configuration defect và tạo hành vi khác kỳ vọng ở production.

Một startup validation tốt có thể kiểm tra required capabilities trước khi nhận traffic:

```text
required capabilities
→ discover
→ validate exactly/at least one usable provider
→ publish readiness
```

Selection policy và observability nên cùng phản ánh việc provider vắng mặt là optional hay fatal.
