`LocalTime` không chứa ngày, vì vậy phép toán vượt qua biên `24:00` sẽ **vòng lại trong phạm vi một ngày**.

```java
LocalTime late = LocalTime.of(23, 30);
LocalTime later = late.plusHours(2);

System.out.println(later); // 01:30
```

Không có thông tin “ngày mai” trong kết quả vì `LocalTime` không có ngày theo lịch để tăng.

Tương tự:

```java
LocalTime time = LocalTime.of(10, 15);

time.plusHours(24);   // 10:15
time.minusMinutes(30); // 09:45
```

### Bẫy khi tính khoảng thời gian qua nửa đêm

Giả sử ca làm bắt đầu `22:00` và kết thúc `06:00`:

```java
LocalTime start = LocalTime.of(22, 0);
LocalTime end = LocalTime.of(6, 0);
```

Chỉ hai `LocalTime` không đủ để biết `06:00` là sáng **cùng ngày** hay **ngày hôm sau**. Nếu nghiệp vụ cần thời lượng đã trôi qua chính xác, phải cung cấp ngày hoặc quy tắc rõ ràng.

Ví dụ với ngày:

```java
LocalDate workDate = LocalDate.of(2026, 9, 27);

LocalDateTime startDateTime = workDate.atTime(start);
LocalDateTime endDateTime = workDate.plusDays(1).atTime(end);

Duration duration = Duration.between(startDateTime, endDateTime);
```

Ở đây `Duration` chỉ được dùng để minh họa “lượng thời gian đã trôi qua” sau khi đã bổ sung ngày. `Duration` là gì, khác `Period` thế nào và vì sao `24 giờ` không luôn đồng nghĩa `1 ngày theo lịch` sẽ được giải thích đầy đủ ở chương `Duration / Period`.

Tuy nhiên nếu ca làm liên quan một vùng có DST, `LocalDateTime` vẫn chưa đủ cho thời lượng đã trôi qua tuyệt đối; lúc đó cần `ZoneId`/`ZonedDateTime` hoặc `Instant`.

### Khi nào LocalTime phù hợp?

Dùng `LocalTime` cho **quy tắc theo đồng hồ cục bộ** không tự nó chỉ tới dòng thời gian: giờ mở cửa, giờ hạn chót trong ngày, thời điểm bắt đầu một lịch lặp. Khi câu hỏi chuyển thành “sự kiện thật sự xảy ra lúc nào trên toàn cầu?”, `LocalTime` phải được kết hợp với ngày và múi giờ.
