`LocalDate` is a good fit when the business fact is a date on the calendar.

```java
LocalDate birthday = LocalDate.of(1993, 7, 20);
LocalDate invoiceDate = LocalDate.of(2026, 9, 27);
```

These values contain fields such as year, month, and day-of-month. They do not contain an hour, `ZoneId`, or `ZoneOffset`.

### Why not use LocalDateTime everywhere?

It is possible to invent midnight:

```java
LocalDateTime birthday = LocalDateTime.of(1993, 7, 20, 0, 0);
```

But the model now claims something the domain never said: “the birthday occurs at midnight.” That invented field can later leak into serialization, database queries, or zone conversion.

Prefer:

```text
Domain owns only a date
        ↓
LocalDate
        ↓
add time/zone only when a real use case requires them
```

### Creating and reading LocalDate values

```java
LocalDate explicit = LocalDate.of(2026, 9, 27);
LocalDate parsed = LocalDate.parse("2026-09-27");
LocalDate today = LocalDate.now();
```

`LocalDate.now()` depends on a clock and zone from the environment. Later, the `Clock` chapter will show how to avoid scattering hidden time dependencies throughout business logic.

```java
int year = explicit.getYear();
Month month = explicit.getMonth();
int monthValue = explicit.getMonthValue();
int day = explicit.getDayOfMonth();
DayOfWeek dayOfWeek = explicit.getDayOfWeek();
```
