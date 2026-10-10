`ServiceLoader<S>` là cơ chế chuẩn của Java để tìm cách triển khai của một **service type** `S` trong môi trường runtime.

Flow cơ bản:

```java
ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class);

for (ReportExporter exporter : loader) {
    System.out.println(exporter.format());
}
```

`ServiceLoader` không phải dependency-injection container. Nó không tự resolve constructor graph, scope hay lifecycle. Nó chỉ biết contract service/provider mà Java platform định nghĩa.

Một service có thể có:

```text
0 provider
1 provider
nhiều provider
```

Do đó host phải thiết kế cả trường hợp “không tìm thấy provider” và “có nhiều provider”.

Nguồn provider phụ thuộc overload/context được dùng:

- class loader based discovery có thể tìm provider trong named module và unnamed module/class path tương ứng;
- layer based discovery dùng `ServiceLoader.load(layer, service)` và tìm trong layer cùng ancestor layers.

Điểm cần nhớ: `ServiceLoader` **tìm + nạp** provider; ứng dụng vẫn sở hữu chính sách lựa chọn và hành vi domain sau đó.
