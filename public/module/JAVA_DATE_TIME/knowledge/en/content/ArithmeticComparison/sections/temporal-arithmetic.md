Most `java.time` types provide operations such as:

```java
value.plusDays(1);
value.minusHours(2);
value.plus(amount);
value.minus(amount);
```

But their meaning follows the type.

### LocalDate

```java
LocalDate invoiceDate = LocalDate.of(2026, 1, 31);
LocalDate nextMonth = invoiceDate.plusMonths(1);
// 2026-02-28
```

This is calendar arithmetic.

### Instant

```java
Instant deadline = Instant.parse("2026-09-27T10:00:00Z");
Instant extended = deadline.plus(Duration.ofMinutes(30));
```

This is timeline arithmetic.

### ZonedDateTime

`ZonedDateTime` carries both local calendar fields and timeline context, so this distinction matters:

```java
zoned.plusDays(1);                 // date-based/local semantics
zoned.plus(Duration.ofHours(24)); // timeline-duration semantics
```

Around a DST transition, these operations may not produce the same local clock time or the same elapsed seconds.

### TemporalAmount and TemporalUnit

When reading Javadoc, a beginner will often encounter two overload shapes:

```java
temporal.plus(amount);
temporal.plus(number, unit);
```

They use different abstractions:

- `TemporalAmount` is **a structured amount of time**, such as `Period.ofMonths(2)` or `Duration.ofMinutes(30)`;
- `TemporalUnit` is **the unit that gives meaning to a numeric quantity**, such as DAYS, HOURS, or MONTHS;
- `ChronoUnit` is Java's standard enum implementation of `TemporalUnit`, providing familiar units such as `NANOS`, `SECONDS`, `MINUTES`, `HOURS`, `DAYS`, `WEEKS`, `MONTHS`, and `YEARS`.

Mental model:

```text
TemporalAmount
→ "add this amount"
→ Period / Duration

TemporalUnit
→ "which unit gives this number meaning?"

ChronoUnit
→ Java's standard set of TemporalUnit values
```

Type relationship:

```text
TemporalAmount
├── Duration
└── Period

TemporalUnit
└── ChronoUnit
```

Two styles can express the same intent:

```java
LocalDate date = LocalDate.of(2026, 9, 27);

LocalDate byAmount = date.plus(Period.ofWeeks(2));
LocalDate byUnit = date.plus(2, ChronoUnit.WEEKS);
```

Why does Java need these shared abstractions? They let different temporal types share vocabulary such as `plus`, `minus`, `between`, fields, and units instead of every class inventing a completely unrelated operation model.

Shared vocabulary does **not** mean every unit is valid for every type. `LocalDate` has no hour-of-day and therefore does not support `HOURS`; `Instant` has no calendar-month semantics and does not directly support `MONTHS`. Unsupported unit/type combinations can throw `UnsupportedTemporalTypeException`.
