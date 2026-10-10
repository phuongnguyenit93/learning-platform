Các kiểu `java.time` thường cung cấp thao tác dạng:

```java
value.plusDays(1);
value.minusHours(2);
value.plus(amount);
value.minus(amount);
```

Nhưng ý nghĩa khác nhau theo kiểu.

### LocalDate

```java
LocalDate invoiceDate = LocalDate.of(2026, 1, 31);
LocalDate nextMonth = invoiceDate.plusMonths(1);
// 2026-02-28
```

Đây là phép toán theo lịch.

### Instant

```java
Instant deadline = Instant.parse("2026-09-27T10:00:00Z");
Instant extended = deadline.plus(Duration.ofMinutes(30));
```

Đây là phép toán theo dòng thời gian.

### ZonedDateTime

`ZonedDateTime` có cả các trường lịch cục bộ và ngữ cảnh dòng thời gian, vì vậy cần phân biệt:

```java
zoned.plusDays(1);                // theo ngày lịch / giờ cục bộ
zoned.plus(Duration.ofHours(24)); // theo thời lượng thực trên dòng thời gian
```

Quanh thời điểm chuyển DST, hai thao tác có thể không dẫn tới cùng giờ cục bộ hoặc cùng số giây thực tế đã trôi qua.

### TemporalAmount và TemporalUnit

Khi nhìn Javadoc, người mới rất dễ gặp hai overload kiểu:

```java
temporal.plus(amount);
temporal.plus(number, unit);
```

Hai overload này dẫn tới hai giao diện dùng chung khác nhau:

- `TemporalAmount` là **một lượng thời gian đã có cấu trúc**, ví dụ `Period.ofMonths(2)` hoặc `Duration.ofMinutes(30)`;
- `TemporalUnit` là **đơn vị dùng để diễn giải một con số**, ví dụ DAYS, HOURS, MONTHS;
- `ChronoUnit` là enum triển khai chuẩn của `TemporalUnit`, cung cấp những đơn vị quen thuộc như `NANOS`, `SECONDS`, `MINUTES`, `HOURS`, `DAYS`, `WEEKS`, `MONTHS`, `YEARS`.

Mô hình tư duy:

```text
TemporalAmount
→ "cộng lượng này"
→ Period / Duration

TemporalUnit
→ "con số này đang tính theo đơn vị gì?"

ChronoUnit
→ bộ TemporalUnit chuẩn mà Java cung cấp
```

Quan hệ kiểu:

```text
TemporalAmount
├── Duration
└── Period

TemporalUnit
└── ChronoUnit
```

Ví dụ hai cách viết tương đương về ý định:

```java
LocalDate date = LocalDate.of(2026, 9, 27);

LocalDate byAmount = date.plus(Period.ofWeeks(2));
LocalDate byUnit = date.plus(2, ChronoUnit.WEEKS);
```

Tại sao Java cần các giao diện dùng chung này? Vì nhiều kiểu thời gian có thể chia sẻ từ vựng `plus`, `minus`, `between`, trường và đơn vị mà không cần mỗi lớp phát minh một giao diện hoàn toàn khác.

Nhưng việc dùng giao diện chung **không có nghĩa mọi đơn vị đều hợp lệ cho mọi kiểu**. `LocalDate` không có trường giờ trong ngày nên không hỗ trợ `HOURS`; `Instant` không mang ý nghĩa tháng theo lịch nên không hỗ trợ trực tiếp `MONTHS`. Khi thao tác hoặc đơn vị không được kiểu hỗ trợ, API có thể ném `UnsupportedTemporalTypeException`.
