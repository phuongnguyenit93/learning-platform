`ZonedDateTime` represents a date-time associated with **a `ZoneId`**. In application scheduling that `ZoneId` is often a named region such as `Asia/Ho_Chi_Minh` or `Europe/Paris`, but the API can also use a fixed-offset zone.

```java
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
ZonedDateTime meeting = ZonedDateTime.of(2026, 10, 5, 9, 0, 0, 0, zone);
```

Conceptually:

```text
LocalDateTime fields
        +
ZoneId
        ↓ resolve through ZoneRules
valid ZoneOffset for that context
        ↓
ZonedDateTime
```

A `ZonedDateTime` can expose all of these views:

```java
LocalDateTime local = meeting.toLocalDateTime();
ZoneId zoneId = meeting.getZone();
ZoneOffset offset = meeting.getOffset();
Instant instant = meeting.toInstant();
```

It is a natural fit when the domain says “09:00 in Europe/Paris” or otherwise needs to preserve zone context together with local calendar fields. When the `ZoneId` is region-based, the value can also use rules that vary over time.
