Không phải service nào cũng nên để provider chính là object thực thi operation cuối cùng.

Hai mô hình thường gặp:

```text
Direct provider
→ provider chính là service implementation

Factory/indirection provider
→ provider tạo object thực thi thực sự khi cần
```

Direct provider phù hợp khi object rẻ, stateless hoặc reusable:

```java
public final class PdfExporter implements ReportExporter { ... }
```

Factory phù hợp khi object đắt hoặc phụ thuộc request-specific configuration:

```java
public interface ExporterFactory {
    String format();
    ReportExporter create(ExportOptions options);
}
```

Host discovery factory một lần, sau đó factory tạo exporter theo từng configuration.

Java module provider còn hỗ trợ static `provider()` method, cho phép class được khai báo trong `provides ... with ...` đóng vai trò factory mà bản thân class đó không nhất thiết implement service type. Đây là platform mechanism hỗ trợ indirection; design decision vẫn phải xuất phát từ lifecycle/cost của domain object.
