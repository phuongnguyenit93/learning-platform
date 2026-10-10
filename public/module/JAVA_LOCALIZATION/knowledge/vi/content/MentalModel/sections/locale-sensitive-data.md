Đây là mô hình tư duy quan trọng nhất của mô-đun.

Không phải mọi dữ liệu đều nên thay đổi theo `Locale`.

| Loại thông tin | Giá trị chuẩn/nghiệp vụ | Cách trình bày theo Locale |
| --- | --- | --- |
| số tiền | `BigDecimal("1234567.89")` | `1.234.567,89` hoặc `1,234,567.89` |
| mã tiền tệ | `Currency.getInstance("USD")` | `$`, `US$`, tên hiển thị tùy ngữ cảnh |
| thời điểm | `Instant` | ngày/giờ theo Locale **và** múi giờ được chọn |
| trạng thái | enum/mã như `PAID` | `Đã thanh toán` / `Paid` |
| khóa thông điệp | `order.created` | văn bản bản dịch |
| chuỗi dùng cho giao thức | khóa, header, định danh | thường phải không phụ thuộc Locale |

Ví dụ đúng hướng:

```java
record Order(BigDecimal total, Currency currency, Instant createdAt) {}
```

Tầng trình bày nhận thêm ngữ cảnh:

```java
Locale locale = Locale.forLanguageTag("vi-VN");
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
```

Rồi mới chuyển giá trị chuẩn thành văn bản cho người dùng.

Một lỗi thiết kế thường gặp là lưu luôn chuỗi đã định dạng:

```java
record Order(String total) {}

// "1.234.567,89 ₫"
```

Khi đó ứng dụng rất khó tính toán lại, đổi Locale, đổi tiền tệ hoặc tuần tự hóa theo định dạng dành cho máy. Giá trị dùng để hiển thị đã làm mất ranh giới với dữ liệu nghiệp vụ.

Mô hình tư duy nên là:

```text
giá trị nghiệp vụ
    ↓
giữ dạng biểu diễn ổn định, có nghĩa nghiệp vụ
    ↓
ranh giới trình bày
    + Locale
    + ZoneId khi thời gian cần múi giờ
    + Currency khi tiền tệ cần đơn vị
    ↓
văn bản dành cho người dùng
```

`Locale` **không phải** `ZoneId` và cũng **không phải** `Currency`. Locale cung cấp ngữ cảnh về ngôn ngữ/vùng/quy ước trình bày; các khái niệm còn lại có trách nhiệm riêng.
