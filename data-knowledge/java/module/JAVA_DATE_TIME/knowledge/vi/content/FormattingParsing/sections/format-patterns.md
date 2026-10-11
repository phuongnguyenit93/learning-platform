Mẫu tùy chỉnh hữu ích khi định dạng là yêu cầu thật của giao diện hoặc tệp cũ:

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-uuuu HH:mm");
LocalDateTime value = LocalDateTime.of(2026, 9, 27, 14, 30);

String text = formatter.format(value);
// 27-09-2026 14:30
```

Nhưng ký tự mẫu có ý nghĩa riêng; không nên đoán bằng trực giác.

Ví dụ quan trọng:

```text
MM → tháng trong năm
mm → phút trong giờ

HH → giờ trong ngày 00-23
hh → giờ theo AM/PM 01-12

uuuu → năm liên tục qua các kỷ nguyên (proleptic year)
yyyy → năm trong kỷ nguyên (year-of-era)
YYYY → năm theo tuần (week-based-year)
```

Việc nhầm `MM` và `mm`, hoặc `yyyy` với `YYYY`, là lỗi rất phổ biến.

### `uuuu` và `yyyy`

Trong nhiều bài toán ngày tháng hiện đại, `uuuu` thường dễ dùng hơn khi cần phân tích ISO chặt chẽ vì nó là **năm liên tục qua các kỷ nguyên (proleptic year)**: năm được đánh số liên tục xuyên qua các kỷ nguyên, có cả năm `0` và năm âm khi đi lùi trước kỷ nguyên hiện tại.

`yyyy` là **năm trong kỷ nguyên (year-of-era)**: số năm nằm bên trong một kỷ nguyên như CE/BCE, nên để diễn giải đầy đủ còn cần ngữ cảnh kỷ nguyên.

`YYYY` lại là **năm theo tuần (week-based-year)**: năm được xác định theo quy tắc tuần, không phải năm dương lịch thông thường. Quanh cuối hoặc đầu năm, một ngày như `2025-12-29` có thể thuộc năm theo tuần khác năm dương lịch tùy quy tắc tuần. Vì vậy đừng dùng `YYYY-MM-dd` khi ý định thật sự là ngày theo lịch.

```java
DateTimeFormatter strictDate = DateTimeFormatter
        .ofPattern("dd/MM/uuuu")
        .withResolverStyle(ResolverStyle.STRICT);
```

Không cần biến quy tắc này thành “luôn luôn cấm yyyy”; điều cần học là **ký tự mẫu mang ý nghĩa**, không chỉ quyết định hình dạng đầu ra.

### Locale ảnh hưởng văn bản hiển thị

Mẫu có tên tháng hoặc tên thứ cần `Locale` rõ ràng:

```java
DateTimeFormatter english = DateTimeFormatter.ofPattern("dd MMM uuuu", Locale.ENGLISH);
```

`Locale` ở đây là ngữ cảnh ngôn ngữ/khu vực dùng cho **hiển thị**, ví dụ tên tháng, tên thứ hoặc quy ước văn bản. Nó không thay thế `ZoneId` và không quyết định `Instant`. Phần bản địa hóa chuyên sâu thuộc mô-đun `localization`; ở đây chỉ cần biết bộ định dạng có thể phụ thuộc `Locale` và không nên vô tình dùng giá trị mặc định của máy khi hợp đồng đầu ra phải ổn định.
