Với named module consumer, việc gọi `ServiceLoader` là một dependency được khai báo trong `module-info.java`.

Ví dụ service type nằm trong module `com.example.export.api`:

```java
module com.example.report.host {
    requires com.example.export.api;
    uses com.example.export.ReportExporter;
}
```

Hai directive giải quyết hai việc khác nhau:

```text
requires
→ host đọc module export service type

uses
→ host tuyên bố nó là consumer của service đó
```

Nếu service type nằm ngay trong consumer module thì không cần `requires` chính module đó; nhưng `uses` vẫn là declaration của service consumption.

Named-module caller không nên coi `uses` chỉ là documentation. `ServiceLoader` kiểm tra caller/module contract và service binding/resolution dựa trên thông tin này.

Đây là điểm Runtime Extensibility sử dụng JPMS; full readability/exports/resolution semantics vẫn thuộc Module System curriculum.
