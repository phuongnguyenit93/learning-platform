### Date ↔ Instant

`Date` và `Instant` đều có thể biểu diễn mốc trên dòng thời gian, nên chuyển đổi tương đối trực tiếp:

```java
Date legacy = new Date();
Instant instant = legacy.toInstant();

Date back = Date.from(instant);
```

Đây thường là ranh giới tốt: chuyển đổi sang kiểu hiện đại sớm, xử lý bằng `java.time`, rồi chỉ chuyển đổi lại nếu API cũ bắt buộc.

### Calendar → ZonedDateTime

```java
Calendar calendar = Calendar.getInstance();

ZonedDateTime modern = calendar.toInstant()
        .atZone(calendar.getTimeZone().toZoneId());
```

Ở đây cần cả mốc trên dòng thời gian và múi giờ của `Calendar` để giữ cách diễn giải cục bộ phù hợp.

### `java.sql.Date`, `Time`, `Timestamp`

**JDBC (Java Database Connectivity)** là API Java dùng để làm việc với cơ sở dữ liệu quan hệ. Mã JDBC cũ thường cung cấp ba kiểu bọc `java.sql.*` rất dễ bị nhầm với `java.time`:

```text
java.sql.Date
→ giá trị kiểu SQL DATE
→ kiểu java.time tương ứng tự nhiên: LocalDate

java.sql.Time
→ giá trị kiểu SQL TIME
→ kiểu java.time tương ứng tự nhiên: LocalTime

java.sql.Timestamp
→ kiểu bọc SQL TIMESTAMP có phần giây lẻ
→ có API chuyển đổi với LocalDateTime và Instant
```

Java cung cấp chuyển đổi trực tiếp:

Trong đoạn mã dưới, `sqlDate`, `sqlTime` và `timestamp` được giả sử là **các giá trị JDBC cũ đã được API hoặc tầng cơ sở dữ liệu cung cấp**; mục tiêu của đoạn mã chỉ là minh họa bước chuyển đổi sang `java.time` và ngược lại.

```java
LocalDate date = sqlDate.toLocalDate();
java.sql.Date sqlDateAgain = java.sql.Date.valueOf(date);

LocalTime time = sqlTime.toLocalTime();
java.sql.Time sqlTimeAgain = java.sql.Time.valueOf(time);

LocalDateTime localDateTime = timestamp.toLocalDateTime();
java.sql.Timestamp timestampFromLocal = java.sql.Timestamp.valueOf(localDateTime);

Instant instant = timestamp.toInstant();
java.sql.Timestamp timestampFromInstant = java.sql.Timestamp.from(instant);
```

Nhưng các chuyển đổi cũ này **không hoàn toàn đối xứng** và có vài bẫy quan trọng:

```text
java.sql.Date.toInstant()
→ không được hỗ trợ, ném UnsupportedOperationException

java.sql.Time.toInstant()
→ không được hỗ trợ, ném UnsupportedOperationException

java.sql.Time.valueOf(LocalTime)
→ chỉ giữ giờ/phút/giây
→ phần nanosecond của LocalTime bị mất

Timestamp.from(Instant) / timestamp.toInstant()
→ chuyển đổi theo dòng thời gian

Timestamp.valueOf(LocalDateTime) / timestamp.toLocalDateTime()
→ diễn giải ngày-giờ cục bộ của Timestamp cũ
→ có thể phụ thuộc múi giờ mặc định khi ánh xạ giá trị mili giây cũ ↔ các trường cục bộ
```

Vì vậy nếu nghiệp vụ sở hữu một `Instant`, ưu tiên ranh giới `Timestamp ↔ Instant`; nếu lược đồ thật sự mang ý nghĩa ngày-giờ cục bộ thì dùng `Timestamp ↔ LocalDateTime` có chủ đích và kiểm soát các giả định về múi giờ mặc định trong tầng JDBC/cơ sở dữ liệu.

Đừng vì cả `Timestamp` và `Instant` đều có thể liên quan dòng thời gian mà mặc định mọi cột `TIMESTAMP` trong cơ sở dữ liệu đều có cùng ý nghĩa. Ý nghĩa của kiểu SQL, cách xử lý múi giờ và độ chính xác còn phụ thuộc cơ sở dữ liệu, lược đồ và trình điều khiển. Ranh giới cơ sở dữ liệu phải được thiết kế rõ thay vì suy từ tên Java lớp.

### JDBC hiện đại có thể làm việc trực tiếp với java.time

Từ JDBC 4.2, nhiều kiểu `java.time` có ánh xạ chuẩn trực tiếp qua `setObject` / `getObject`, nên mã mới **không bắt buộc phải đi vòng qua `java.sql.Date/Time/Timestamp`** chỉ để truy cập cơ sở dữ liệu.

Ví dụ ở trình điều khiển/cơ sở dữ liệu hỗ trợ ánh xạ tương ứng:

Trong đoạn mã này, `preparedStatement` là một `PreparedStatement` đã được ứng dụng tạo để gửi tham số xuống cơ sở dữ liệu, còn `resultSet` là `ResultSet` nhận từ truy vấn. Chúng là các đối tượng tại ranh giới JDBC, không phải kiểu ngày-giờ.

```java
LocalDate invoiceDate = LocalDate.of(2026, 9, 27);
preparedStatement.setObject(1, invoiceDate);

LocalDate loadedDate = resultSet.getObject("invoice_date", LocalDate.class);

OffsetDateTime occurredAt = OffsetDateTime.parse("2026-09-27T17:30:00+07:00");
preparedStatement.setObject(2, occurredAt);

OffsetDateTime loadedOccurredAt = resultSet.getObject(
        "occurred_at",
        OffsetDateTime.class
);
```

`LocalDate`, `LocalTime`, `LocalDateTime`, `OffsetTime` và `OffsetDateTime` có ánh xạ JDBC 4.2 chuẩn. Tuy nhiên kiểu cơ sở dữ liệu thực tế, khả năng của trình điều khiển và ý nghĩa múi giờ vẫn phải được kiểm tra theo lược đồ/nhà cung cấp. Đặc biệt, đừng suy rằng mọi trình điều khiển đều ánh xạ trực tiếp `Instant` giống nhau chỉ vì ứng dụng dùng `Instant` trong nghiệp vụ.

### Không chuyển đổi qua chuỗi nếu có API trực tiếp

Cách chuyển đổi không cần thiết:

```text
Date → định dạng thành String → phân tích thành LocalDateTime
```

Nó đưa định dạng/`Locale`/múi giờ mặc định vào giữa một chuyển đổi có thể làm trực tiếp và an toàn hơn.
