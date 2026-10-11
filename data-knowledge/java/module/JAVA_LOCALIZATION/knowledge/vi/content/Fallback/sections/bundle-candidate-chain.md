Giả sử tên cơ sở (`base name`) là `Messages` và Locale là `en-US`.

Các gói tài nguyên có thể có:

```text
Messages_en_US.properties
Messages_en.properties
Messages.properties
```

Mô hình tư duy ở mức nhập môn:

```text
Locale yêu cầu càng cụ thể
        ↓
ứng viên cụ thể hơn được ưu tiên
        ↓
nếu không có thì thử ứng viên tổng quát hơn
        ↓
`Locale.ROOT` đại diện cho gói tài nguyên gốc trong danh sách ứng viên
```

`ResourceBundle.Control` cho phép quan sát danh sách Locale ứng viên:

```java
ResourceBundle.Control control = ResourceBundle.Control.getControl(
        ResourceBundle.Control.FORMAT_DEFAULT
);

List<Locale> candidates = control.getCandidateLocales(
        "Messages",
        Locale.forLanguageTag("en-US")
);
```

Với Locale có hệ chữ/biến thể, danh sách có thể phức tạp hơn ví dụ `en-US` đơn giản. Hãy dựa vào API thay vì tự viết thuật toán tra cứu bằng cách nối tên tệp.

Điểm cần tách rõ là **việc tạo danh sách Locale ứng viên** và **việc chọn Locale dự phòng** không phải cùng một bước. `getCandidateLocales(...)` tạo danh sách ứng viên cho *một* Locale đang xét. Nếu chính sách tra cứu cho phép thử một Locale dự phòng khác (mặc định có thể là Locale mặc định của JVM), Java có thể tạo **một danh sách ứng viên mới** cho Locale dự phòng đó. Vì vậy không nên ghi nhớ một chuỗi tên tệp cố định rồi tự mô phỏng hành vi của `ResourceBundle`.
