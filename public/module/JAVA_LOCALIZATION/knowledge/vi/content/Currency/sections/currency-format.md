`NumberFormat.getCurrencyInstance(locale)` tạo bộ định dạng có quy ước hiển thị tiền của Locale:

```java
Locale locale = Locale.US;
NumberFormat format = NumberFormat.getCurrencyInstance(locale);
format.setCurrency(Currency.getInstance("USD"));

String text = format.format(new BigDecimal("1234.50"));
```

Điểm cần chú ý là hai lựa chọn có thể độc lập:

```text
Locale.US
→ dấu phân cách, vị trí ký hiệu và quy ước ký hiệu theo Locale

Currency.getInstance("EUR")
→ đơn vị cần hiển thị là EUR
```

Ta có thể cố ý định dạng EUR cho người dùng US:

```java
NumberFormat format = NumberFormat.getCurrencyInstance(Locale.US);
format.setCurrency(Currency.getInstance("EUR"));
System.out.println(format.format(new BigDecimal("25.00")));
```

`setCurrency(...)` đổi tiền tệ mà bộ định dạng sử dụng, bao gồm định danh/ký hiệu tiền tệ, nhưng **không tự đặt lại** số chữ số thập phân tối thiểu/tối đa theo tiền tệ mới. Vì vậy một bộ định dạng được tạo cho USD rồi đổi sang JPY vẫn có thể giữ hai chữ số thập phân. Khi số chữ số hiển thị quan trọng, hãy cấu hình chúng có chủ đích theo tiền tệ giao dịch; chính sách làm tròn và số chữ số nghiệp vụ vẫn thuộc miền nghiệp vụ.

Đừng tự nối ký hiệu tiền tệ:

```java
"$" + amount
```

vì vị trí ký hiệu, khoảng trắng, dấu phân cách và sự mơ hồ của ký hiệu đều có thể phụ thuộc Locale.
