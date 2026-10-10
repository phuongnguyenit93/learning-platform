Khi cần kiểm soát mẫu định dạng chi tiết hơn, bộ định dạng thực tế thường là `DecimalFormat`:

```java
DecimalFormatSymbols symbols = DecimalFormatSymbols.getInstance(Locale.US);
DecimalFormat format = new DecimalFormat("#,##0.00", symbols);

String text = format.format(new BigDecimal("1234.5"));
```

Mẫu mô tả cấu trúc định dạng:

```text
#  → chữ số tùy chọn
0  → chữ số bắt buộc
.  → dấu thập phân trong cú pháp mẫu
,  → dấu nhóm chữ số trong cú pháp mẫu
```

`DecimalFormatSymbols` quyết định ký hiệu thực tế của Locale như dấu thập phân, dấu nhóm chữ số, dấu phần trăm và các ký hiệu khác.

Không nên ghi cứng dấu `,` hoặc `.` vào logic nghiệp vụ để “sửa” String sau khi định dạng. Hãy cấu hình bộ định dạng/ký hiệu đúng tại ranh giới trình bày.

### Quy tắc làm tròn không phải là Locale

Bộ định dạng có thể làm tròn để phần hiển thị có số chữ số mong muốn:

```java
format.setMaximumFractionDigits(2);
format.setRoundingMode(RoundingMode.HALF_UP);
```

Nhưng quy tắc làm tròn khi tính tiền/thuế vẫn là **chính sách nghiệp vụ**. Locale chỉ quyết định cách biểu diễn; không được để lựa chọn Locale thay đổi giá trị nghiệp vụ phải thanh toán.
