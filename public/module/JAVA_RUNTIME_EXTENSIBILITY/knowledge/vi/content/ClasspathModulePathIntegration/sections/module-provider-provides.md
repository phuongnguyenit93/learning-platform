Provider trong explicit named module được đăng ký bằng `provides ... with ...`:

```java
module com.example.export.pdf {
    requires com.example.export.api;

    provides com.example.export.ReportExporter
        with com.example.export.pdf.PdfExporter;
}
```

Điểm đáng chú ý:

- provider được khai báo trong chính module chứa provider;
- một `provides` directive không trỏ provider class nằm ở module khác;
- package chứa phần triển khai thường không cần export cho host;
- host khám phá provider qua service contract, không cần import class triển khai của provider.

Việc không export provider package giúp giữ encapsulation tốt hơn:

```text
host
→ nhìn thấy service API
→ không cần nhìn thấy package triển khai
```

Một module có thể khai báo nhiều provider cho cùng service; declaration order của provider trong module descriptor là một phần ordering mà `ServiceLoader` sử dụng trong module đó.
