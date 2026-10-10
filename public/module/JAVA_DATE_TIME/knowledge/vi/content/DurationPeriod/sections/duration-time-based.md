`Duration` biểu diễn lượng thời gian theo giây và nano giây.

```java
Duration thirtyMinutes = Duration.ofMinutes(30);
Duration twoHours = Duration.ofHours(2);
Duration oneDayAsTime = Duration.ofDays(1); // 24 giờ
```

Tư duy:

```text
Duration.ofHours(24)
→ 86.400 giây thời lượng đã trôi qua
```

Nó phù hợp cho thời gian chờ (timeout), thời lượng đã trôi qua, độ trễ (latency), TTL hoặc khoảng cách giữa hai mốc trên dòng thời gian.

```java
Instant start = Instant.parse("2026-10-05T02:00:00Z");
Instant end = Instant.parse("2026-10-05T03:30:00Z");

Duration elapsed = Duration.between(start, end);
System.out.println(elapsed.toMinutes()); // 90
```

`Duration` có thể âm nếu điểm kết thúc nằm trước điểm bắt đầu.
