One way to represent timeline position is to count from an **epoch**. Java's `Instant` uses `1970-01-01T00:00:00Z` as its standard epoch origin.

```java
Instant epoch = Instant.EPOCH;
Instant fromSeconds = Instant.ofEpochSecond(1_000_000);
Instant fromMillis = Instant.ofEpochMilli(1_000_000);
```

You can read the value as epoch seconds plus a nanosecond fraction:

```java
long seconds = instant.getEpochSecond();
int nanos = instant.getNano();
long millis = instant.toEpochMilli();
```

`toEpochMilli()` converts to millisecond resolution and can discard precision finer than a millisecond.

`Instant` also has a very large supported range: from `Instant.MIN` around year `-1000000000` through `Instant.MAX` around year `+1000000000`. This is mostly a technical boundary; ordinary business applications operate far inside it.

### Raw epoch numbers need an explicit unit

A value such as:

```text
1728093600
```

does not tell you whether it means seconds, milliseconds, microseconds, or nanoseconds. Confusing those units can move a date by thousands of years. JSON, database, and messaging schemas should state the unit explicitly, or use a well-defined textual representation such as ISO-8601.

### Epoch representation does not remove the need for zones

An epoch value identifies an instant, but a user still needs a zone to see a local calendar representation:

```java
Instant stored = Instant.parse("2026-10-05T02:00:00Z");
ZoneId userZone = ZoneId.of("Asia/Ho_Chi_Minh");

LocalDateTime displayedLocal = LocalDateTime.ofInstant(stored, userZone);
```

Timeline storage and presentation-zone selection are separate responsibilities.
