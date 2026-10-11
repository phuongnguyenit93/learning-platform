Runtime Extensibility là khả năng để một ứng dụng Java **mở rộng hành vi sau khi host đã được thiết kế**, bằng cách nạp implementation thông qua một contract đã biết trước thay vì hard-code mọi implementation vào host.

Hãy hình dung một ứng dụng cần xuất báo cáo. Cách đơn giản nhất là viết trực tiếp:

```java
PdfExporter exporter = new PdfExporter();
exporter.export(report);
```

Cách này ổn khi chỉ có một implementation. Nhưng nếu sau này cần thêm `CsvExporter`, `JsonExporter`, hoặc provider do team khác đóng gói thành JAR riêng, host bắt đầu phải biết quá nhiều implementation cụ thể.

Runtime extensibility giải quyết bài toán đó bằng một boundary:

```text
Host
  ↓ depends on
Service Contract
  ↑ implemented/provided by
Provider

Provider Discovery
→ tìm implementation phù hợp ở runtime
```

Điểm quan trọng: extensibility không có nghĩa “mọi thứ đều động”. Host vẫn phải biết **service contract** nào nó muốn dùng. Phần động là provider nào thực hiện contract đó và provider được phát hiện như thế nào.

Module này tồn tại vì Java có một service-provider model chuẩn (`ServiceLoader`) và các cơ chế module/runtime như `ModuleLayer` để tổ chức extension theo cách ít coupling hơn.
