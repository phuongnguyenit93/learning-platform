Có “nhiều provider” không đồng nghĩa bị duplicate. Nhiều cách triển khai là use case bình thường của SPI.

Duplicate có thể xuất hiện ở hai mức:

```text
cùng provider class được liệt kê lặp
→ Java có rule loại duplicate trong service configuration

hai provider class khác nhau cung cấp cùng business capability
→ application phải giải quyết ambiguity
```

Ví dụ hai exporter đều khai báo `format() == "pdf"`. Host cần policy: ưu tiên provider nào, reject ambiguity, hay chọn theo capability/version.

Provider “broken” là trường hợp khác: class/configuration tồn tại nhưng load/instantiate lỗi. Đừng trộn nó với “unsupported capability”.

Một registry trung gian có thể chuẩn hóa discovery result:

```text
ServiceLoader
→ validate provider
→ normalize metadata
→ detect capability collision
→ build immutable registry
```

Sau startup, business path có thể dùng registry đã validate thay vì thực hiện raw discovery lặp lại trên mỗi request.

Selection policy chỉ có ý nghĩa nếu provider thực sự được **đăng ký và triển khai đúng trong runtime topology**. Chapter tiếp theo vì vậy chuyển từ “chọn provider nào” sang cách class path và module path biểu diễn provider registration/discovery boundary.
