Chọn cơ chế theo yêu cầu, không theo độ “advanced”.

| Nhu cầu | Cơ chế thường đủ |
|---|---|
| Implementation biết trước lúc build | Static wiring / DI |
| Provider JAR được discover ở startup | `ServiceLoader` class path |
| Named-module service providers | `uses` / `provides` + `ServiceLoader` |
| Runtime module graph riêng | `Configuration` + `ModuleLayer` |
| Dependency isolation mạnh trong JVM | dedicated loaders/layers |
| Cô lập lỗi mạnh | process boundary có thể phù hợp hơn |

Đừng dùng `ModuleLayer` nếu static startup module path đã đủ.

Đừng viết custom plugin framework nếu `ServiceLoader` + một registry nhỏ đã đáp ứng yêu cầu.

Ngược lại, đừng coi `ServiceLoader.reload()` là hot-reload architecture nếu plugin có trạng thái, tài nguyên và vòng đời class loader thực sự.

Độ phức tạp chỉ đáng đánh đổi khi nó giải quyết một yêu cầu cụ thể.
