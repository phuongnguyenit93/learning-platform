Selection policy nên được viết thành rule explicit thay vì rải nhiều `if/else` khắp host.

Ví dụ:

```java
public final class ExporterSelector {
    public ReportExporter select(
            Collection<ReportExporter> providers,
            String format,
            Report report) {

        return providers.stream()
                .filter(p -> p.format().equalsIgnoreCase(format))
                .filter(p -> p.supports(report))
                .findFirst()
                .orElseThrow(() -> new NoExporterException(format));
    }
}
```

Policy có thể dựa trên:

- format/protocol/capability;
- feature set;
- version compatibility;
- configuration của environment;
- explicit priority do application định nghĩa;
- health/availability nếu architecture cho phép.

Điểm quan trọng là priority phải đến từ **application contract**, không từ incidental discovery order.

Khi selection phức tạp, hãy tách provider registry/selector khỏi business service để dễ test. `ServiceLoader` nên nằm ở infrastructure boundary; domain code không cần biết provider được tìm bằng class path hay module layer.
