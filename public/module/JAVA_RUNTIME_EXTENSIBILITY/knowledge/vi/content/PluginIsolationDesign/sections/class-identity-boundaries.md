Trong JVM, type identity không chỉ là fully-qualified class name. Một mental model quan trọng là:

```text
type identity
≈ class name + defining ClassLoader
```

Hai loader có thể load hai bản `com.example.api.ReportExporter`; JVM có thể xem chúng là hai type khác nhau.

Đây là lý do **shared contract** thường phải được load từ common parent/shared loader mà cả host và plugin cùng nhìn thấy.

```text
shared parent loader
→ ReportExporter contract

plugin loader A
→ PdfExporter

plugin loader B
→ CsvExporter
```

Nếu mỗi plugin bundle một copy riêng của contract class và load child-first, cast về host `ReportExporter` có thể fail dù class name giống hệt.

Chi tiết delegation mechanics thuộc ClassLoader module; điều cần giữ ở đây là contract type phải có một identity chung qua isolation boundary.
