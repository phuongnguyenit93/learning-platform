Provider type là type mà cơ chế khám phá ở runtime có thể tìm thấy và dùng để cung cấp service. Theo contract của `ServiceLoader`, provider type phải là `public` và không được là inner class. Với explicit module, provider type thậm chí có thể là interface hoặc abstract class nếu nó cung cấp static `provider()` method hợp lệ.

Trong trường hợp đơn giản:

```java
public final class PdfExporter implements ReportExporter {
    @Override
    public String format() {
        return "pdf";
    }

    @Override
    public boolean supports(Report report) {
        return true;
    }

    @Override
    public void export(Report report) {
        // PDF implementation
    }
}
```

Provider không nên yêu cầu host biết helper class, type đặc thù của thư viện hay chi tiết khởi tạo nội bộ của nó.

Thiết kế provider cũng cần trả lời:

- một instance có thể tái sử dụng hay không;
- có an toàn khi nhiều thread dùng đồng thời hay không;
- provider giữ tài nguyên dài hạn hay chỉ tạo tài nguyên khi được gọi;
- lỗi khởi tạo được báo bằng cách nào;
- trách nhiệm dọn dẹp thuộc provider hay host.

`ServiceLoader` biết cách tạo provider theo contract của platform, nhưng nó không tự định nghĩa semantics vòng đời cho ứng dụng. Vì vậy thiết kế provider phải phù hợp với vòng đời plugin mà host sẽ quản lý ở các chapter sau.
