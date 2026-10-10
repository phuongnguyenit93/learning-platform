Capability model trả lời “plugin này làm được gì?” theo cách host có thể dùng để selection mà không biết implementation.

Biến thể `ReportExporter` dưới đây cố ý đổi sang **capability-oriented contract** để minh họa selection theo nhiều format/options; nó không thay thế baseline interface dùng bởi API experiment:

```java
public interface ReportExporter {
    Set<String> formats();
    boolean supports(ExportOptions options);
    void export(Report report, ExportOptions options);
}
```

Host có thể xây registry:

```text
pdf  → PdfExporter
csv  → CsvExporter
json → JsonExporter
```

Nếu có nhiều provider cùng capability, contract cần thêm policy: priority, version, tenant/environment, quality tier hoặc explicit configuration.

Capability nên mô tả điều host cần quyết định, không phải mọi implementation detail. Đừng expose raw dependency version nếu host chỉ cần biết một boolean capability.

Selection contract càng explicit, architecture càng ít phụ thuộc incidental discovery order.
