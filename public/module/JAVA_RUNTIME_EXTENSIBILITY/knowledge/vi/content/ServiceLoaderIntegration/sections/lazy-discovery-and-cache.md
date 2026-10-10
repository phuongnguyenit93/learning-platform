Provider được tìm và khởi tạo theo kiểu **lazy**, không phải toàn bộ được instantiate ngay khi gọi `ServiceLoader.load(...)`.

```java
ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class);

// Chưa có nghĩa tất cả provider đã được instantiate.
```

Khi iterate, loader sẽ:

```text
provider đã nằm trong cache
→ yield trước theo load/instantiation order

provider chưa được xử lý
→ locate lazily
→ instantiate khi cần
→ thêm vào cache
```

Cache thuộc **ServiceLoader instance**. Vì vậy tạo hai `ServiceLoader` riêng nghĩa là có hai discovery/cache context riêng.

Laziness hữu ích khi có nhiều provider nhưng request chỉ cần provider đầu tiên phù hợp. Tuy nhiên nó cũng có nghĩa lỗi cấu hình có thể xuất hiện trong lúc iterate/stream, không nhất thiết ở thời điểm `load(...)`.

```java
for (ReportExporter exporter : loader) {
    if (exporter.supports(report)) {
        exporter.export(report);
        break;
    }
}
```

Đừng dựa vào cache như một singleton registry ở cấp ứng dụng. Cache là hành vi của loader phục vụ discovery, không phải contract vòng đời của kiến trúc plugin.
