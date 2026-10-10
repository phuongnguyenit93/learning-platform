`LocalDate` always represents a valid date in its calendar model. Java does not keep an impossible value such as “February 30.”

```java
LocalDate.of(2026, 2, 30); // DateTimeException
```

### Leap years

```java
LocalDate leapDay = LocalDate.of(2024, 2, 29);
boolean leap = leapDay.isLeapYear();
```

Creating `2025-02-29` fails because that date does not exist.

### Adding months at the end of a month

Consider:

```java
LocalDate january31 = LocalDate.of(2026, 1, 31);
LocalDate result = january31.plusMonths(1);
```

February 2026 has no day 31. `plusMonths` resolves the result to the last valid day of the target month, producing `2026-02-28`.

```text
2026-01-31
    + 1 calendar month
        ↓
target month = 2026-02
        ↓
day 31 is invalid
        ↓
use last valid day = 28
```

That behavior is fundamentally different from adding a fixed number of seconds.

### When is LocalDate the right type?

Use it when the value does not need to answer either of these questions:

```text
What time of day?
Which exact global instant?
```

Examples include birthdays, invoice dates, local expiry dates, and holidays. If the application starts asking “at what time?” or “in which zone?”, that is a signal to move to another temporal type instead of encoding conventions around `LocalDate`.
