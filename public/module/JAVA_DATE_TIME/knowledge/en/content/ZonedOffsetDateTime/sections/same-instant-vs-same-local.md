Two zoned values can show different wall-clock times while representing the same instant:

```java
ZonedDateTime vietnam = ZonedDateTime.of(
        2026, 10, 5, 9, 0, 0, 0,
        ZoneId.of("Asia/Ho_Chi_Minh")
);

ZonedDateTime parisSameInstant = vietnam.withZoneSameInstant(
        ZoneId.of("Europe/Paris")
);

vietnam.toInstant().equals(parisSameInstant.toInstant()); // true
```

Conversely, two values can preserve the same local clock reading:

```text
09:00 Vietnam
09:00 Paris
```

while referring to different instants.

```text
same instant
→ preserve timeline position
→ wall-clock fields change when zone changes

same local
→ preserve calendar/clock fields
→ timeline position may change
```

That distinction is why a request to “convert the zone” must specify what should be preserved.
