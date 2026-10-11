Bốn vai trò chính tạo thành mental model của module:

```text
Host
→ code sử dụng capability

Service Contract
→ interface/abstract class mô tả capability

Provider
→ implementation hoặc factory cung cấp capability

Discovery
→ cơ chế tìm provider khi application đang chạy
```

Ví dụ:

```java
public interface ReportExporter {
    String format();
    String export(String report);
}
```

`ReportExporter` là service contract. `PdfExporter` và `CsvExporter` có thể là provider. Host chỉ cần phụ thuộc vào `ReportExporter`; nó không cần `new PdfExporter()` ở mọi nơi.

Đây là **baseline running example** cũng được dùng bởi các API experiment của module. Ở các chapter sau, một số snippet sẽ cố ý mở rộng hoặc rút gọn `ReportExporter` để minh họa riêng capability modeling, error contract hoặc SPI evolution; các snippet đó là **biến thể minh họa**, không phải cùng một source interface âm thầm thay đổi.

```java
ServiceLoader<ReportExporter> exporters =
        ServiceLoader.load(ReportExporter.class);
```

`ServiceLoader` ở đây là discovery mechanism. Sau discovery, **host vẫn phải quyết định** provider nào phù hợp. Vì vậy cần giữ rõ hai khái niệm:

```text
discovery
→ tìm provider nào đang tồn tại

selection
→ chọn provider nào phù hợp với yêu cầu hiện tại
```

Sự phân tách này là nền tảng cho toàn bộ module: SPI định nghĩa contract, `ServiceLoader` làm discovery, plugin architecture quản lý lifecycle/isolation, và `ModuleLayer` hỗ trợ composition ở module level.
