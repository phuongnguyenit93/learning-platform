`Period` biểu diễn lượng theo **năm, tháng, ngày**.

```java
Period oneMonth = Period.ofMonths(1);
Period oneYearTwoMonths = Period.of(1, 2, 0);
Period oneCalendarDay = Period.ofDays(1);
```

Nó phù hợp cho tuổi hoặc các quy tắc theo lịch:

```java
LocalDate start = LocalDate.of(2026, 1, 31);
LocalDate next = start.plus(Period.ofMonths(1));
// 2026-02-28
```

`Period.ofMonths(1)` không định nghĩa một số giây cố định vì tháng có độ dài khác nhau.

### Period không tự chuẩn hóa mọi đơn vị

```java
Period p = Period.of(0, 15, 0);
System.out.println(p);              // P15M
System.out.println(p.normalized()); // P1Y3M
```

`normalized()` có thể chuẩn hóa năm/tháng, nhưng ngày không thể đổi tổng quát sang tháng vì độ dài tháng thay đổi.
