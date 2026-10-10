`Locale` có thể mang nhiều thông tin hơn ngôn ngữ + khu vực thông qua **phần mở rộng Unicode của Locale**. Một số API ngày giờ có thể dùng các phần mở rộng này để chọn hệ lịch, hệ chữ số, khu vực ghi đè hoặc múi giờ ghi đè cho phần trình bày.

Điều này **không thay đổi mô hình tư duy nền tảng**:

```text
Locale vẫn không phải ZoneId.
vi-VN không tự động đồng nghĩa Asia/Ho_Chi_Minh.
Múi giờ nghiệp vụ/lựa chọn của người dùng vẫn nên được mô hình hóa riêng.
```

Nhưng nó giải thích vì sao một số API bản địa hóa có thể đọc thêm lựa chọn từ Locale khi lập trình viên chủ động cung cấp một Locale có phần mở rộng.

Với định dạng ngày giờ, `DecimalStyle` mô tả các ký hiệu số dùng trong bộ định dạng:

```java
DecimalStyle style = DecimalStyle.of(locale);

char zeroDigit = style.getZeroDigit();
char positiveSign = style.getPositiveSign();
char negativeSign = style.getNegativeSign();
char decimalSeparator = style.getDecimalSeparator();
```

`DateTimeFormatter` có hai cách cần phân biệt:

```java
formatter.withLocale(locale);
formatter.localizedBy(locale);
```

Mô hình tư duy nhập môn:

```text
withLocale(locale)
→ đổi Locale dùng cho văn bản/mẫu đã bản địa hóa

localizedBy(locale)
→ áp dụng Locale rộng hơn, bao gồm các phần mở rộng Locale có liên quan
```

Ví dụ một Locale có lựa chọn về lịch hiển thị:

```java
Locale thaiBuddhist = Locale.forLanguageTag("th-TH-u-ca-buddhist");

DateTimeFormatter formatter = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.LONG)
        .localizedBy(thaiBuddhist);

String display = formatter.format(LocalDate.of(2026, 9, 27));
```

Ở đây `LocalDate` vẫn biểu diễn cùng ngày nghiệp vụ; lựa chọn `ca-buddhist` chỉ ảnh hưởng **hệ lịch (chronology/calendar) dùng cho phần trình bày** khi bộ định dạng hỗ trợ nó. Đừng lưu “năm hiển thị theo Phật lịch” như một giá trị thời gian mới chỉ vì UI cần cách viết khác.

Không nên nhồi phần mở rộng Unicode vào mọi yêu cầu nếu ứng dụng không có trường hợp sử dụng thật. Mục tiêu ở đây là hiểu **Locale có thể mang lựa chọn mở rộng và một số bộ định dạng biết đọc chúng**, chứ không phải biến Locale thành nơi chứa toàn bộ ngữ cảnh nghiệp vụ.
