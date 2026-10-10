### What does “date-time” mean in software?

At the simplest level, **date-time is the family of concepts and APIs used to model calendar dates, wall-clock times, timeline points, time zones, and amounts of time in a program**.

It is much broader than asking “what time is it?” An application may need to answer different questions:

```text
Which calendar date?
→ calendar date

What time of day?
→ wall-clock time

Exactly when did an event occur on the global timeline?
→ instant

Which regional rules give meaning to this local clock reading?
→ time zone

How much time separates two values?
→ duration / period

How does a temporal object cross a text boundary?
→ formatting / parsing
```

Because those questions have different semantics, Java does not force all of them into one universal class.

### What is `java.time`, and why does Java need it?

`java.time` is **Java's modern Date-Time API**, available since Java 8 and used by modern code to represent dates, times, instants, durations, and time-zone concepts.

Java already had older APIs such as `java.util.Date` and `Calendar`. They still exist for compatibility, but they have design characteristics that are harder to use safely in modern code: their types do not express domain meaning as clearly as `LocalDate`/`Instant`, much of the old API is mutable, and calendar/time-zone behavior can easily depend on hidden state or defaults.

`java.time` improves that model by separating responsibilities:

```text
Different temporal meanings
→ different explicit types

Core date-time values
→ immutable

Zone / offset
→ explicit models instead of hidden assumptions

Formatting / parsing
→ separate reusable API

"now"
→ Clock can make the current-time source an explicit dependency
```

In one sentence:

> **The role of `java.time` is to let code preserve the temporal meaning the domain actually owns, then provide standard operations to create, convert, calculate, compare, format, and parse those values.**

### What are the major parts of the Date-Time API?

Do not memorize every class first. Group them by **role**:

```text
1. Local calendar / wall-clock values
   ├── LocalDate
   ├── LocalTime
   └── LocalDateTime

2. Global timeline
   └── Instant

3. Zone / offset
   ├── ZoneId
   ├── ZoneOffset
   ├── ZonedDateTime
   ├── OffsetDateTime
   └── OffsetTime

4. Amount of time
   ├── Duration
   └── Period

5. Smaller calendar concepts
   ├── Year
   ├── YearMonth
   ├── MonthDay
   ├── Month
   └── DayOfWeek

6. Text boundary
   └── DateTimeFormatter / DateTimeFormatterBuilder

7. Current-time source
   └── Clock

8. Supporting abstractions
   ├── Temporal / TemporalAccessor
   ├── TemporalAmount / TemporalUnit
   ├── ChronoUnit
   ├── TemporalAdjuster / TemporalAdjusters
   └── ZoneRules
```

The supporting abstractions in group 8 give different temporal classes a shared vocabulary. A beginner **does not need to learn them before the main value types**; knowing that they exist is enough to make Javadoc signatures such as `plus(TemporalAmount)` or `get(TemporalField)` less mysterious.

Read the abstractions at a high level like this:

| Abstraction | Beginner role |
| --- | --- |
| `TemporalAccessor` | an object from which supported temporal fields can be **read** |
| `Temporal` | a temporal object with shared `with`, `plus`, `minus`, and `until` vocabulary |
| `TemporalField` / `ChronoField` | describes **which field** is being queried, such as day-of-month or hour-of-day |
| `TemporalUnit` / `ChronoUnit` | describes **which unit**, such as DAYS, HOURS, or MONTHS |
| `TemporalAmount` | a **structured amount**, typically `Duration` or `Period` |
| `TemporalAdjuster` | a strategy/object that knows how to adjust a temporal value |
| `TemporalAdjusters` | utility supplying common adjusters such as last-day-of-month |
| `TemporalQuery` | a strategy for querying/extracting information from a temporal object |

These are **shared API vocabulary**, not eight new kinds of time. Learn `LocalDate`, `Instant`, zones, `Duration`, and the other value types first; the abstractions become useful as they reappear in method signatures.

The packages are also separated by responsibility:

```text
java.time
→ core types

java.time.format
→ formatting / parsing

java.time.temporal
→ shared fields, units, queries, adjusters, and abstractions

java.time.zone
→ zone rules and transitions

java.time.chrono
→ calendar systems other than ISO; an advanced boundary, not this module's main path
```

### ISO-8601 and UTC — read the notation before reading the code

**ISO-8601** is the international standard that defines a common vocabulary for representing dates and times. Main types such as `LocalDate`, `LocalTime`, and `LocalDateTime` use the ISO calendar model, and many default `java.time` formatters use ISO-8601 text forms.

You will repeatedly see text such as:

```text
2026-10-05
→ date

09:30:15
→ time

2026-10-05T09:30:15
→ T separates the date and time parts

2026-10-05T02:30:15Z
→ Z means offset +00:00, or UTC

2026-10-05T09:30:15+07:00
→ local date-time + offset +07:00

2026-10-05T09:30:15+07:00[Asia/Ho_Chi_Minh]
→ local fields + resolved offset + named ZoneId
```

**UTC (Coordinated Universal Time)** is the global reference against which offsets are expressed. UTC is not “everyone's local time”; it is a common reference that lets systems talk about one shared timeline.

Here a **timeline** can be understood as a conceptual ordered line of moments from earlier to later; an `Instant` identifies one position on that line.

`LocalDate`, `LocalDateTime`, and the corresponding `Local*` concrete types are **ISO calendar types**; they are not objects whose calendar system can be switched by configuration. In advanced API vocabulary, **chronology** means the calendar system/rules being used. Applications that genuinely need a non-ISO calendar system use separate types/abstractions from `java.time.chrono`, such as `ChronoLocalDate`. Changing a display `Locale` also does not transform a `LocalDate` into another chronology.

### Common java.time exceptions

A beginner will see several exceptions repeatedly in this module:

```text
DateTimeException
→ base runtime exception for many date-time failures

DateTimeParseException
→ text parsing failed
→ a DateTimeException

UnsupportedTemporalTypeException
→ a temporal type does not support the requested field/unit
→ also a DateTimeException
```

For example, `LocalDate.of(2026, 2, 30)` can throw `DateTimeException`; malformed temporal text can produce `DateTimeParseException`; requesting `HOURS` from `LocalDate` can lead to `UnsupportedTemporalTypeException`.

### CONCEPT — “time” is not one thing

Modern Java's `java.time` API intentionally does not use one universal class for every time concept. Different types preserve different **domain meanings**.

```text
LocalDate
→ calendar date
→ 2026-10-05

LocalTime
→ time of day
→ 09:00

LocalDateTime
→ local date + local time
→ 2026-10-05T09:00
→ still no location on Earth

Instant
→ precise point on the UTC timeline

ZoneOffset
→ one concrete difference from UTC, such as +07:00

ZoneId
→ a named region whose rules can select offsets over time

ZonedDateTime
→ local date-time combined with a ZoneId

OffsetDateTime
→ local date-time combined with a concrete offset
```

Each type deliberately **does not know** some information.

For example:

```java
LocalDate birthday = LocalDate.of(1993, 7, 20);
```

A birthday normally does not need an hour, a UTC offset, or a zone. Adding those values would invent information the domain does not own.

By contrast:

```java
Instant receivedAt = Instant.now();
```

An audit event often needs the exact point when something happened, so a timeline-oriented `Instant` is a better model than a zone-less `LocalDateTime`.

### WHY — what goes wrong with one generic timestamp idea?

Consider this value:

```text
2026-11-01 01:30
```

It is not enough to identify one global instant. It does not say whether that clock reading belongs to Vietnam, New York, London, or somewhere else. In regions with daylight saving time, some local clock readings can even occur twice during an overlap.

The opposite shortcut is also dangerous: converting every human calendar value into epoch milliseconds. That loses the natural meaning of data such as:

```text
birthday 20/07
opening time 08:30
last calendar day of the month
```

Those values are primarily **calendar/wall-clock concepts**, not “milliseconds since an epoch.”

The `java.time` design therefore separates semantic domains rather than forcing everything into one mutable timestamp type.

### Human calendar time and the machine timeline

A useful first split is:

```text
Human-facing calendar / wall clock
├── LocalDate
├── LocalTime
└── LocalDateTime

Global machine timeline
└── Instant

Bridges between the two sides
├── ZoneId / ZoneRules
├── ZoneOffset
├── ZonedDateTime
└── OffsetDateTime
```

For one meeting:

```java
LocalDateTime localMeeting = LocalDateTime.of(2026, 10, 5, 9, 0);
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
ZonedDateTime scheduled = localMeeting.atZone(zone);
Instant globalPoint = scheduled.toInstant();
```

Read that flow as:

```text
User says: 09:00 on 2026-10-05
        ↓
LocalDateTime
        ↓ add place/rules
ZoneId
        ↓
ZonedDateTime
        ↓ project onto the common timeline
Instant
```

That relationship is the backbone of the module.
