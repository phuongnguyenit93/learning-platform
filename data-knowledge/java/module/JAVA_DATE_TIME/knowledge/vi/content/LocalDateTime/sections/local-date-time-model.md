Ví dụ:

```java
LocalDateTime meeting = LocalDateTime.of(2026, 10, 5, 9, 0);
```

Giá trị trên nói:

```text
ngày = 2026-10-05
giờ = 09:00
```

Nó **không nói**:

```text
09:00 ở đâu?
độ lệch so với UTC là bao nhiêu?
đó là `Instant` nào?
```

Có thể tạo bằng cách ghép hai khái niệm đã học:

```java
LocalDate date = LocalDate.of(2026, 10, 5);
LocalTime time = LocalTime.of(9, 0);

LocalDateTime a = LocalDateTime.of(date, time);
LocalDateTime b = date.atTime(time);
```

Các phép toán vẫn giữ tính bất biến:

```java
LocalDateTime rescheduled = meeting.plusDays(1).withHour(10);
```
