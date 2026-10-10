```java
LocalDateTime meeting = LocalDateTime.of(2026, 10, 5, 9, 0);
```

The value says:

```text
date = 2026-10-05
time = 09:00
```

It does **not** say:

```text
09:00 where?
what offset from UTC?
which instant on the global timeline?
```

You can build it by composing the previous two concepts:

```java
LocalDate date = LocalDate.of(2026, 10, 5);
LocalTime time = LocalTime.of(9, 0);

LocalDateTime a = LocalDateTime.of(date, time);
LocalDateTime b = date.atTime(time);
```

Arithmetic follows the same immutable value style:

```java
LocalDateTime rescheduled = meeting.plusDays(1).withHour(10);
```
