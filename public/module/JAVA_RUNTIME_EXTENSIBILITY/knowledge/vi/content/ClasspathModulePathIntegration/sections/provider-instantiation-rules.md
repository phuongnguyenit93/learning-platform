Explicit module provider có hai cách construction.

**1. Provider constructor**

```java
public final class PdfExporter implements ReportExporter {
    public PdfExporter() {}
}
```

Provider phải có public no-arg constructor và instance phải assignable cho service.

**2. Public static `provider()` method**

```java
public final class PdfExporterProvider {
    public static ReportExporter provider() {
        return new PdfExporter(loadNativeEngine());
    }
}
```

Class `PdfExporterProvider` ở trường hợp này không bắt buộc implement `ReportExporter`; return type của `provider()` phải assignable cho service.

Provider method hữu ích khi construction cần indirection hoặc class khai báo trong `provides` không phải final service object.

Đừng nhầm với arbitrary factory API của application: Java nhận diện **đúng** public static no-arg method tên `provider` theo service-provider contract.
