Trên class path, provider được đăng ký bằng **provider-configuration file** dưới:

```text
META-INF/services/<fully-qualified-service-name>
```

Ví dụ service:

```text
com.example.export.ReportExporter
```

thì provider JAR có file:

```text
META-INF/services/com.example.export.ReportExporter
```

với nội dung:

```text
com.example.export.pdf.PdfExporter
com.example.export.csv.CsvExporter
```

Mỗi dòng là binary name của provider class. File dùng UTF-8; blank line và comment `#` được hỗ trợ.

Provider class trên class path phải visible từ discovery class loader và phải thỏa constructor-based provider contract.

Đăng ký bằng file resource có lợi là host không cần compile dependency tới provider. Nhưng tính đúng đắn khi deployment giờ phụ thuộc cách đóng gói resource; shading/assembly sai có thể làm mất hoặc ghi đè service file, nên cần integration test artifact thực tế.

Một chi tiết quan trọng khi migrate sang JPMS: nếu provider class đã nằm trong **named module**, entry tương ứng trong `META-INF/services` không còn được dùng như registration cho unnamed-module discovery. Provider của named module phải được công bố bằng `provides` trong module descriptor. Điều này tránh một provider bị nhìn thấy hai lần qua cả module descriptor lẫn service file.
