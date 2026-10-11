Because `LocalTime` contains no date, arithmetic that crosses midnight wraps within the 24-hour day.

```java
LocalTime late = LocalTime.of(23, 30);
LocalTime later = late.plusHours(2);

System.out.println(later); // 01:30
```

The result does not contain “tomorrow” because there is no calendar date to increment.

```java
LocalTime time = LocalTime.of(10, 15);

time.plusHours(24);    // 10:15
time.minusMinutes(30); // 09:45
```

### Pitfall: elapsed time across midnight

Suppose a shift starts at `22:00` and ends at `06:00`:

```java
LocalTime start = LocalTime.of(22, 0);
LocalTime end = LocalTime.of(6, 0);
```

Those two values do not tell you whether `06:00` is on the same date or the next date. If elapsed time matters, the model needs a date or an explicit scheduling rule.

```java
LocalDate workDate = LocalDate.of(2026, 9, 27);
LocalDateTime startDateTime = workDate.atTime(start);
LocalDateTime endDateTime = workDate.plusDays(1).atTime(end);

Duration duration = Duration.between(startDateTime, endDateTime);
```

Here `Duration` is only a preview of an “elapsed amount” once a date has been supplied. The `Duration / Period` chapter later explains what `Duration` is, how it differs from `Period`, and why `24 hours` is not always equivalent to `1 calendar day`.

If the shift is tied to a real region with DST, local date-time alone is still not enough for exact elapsed timeline time; the model then needs zone-aware values or instants.

Use `LocalTime` for wall-clock rules that intentionally do not point to the global timeline. When the question becomes “when did this really happen worldwide?”, add date and zone context.
