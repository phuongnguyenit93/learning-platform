Static wiring không sai. Nó thường là lựa chọn đơn giản và tốt nhất khi tập implementation được biết trước khi build/deploy.

Vấn đề xuất hiện khi host phải thay đổi mỗi lần có extension mới:

```java
switch (format) {
    case "pdf" -> new PdfExporter();
    case "csv" -> new CsvExporter();
    case "json" -> new JsonExporter();
    default -> throw new IllegalArgumentException();
}
```

Ở đây, thêm một provider mới đồng nghĩa sửa host, build lại host và redeploy host. Điều đó làm mất lợi ích của extension độc lập.

Một registry hard-coded cũng chỉ chuyển coupling sang vị trí khác:

```java
registry.put("pdf", new PdfExporter());
registry.put("csv", new CsvExporter());
```

Runtime extensibility đáng cân nhắc khi có ít nhất một nhu cầu như:

- provider được phát triển/đóng gói độc lập;
- host không nên biết trước mọi provider;
- capability có thể được bổ sung bằng JAR/module mới;
- application cần chọn provider theo capability hoặc metadata;
- plugin cần isolation hoặc lifecycle riêng.

Nếu các nhu cầu trên không tồn tại, dependency injection hoặc static wiring thường đơn giản hơn và dễ vận hành hơn.
