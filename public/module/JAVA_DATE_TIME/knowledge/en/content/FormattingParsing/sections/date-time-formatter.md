`DateTimeFormatter` is the main formatter/parser type in `java.time`. It is immutable and thread-safe, so a formatter can be reused instead of recreated for every request.

`DateTimeFormatterBuilder` is **a builder for composing a more complex formatter from several pieces** when a predefined formatter or one simple pattern string is not enough, for example when optional sections, special literals, or combined parsing/formatting rules are required. Beginners do not need it for ordinary cases; the important point is that it builds a `DateTimeFormatter` rather than representing another kind of time.

```java
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/uuuu");

LocalDate date = LocalDate.of(2026, 9, 27);
String text = date.format(formatter);
// 27/09/2026
```

Parsing runs in the opposite direction:

```java
LocalDate parsed = LocalDate.parse("27/09/2026", formatter);
```

### Formatter as boundary policy

One domain value:

```java
LocalDate invoiceDate = LocalDate.of(2026, 9, 27);
```

can be rendered many ways:

```text
27/09/2026
09/27/2026
2026-09-27
27 Sep 2026
```

The domain model should not change merely because a UI wants another layout. Formatting belongs at presentation or serialization boundaries.

### Predefined formatters

Java provides standard formatter contracts:

```java
LocalDate date = LocalDate.parse("2026-09-27", DateTimeFormatter.ISO_LOCAL_DATE);
Instant instant = Instant.parse("2026-09-27T10:15:30Z");
OffsetDateTime offset = OffsetDateTime.parse("2026-09-27T17:15:30+07:00");
```

When a protocol already follows an ISO representation, predefined formatters are usually easier to reason about than inventing custom patterns.

### Formatting an Instant needs local context when the output contains calendar fields

`Instant` knows only the timeline point. To render year/month/day/hour fields for a region, the formatter or conversion step must have a zone:

```java
Instant instant = Instant.parse("2026-09-27T07:30:00Z");

DateTimeFormatter display = DateTimeFormatter
        .ofPattern("dd/MM/uuuu HH:mm")
        .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

String text = display.format(instant);
```

If a custom pattern asks for fields such as year or hour while formatting an `Instant` without supplying a zone, there are not enough local calendar fields to satisfy the pattern and the operation can fail with `UnsupportedTemporalTypeException`.

```text
Instant
→ knows "when"

ZoneId
→ knows "viewed from where"

DateTimeFormatter
→ knows "how to write it as text"
```
