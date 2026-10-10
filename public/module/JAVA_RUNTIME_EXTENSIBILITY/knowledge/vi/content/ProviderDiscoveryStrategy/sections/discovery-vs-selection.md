Discovery và selection là hai bước khác nhau:

```text
Discovery
→ runtime có provider nào?

Selection
→ provider nào phù hợp với request/policy hiện tại?
```

`ServiceLoader` giải quyết bước đầu. Bước sau là trách nhiệm application.

Ví dụ host cần exporter cho `pdf`:

```java
ReportExporter exporter = ServiceLoader.load(ReportExporter.class)
        .stream()
        .map(ServiceLoader.Provider::get)
        .filter(p -> p.format().equalsIgnoreCase("pdf"))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No PDF exporter"));
```

Ở đây `findFirst()` chỉ là terminal operation sau khi ứng dụng đã lọc provider theo chính sách của nó.

Đừng biến “provider được discovery trước” thành business rule nếu không có contract rõ. Thứ tự provider ở runtime có thể phụ thuộc module graph, thứ tự class loader/resource và topology triển khai.

Một architecture tốt xem discovery như input cho selection policy, không xem discovery order như policy.
