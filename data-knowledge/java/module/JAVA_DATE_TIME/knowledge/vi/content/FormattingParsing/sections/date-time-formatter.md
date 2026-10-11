`DateTimeFormatter` là bộ định dạng và phân tích chuỗi chính của `java.time`. Nó được thiết kế bất biến và an toàn đa luồng, nên có thể tái sử dụng thay vì tạo mới cho từng yêu cầu.

`DateTimeFormatterBuilder` là **bộ dựng dùng để ghép một bộ định dạng phức tạp từ nhiều phần** khi một bộ định dạng có sẵn hoặc một chuỗi mẫu đơn giản chưa đủ, ví dụ khi cần phần tùy chọn, ký tự cố định đặc biệt hoặc nhiều quy tắc phân tích/định dạng kết hợp. Người mới chưa cần dùng nó cho trường hợp cơ bản; chỉ cần biết nó là công cụ xây `DateTimeFormatter`, không phải một kiểu thời gian mới.

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/uuuu");

LocalDate date = LocalDate.of(2026, 9, 27);
String text = date.format(formatter);
// 27/09/2026
```

Phân tích chuỗi theo chiều ngược lại:

```java
LocalDate parsed = LocalDate.parse("27/09/2026", formatter);
```

### Quy tắc định dạng thuộc về ranh giới dữ liệu

Một giá trị nghiệp vụ:

```java
LocalDate invoiceDate = LocalDate.of(2026, 9, 27);
```

có thể được hiển thị nhiều cách:

```text
27/09/2026
09/27/2026
2026-09-27
27 Sep 2026
```

Không nên đổi mô hình nghiệp vụ chỉ vì giao diện muốn định dạng khác. Định dạng thuộc về ranh giới hiển thị hoặc tuần tự hóa, không phải bản thân mô hình nghiệp vụ.

### Bộ định dạng có sẵn

Java cung cấp nhiều bộ định dạng chuẩn:

```java
LocalDate date = LocalDate.parse("2026-09-27", DateTimeFormatter.ISO_LOCAL_DATE);
Instant instant = Instant.parse("2026-09-27T10:15:30Z");
OffsetDateTime offset = OffsetDateTime.parse("2026-09-27T17:15:30+07:00");
```

Khi giao thức đã có chuẩn ISO phù hợp, bộ định dạng có sẵn thường an toàn và dễ hiểu hơn tự tạo mẫu tùy ý.

### Định dạng Instant theo ngày-giờ địa phương cần ngữ cảnh múi giờ

`Instant` chỉ biết mốc trên dòng thời gian. Nếu muốn hiển thị nó thành năm/tháng/ngày/giờ của một khu vực, bộ định dạng hoặc bước chuyển đổi phải có múi giờ:

```java
Instant instant = Instant.parse("2026-09-27T07:30:00Z");

DateTimeFormatter display = DateTimeFormatter
        .ofPattern("dd/MM/uuuu HH:mm")
        .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

String text = display.format(instant);
```

Nếu dùng mẫu tùy chỉnh cần các trường như năm hoặc giờ nhưng không cung cấp múi giờ cho một `Instant`, bộ định dạng không có đủ trường lịch cục bộ để tạo đầu ra tương ứng và thao tác có thể thất bại với `UnsupportedTemporalTypeException`.

Mô hình tư duy:

```text
Instant
→ biết "khi nào"

ZoneId
→ biết "nhìn từ đâu"

DateTimeFormatter
→ biết "viết thành văn bản thế nào"
```
