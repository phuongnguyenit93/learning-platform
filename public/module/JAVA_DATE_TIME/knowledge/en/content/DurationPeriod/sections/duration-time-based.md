`Duration` represents a time-based amount, fundamentally in seconds plus nanoseconds.

```java
Duration thirtyMinutes = Duration.ofMinutes(30);
Duration twoHours = Duration.ofHours(2);
Duration oneDayAsTime = Duration.ofDays(1); // exactly 24 hours
```

Mental model:

```text
Duration.ofHours(24)
→ 86,400 seconds of elapsed timeline time
```

This is a natural fit for timeouts, latency, TTL, and elapsed time between timeline points.

```java
Instant start = Instant.parse("2026-10-05T02:00:00Z");
Instant end = Instant.parse("2026-10-05T03:30:00Z");

Duration elapsed = Duration.between(start, end);
System.out.println(elapsed.toMinutes()); // 90
```

A duration can be negative when the end precedes the start.
