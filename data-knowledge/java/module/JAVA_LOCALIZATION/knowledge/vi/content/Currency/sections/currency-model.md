`java.util.Currency` đại diện cho thông tin về một loại tiền theo chuẩn mà JDK biết, thường được xác định bằng mã ISO 4217:

```java
Currency usd = Currency.getInstance("USD");
Currency vnd = Currency.getInstance("VND");
```

### Vì sao cần `Currency` thay vì chỉ giữ chuỗi `"USD"` hoặc `"$"`?

Một String chỉ là văn bản. `Currency` cho Java một đối tượng có ý nghĩa rõ ràng để mang **định danh và siêu dữ liệu của đơn vị tiền tệ**.

Các thông tin quan trọng thường gồm:

```text
mã tiền tệ          → USD
mã số               → mã số ISO tương ứng
ký hiệu             → $, US$, ... tùy Locale hiển thị
tên hiển thị        → tên tiền tệ theo Locale
số chữ số thập phân mặc định
                    → số chữ số thập phân mặc định của loại tiền
```

Đặc biệt, ký hiệu **không đủ để làm định danh** vì cùng một ký hiệu như `$` có thể liên quan tới nhiều loại tiền. Miền nghiệp vụ nên dựa vào mã/đối tượng `Currency` rõ ràng, không dựa vào ký hiệu hiển thị.

Một `Currency` có thể cung cấp:

```java
usd.getCurrencyCode();          // USD
usd.getNumericCode();
usd.getDefaultFractionDigits();
usd.getSymbol(Locale.US);
usd.getDisplayName(Locale.US);
```

`getDefaultFractionDigits()` là siêu dữ liệu về số chữ số thập phân thường dùng cho loại tiền, không phải luật kế toán bắt buộc cho mọi thao tác nghiệp vụ. Việc tính toán tiền trong nghiệp vụ vẫn phải có chính sách số chữ số thập phân và làm tròn rõ ràng.

`Currency` mang siêu dữ liệu/định danh đơn vị; nó **không chứa số tiền**.

```text
Currency
→ USD

BigDecimal
→ 125.50

giá trị tiền trong nghiệp vụ
→ cần kết hợp cả số tiền + loại tiền
```

Java Core không có sẵn một kiểu giá trị `Money` trong `java.base` có thể thay thế toàn bộ việc mô hình hóa tiền trong nghiệp vụ.
