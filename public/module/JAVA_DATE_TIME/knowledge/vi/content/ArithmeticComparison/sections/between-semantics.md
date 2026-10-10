Có nhiều cách hỏi “khoảng cách giữa A và B”, và chúng không hoàn toàn giống nhau.

### ChronoUnit.between

```java
LocalDate start = LocalDate.of(2026, 9, 1);
LocalDate end = LocalDate.of(2026, 9, 27);

long days = ChronoUnit.DAYS.between(start, end); // 26
```

`ChronoUnit` trả một số lượng đơn vị hoàn chỉnh giữa hai giá trị thời gian phù hợp.

### Duration.between

```java
Instant a = Instant.parse("2026-09-27T10:00:00Z");
Instant b = Instant.parse("2026-09-27T11:30:00Z");

Duration elapsed = Duration.between(a, b);
```

Phù hợp khi cần thời lượng thực đã trôi qua trên dòng thời gian.

### Period.between

```java
LocalDate birth = LocalDate.of(1993, 7, 20);
LocalDate date = LocalDate.of(2026, 9, 27);

Period calendarDifference = Period.between(birth, date);
```

Kết quả giữ các thành phần năm/tháng/ngày theo lịch; nó không phải tổng số giây.

### Cách between đếm các đơn vị hoàn chỉnh

Khi dùng `ChronoUnit.HOURS.between`, kết quả là số đơn vị giờ hoàn chỉnh theo ý nghĩa của giá trị thời gian đó. Nếu ứng dụng cần phần lẻ của đơn vị, hãy giữ `Duration` hoặc nano giây rồi tính theo yêu cầu thay vì giả định `between` trả số thập phân.

### Khoảng thời gian cần định nghĩa rõ biên bao gồm và không bao gồm

`java.time` không có một lớp lõi tên `Interval` bắt buộc mọi ứng dụng phải dùng, nên nghiệp vụ thường tự định nghĩa ý nghĩa cho một khoảng thời gian. Một quy ước rất phổ biến là **khoảng nửa mở (half-open interval)**:

```text
[start, end)

start     → bao gồm đầu mút
end       → không bao gồm đầu mút
```

Ví dụ một sự kiện thuộc khoảng khi:

```java
boolean inside = !event.isBefore(start) && event.isBefore(endExclusive);
```

Quy ước này đặc biệt hữu ích cho truy vấn “toàn bộ sự kiện trong một ngày” vì tránh phải tự tạo giá trị kiểu `23:59:59.999999999`:

```java
LocalDate day = LocalDate.of(2026, 9, 27);
ZoneId zone = ZoneId.of("Europe/Paris");

Instant start = day.atStartOfDay(zone).toInstant();
Instant endExclusive = day.plusDays(1).atStartOfDay(zone).toInstant();
```

`LocalDate.atStartOfDay(zone)` không đơn giản là luôn ép `00:00`. Java dùng quy tắc múi giờ để tìm thời điểm bắt đầu hợp lệ: nếu đầu ngày rơi vào khoảng trống, kết quả được đẩy tới thời điểm ngay sau khoảng trống; trong trường hợp cực đoan cả ngày cục bộ bị bỏ qua, ngày-giờ kết quả thậm chí có thể thuộc ngày kế tiếp. Vì vậy `[startOfDay, startOfNextDay)` an toàn hơn tự ghép `00:00`/`23:59:59...` khi nghiệp vụ thực sự hỏi theo ngày của một vùng.
