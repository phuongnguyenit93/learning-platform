Hai API traversal chính có semantic khác nhau:

```text
iterator()/enhanced for
→ yield instance của service/provider
→ provider cần được instantiate để yield

stream()
→ yield ServiceLoader.Provider<S>
→ có thể inspect provider type trước khi Provider.get()
```

Ví dụ iterator:

```java
for (ReportExporter exporter : ServiceLoader.load(ReportExporter.class)) {
    if ("pdf".equals(exporter.format())) {
        exporter.export(report);
    }
}
```

Ví dụ stream khi muốn inspect class metadata trước:

```java
List<ReportExporter> exporters =
        ServiceLoader.load(ReportExporter.class)
                .stream()
                .filter(p -> p.type().isAnnotationPresent(StableProvider.class))
                .map(ServiceLoader.Provider::get)
                .toList();
```

`Provider.type()` cho biết type mà `ServiceLoader.Provider` expose; `Provider.get()` mới lấy instance. Với provider dùng constructor, đây là provider class. Với explicit-module provider dùng static `provider()` method, `type()` trả **return type của `provider()`**, không nhất thiết là class được ghi trong `provides ... with ...`.

Stream không làm discovery trở thành eager mặc định. Provider vẫn được locate lazily khi stream pipeline được consume.

Chọn iterator khi cần instance trực tiếp; chọn `Provider` stream khi việc lựa chọn có thể dựa trên metadata của type mà `Provider.type()` expose và muốn tránh khởi tạo provider quá sớm.
