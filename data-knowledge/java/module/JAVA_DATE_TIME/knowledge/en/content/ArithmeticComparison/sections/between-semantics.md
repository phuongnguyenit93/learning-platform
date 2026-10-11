There are several ways to ask “how far apart are A and B?”, and they answer different semantic questions.

### ChronoUnit.between

```java
LocalDate start = LocalDate.of(2026, 9, 1);
LocalDate end = LocalDate.of(2026, 9, 27);

long days = ChronoUnit.DAYS.between(start, end); // 26
```

`ChronoUnit` reports a count of complete units between compatible temporal values.

### Duration.between

```java
Instant a = Instant.parse("2026-09-27T10:00:00Z");
Instant b = Instant.parse("2026-09-27T11:30:00Z");

Duration elapsed = Duration.between(a, b);
```

This is appropriate for elapsed timeline time.

### Period.between

```java
LocalDate birth = LocalDate.of(1993, 7, 20);
LocalDate date = LocalDate.of(2026, 9, 27);

Period calendarDifference = Period.between(birth, date);
```

The result preserves calendar year/month/day components; it is not a total number of seconds.

### Whole-unit boundaries

Operations such as `ChronoUnit.HOURS.between` count whole units according to the supported temporal semantics. If the application needs fractional units, keep a higher-precision representation such as `Duration`/nanoseconds and apply the domain's rounding policy explicitly.

### Time ranges need explicit inclusive/exclusive boundaries

`java.time` does not impose one core `Interval` class on every application, so a domain normally defines its own range semantics. A very common convention is a **half-open interval**:

```text
[start, end)

start     → inclusive
end       → exclusive
```

For example, an event belongs to the range when:

```java
boolean inside = !event.isBefore(start) && event.isBefore(endExclusive);
```

This convention is especially useful for “all events on one date” queries because it avoids inventing a value such as `23:59:59.999999999`:

```java
LocalDate day = LocalDate.of(2026, 9, 27);
ZoneId zone = ZoneId.of("Europe/Paris");

Instant start = day.atStartOfDay(zone).toInstant();
Instant endExclusive = day.plusDays(1).atStartOfDay(zone).toInstant();
```

`LocalDate.atStartOfDay(zone)` does not blindly force `00:00`. Java uses the zone rules to find the start-of-day result: if the beginning of the local day falls in a gap, the result moves to the first valid time after that gap; in an extreme transition that skips the entire local date, the resulting local date-time can even fall on the following date. That makes `[startOfDay, startOfNextDay)` safer than manually constructing `00:00`/`23:59:59...` when the domain asks for a region's calendar day.
