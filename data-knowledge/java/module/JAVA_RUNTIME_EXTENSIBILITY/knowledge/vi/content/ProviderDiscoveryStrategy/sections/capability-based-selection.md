Một cách chọn provider là dựa trên capability mà không instantiate tất cả provider quá sớm.

Nếu capability nằm ở type-level metadata:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface ExportFormat {
    String value();
}
```

host có thể dùng `Provider.type()`:

```java
Optional<ReportExporter> pdf =
        ServiceLoader.load(ReportExporter.class)
                .stream()
                .filter(p -> {
                    ExportFormat meta = p.type().getAnnotation(ExportFormat.class);
                    return meta != null && meta.value().equals("pdf");
                })
                .map(ServiceLoader.Provider::get)
                .findFirst();
```

Ví dụ này phù hợp khi annotation nằm trên type mà `Provider.type()` trả về. Nếu explicit module dùng static `provider()` method thì `Provider.type()` là return type của method đó, không nhất thiết là factory class được ghi trong `provides`. Vì vậy đừng thiết kế selection metadata dựa trên giả định rằng `type()` luôn trả class khai báo provider.

Nếu capability phụ thuộc trạng thái runtime/request, service method thường rõ hơn:

```java
boolean supports(Report report);
```

Metadata tốt phải phục vụ một câu hỏi lựa chọn cụ thể. Tránh tạo annotation/descriptor lớn chỉ để mô tả mọi chi tiết provider.

Nếu ứng dụng cần ordering/priority, hãy biểu diễn nó rõ ràng (`priority()`, configuration, registry rule), rồi document hành vi phân xử khi bằng điểm.
