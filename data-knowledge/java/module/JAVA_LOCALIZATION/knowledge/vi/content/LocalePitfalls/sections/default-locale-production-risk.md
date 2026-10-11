Đoạn mã sau nhìn vô hại:

```java
NumberFormat format = NumberFormat.getNumberInstance();
String lower = input.toLowerCase();
DateTimeFormatter formatter = DateTimeFormatter.ofLocalizedDate(FormatStyle.SHORT);
```

Nhưng các API này **không cùng đọc một giá trị mặc định**. `String.toLowerCase()` dùng Locale mặc định chung của JVM, còn các API định dạng như `NumberFormat` và `DateTimeFormatter` dạng bản địa hóa dùng Locale mặc định của nhóm `FORMAT`. Điểm nguy hiểm chung là hành vi đang phụ thuộc trạng thái toàn cục của JVM thay vì Locale ứng dụng/người dùng truyền tường minh.

Hệ quả:

```text
máy lập trình viên → kiểm thử đạt
máy CI             → kết quả khác
nút vận hành A     → Locale X
nút vận hành B     → Locale Y
```

Hệ thống phía máy chủ phục vụ nhiều người dùng nên truyền Locale từ yêu cầu hoặc lựa chọn ngôn ngữ của người dùng một cách rõ ràng:

```java
String render(Order order, Locale userLocale) { ... }
```

Locale mặc định chỉ nên là một **chính sách có chủ đích**, không phải phụ thuộc vô hình.

Kiểm thử bản địa hóa cũng nên chạy với nhiều Locale mặc định để phát hiện mã nguồn lén phụ thuộc môi trường:

```java
Locale previousGeneral = Locale.getDefault();
Locale previousDisplay = Locale.getDefault(Locale.Category.DISPLAY);
Locale previousFormat = Locale.getDefault(Locale.Category.FORMAT);
try {
    Locale.setDefault(Locale.forLanguageTag("tr-TR"));
    // chạy kiểm thử tập trung
} finally {
    Locale.setDefault(previousGeneral);
    Locale.setDefault(Locale.Category.DISPLAY, previousDisplay);
    Locale.setDefault(Locale.Category.FORMAT, previousFormat);
}
```

`Locale.setDefault(Locale)` thay đổi Locale mặc định chung và cả hai nhóm mặc định `DISPLAY`/`FORMAT`, vì vậy kiểm thử dùng cách này phải khôi phục đủ cả ba giá trị nếu trước đó chúng có thể khác nhau. Đây vẫn là trạng thái toàn cục nên các kiểm thử chạy song song có thể ảnh hưởng lẫn nhau; hãy cô lập kiểm thử hoặc ưu tiên mã nhận Locale tường minh.
