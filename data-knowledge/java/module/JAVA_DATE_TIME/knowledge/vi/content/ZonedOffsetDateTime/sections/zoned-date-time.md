`ZonedDateTime` mô hình hóa một ngày-giờ gắn với **một `ZoneId`**. Trong ứng dụng lập lịch, `ZoneId` thường là vùng có tên như `Asia/Ho_Chi_Minh` hoặc `Europe/Paris`, nhưng về mặt API nó cũng có thể là một múi giờ biểu diễn bằng độ lệch cố định.

```java
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
ZonedDateTime meeting = ZonedDateTime.of(2026, 10, 5, 9, 0, 0, 0, zone);
```

Về mặt khái niệm:

```text
Các trường LocalDateTime
        +
ZoneId
        ↓ phân giải bằng ZoneRules
ZoneOffset hợp lệ tại thời điểm đó
        ↓
ZonedDateTime
```

Một `ZonedDateTime` vì thế có thể trả cả:

```java
LocalDateTime local = meeting.toLocalDateTime();
ZoneId zoneId = meeting.getZone();
ZoneOffset offset = meeting.getOffset();
Instant instant = meeting.toInstant();
```

Đây là lựa chọn tự nhiên khi nghiệp vụ nói “09:00 tại Europe/Paris”, “17:00 tại America/New_York”, hoặc nói chung cần giữ ngữ cảnh múi giờ cùng ngày-giờ cục bộ. Khi `ZoneId` là theo vùng, giá trị còn có thể sử dụng quy tắc của vùng thay đổi theo thời gian.
