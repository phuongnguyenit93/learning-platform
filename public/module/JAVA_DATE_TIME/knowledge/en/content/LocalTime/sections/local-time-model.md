```java
LocalTime openingTime = LocalTime.of(8, 30);
LocalTime closingTime = LocalTime.of(21, 0);
```

The value `08:30` by itself does not answer:

```text
which date?
which country or region?
what UTC offset?
has this happened on the timeline yet?
```

That is not missing functionality; it is the contract of `LocalTime`.

### Why not invent a date?

If the business rule is “open every day at 08:30,” creating a `LocalDateTime` with a fake date such as `1970-01-01T08:30` mixes invented data with real data and can later leak that fake date into serialization or comparisons.

```text
Only time-of-day is known
        ↓
LocalTime
        ↓
combine with LocalDate only when a real schedule needs a date
```

```java
LocalDate date = LocalDate.of(2026, 10, 5);
LocalTime time = LocalTime.of(9, 0);

LocalDateTime meeting = LocalDateTime.of(date, time);
// or date.atTime(time)
```
