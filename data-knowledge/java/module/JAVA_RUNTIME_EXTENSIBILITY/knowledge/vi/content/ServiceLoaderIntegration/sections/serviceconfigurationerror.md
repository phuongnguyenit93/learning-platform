`ServiceConfigurationError` báo rằng service-provider environment/configuration không hợp lệ hoặc provider không thể load/instantiate theo contract.

Các nguyên nhân điển hình:

- provider class không load được;
- provider không assignable cho service khi constructor model yêu cầu;
- thiếu public no-arg provider constructor;
- `provider()` method có signature/return type không hợp lệ;
- `provider()` trả `null` hoặc ném exception;
- file `META-INF/services/...` sai format;
- I/O error khi đọc provider configuration.

Lỗi có thể xuất hiện trong `hasNext()`, `next()` hoặc khi consume stream vì discovery là lazy.

```java
try {
    for (ReportExporter exporter : loader) {
        register(exporter);
    }
} catch (ServiceConfigurationError error) {
    log.error("Broken exporter provider", error);
}
```

Đừng mặc định swallow mọi `ServiceConfigurationError`. Provider configuration bị hỏng thường là deployment/configuration defect cần quan sát rõ.

Nếu business cho phép bỏ qua một provider lỗi và tiếp tục provider khác, policy đó phải explicit và được test. `ServiceLoader` có thể cố tiếp tục trong một số iteration path, nhưng recovery toàn diện không phải guarantee để architecture phụ thuộc mù quáng.

Sau khi hiểu **discovery có thể trả 0, 1, nhiều hoặc provider lỗi**, bước tiếp theo là tách discovery khỏi quyết định nghiệp vụ: provider nào thực sự nên được chọn cho request hiện tại và ambiguity phải được xử lý ra sao.
