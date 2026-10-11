Nếu người dùng nhập số đã bản địa hóa, bộ phân tích phải dùng cùng quy ước:

```java
NumberFormat format = NumberFormat.getNumberInstance(
        Locale.forLanguageTag("vi-VN")
);

Number parsed = format.parse(input);
```

Một String có thể mang nghĩa khác nếu phân tích bằng Locale khác. Vì vậy máy chủ không nên phân tích dữ liệu người dùng bằng Locale mặc định không rõ nguồn gốc.

`NumberFormat.parse(String)` có thể phân tích một phần đầu hợp lệ rồi dừng trước phần còn lại. Khi việc kiểm tra dữ liệu yêu cầu **toàn bộ String phải hợp lệ**, dùng `ParsePosition` và kiểm tra vị trí cuối:

```java
ParsePosition pos = new ParsePosition(0);
Number number = format.parse(input, pos);

boolean valid = number != null
        && pos.getIndex() == input.length()
        && pos.getErrorIndex() < 0;
```

Nếu lớp triển khai thực tế là `DecimalFormat` và cần `BigDecimal` thay vì `Long`/`Double` theo hành vi phân tích mặc định:

```java
NumberFormat numberFormat = NumberFormat.getNumberInstance(locale);
if (numberFormat instanceof DecimalFormat decimal) {
    decimal.setParseBigDecimal(true);
}
```

`NumberFormat.getNumberInstance(...)` trả về kiểu trừu tượng `NumberFormat`; không nên giả định mọi provider đều bắt buộc trả `DecimalFormat`. Khi đúng là `DecimalFormat`, bật `setParseBigDecimal(true)` giúp tránh đưa sai số xấp xỉ của số dấu phẩy động vào dữ liệu nghiệp vụ chỉ vì bước phân tích từ UI.
