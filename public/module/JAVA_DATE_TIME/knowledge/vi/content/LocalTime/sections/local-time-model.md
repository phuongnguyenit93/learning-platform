Ví dụ:

```java
LocalTime openingTime = LocalTime.of(8, 30);
LocalTime closingTime = LocalTime.of(21, 0);
```

`08:30` tự nó không trả lời được:

```text
ngày nào?
ở quốc gia nào?
Độ lệch UTC bao nhiêu?
đã xảy ra trên dòng thời gian chưa?
```

Đó không phải thiếu sót; đó chính là hợp đồng của `LocalTime`.

### Tại sao không tự gắn ngày giả?

Nếu quy tắc nghiệp vụ là “quán mở hằng ngày lúc 08:30”, việc tạo `LocalDateTime` với ngày giả như `1970-01-01T08:30` khiến ngày giả có nguy cơ bị tuần tự hóa hoặc so sánh như dữ liệu thật.

```text
Chỉ biết giờ trong ngày
        ↓
LocalTime
        ↓
khi cần một lịch cụ thể mới kết hợp với LocalDate
```

Kết hợp:

```java
LocalDate date = LocalDate.of(2026, 10, 5);
LocalTime time = LocalTime.of(9, 0);

LocalDateTime meeting = LocalDateTime.of(date, time);
// hoặc date.atTime(time)
```
