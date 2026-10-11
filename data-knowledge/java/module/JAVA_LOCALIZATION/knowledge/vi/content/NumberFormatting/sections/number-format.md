`NumberFormat` cung cấp bộ định dạng theo Locale:

Nói rõ hơn, `NumberFormat` là **lớp trừu tượng chuyển qua lại giữa giá trị số và cách viết số dành cho con người** theo một Locale.

```text
định dạng
số → String theo Locale

phân tích
String theo Locale → Number
```

Nó tồn tại vì dấu phân cách, cách nhóm chữ số, dấu phần trăm, cách trình bày tiền tệ và một số quy ước chữ số không phải lúc nào cũng giống nhau giữa các Locale.

Các mảnh chính trong nhóm API này là:

```text
NumberFormat
→ lớp trừu tượng / điểm tạo chung

DecimalFormat
→ lớp triển khai cho phép điều khiển mẫu chi tiết

DecimalFormatSymbols
→ tập ký hiệu phụ thuộc Locale

Locale
→ ngữ cảnh chọn quy ước
```

```java
BigDecimal value = new BigDecimal("1234567.89");

NumberFormat vi = NumberFormat.getNumberInstance(
        Locale.forLanguageTag("vi-VN")
);
NumberFormat us = NumberFormat.getNumberInstance(Locale.US);

System.out.println(vi.format(value));
System.out.println(us.format(value));
```

Kết quả cụ thể phụ thuộc dữ liệu Locale của môi trường chạy, nhưng khác biệt điển hình là dấu nhóm hàng nghìn và dấu thập phân.

Ngoài bộ định dạng số tổng quát còn có:

```java
NumberFormat.getIntegerInstance(locale);
NumberFormat.getPercentInstance(locale);
NumberFormat.getCurrencyInstance(locale);
```

Với định dạng đơn giản kiểu `printf`/`String.format`, Java cũng có overload nhận `Locale`:

```java
String text = String.format(Locale.US, "%,.2f", 1234.5);
```

Nếu bỏ `Locale`, các API định dạng kiểu này có thể dựa vào Locale mặc định. Khi đầu ra dành cho người dùng và cần bản địa hóa rõ ràng, truyền Locale tường minh giúp mã dễ hiểu và dễ kiểm thử hơn.

Chọn phương thức tạo theo **ý nghĩa trình bày**, không phải chỉ vì kết quả nhìn gần giống mong muốn.

Ví dụ phần trăm:

```java
NumberFormat percent = NumberFormat.getPercentInstance(Locale.US);
System.out.println(percent.format(0.25)); // dạng hiển thị khoảng 25%
```

Giá trị nghiệp vụ vẫn giữ `0.25`; `%` thuộc cách trình bày.
