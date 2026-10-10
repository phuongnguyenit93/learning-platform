The main date-time value classes such as `LocalDate`, `LocalTime`, `LocalDateTime`, `Instant`, `ZonedDateTime`, `Duration`, and `Period` are designed as **immutable values**. Operations such as `plusDays` or `minusHours` do not mutate the original object.

```java
LocalDate original = LocalDate.of(2026, 10, 5);
LocalDate nextDay = original.plusDays(1);

System.out.println(original); // 2026-10-05
System.out.println(nextDay);  // 2026-10-06
```

This matters because date-time values often cross service and method boundaries. Shared mutable temporal objects would make it easy for one caller to change a value that another caller still assumes is stable.

### Value-based: compare values, not object identity

Many central `java.time` classes are designed as **value-based classes**. Application code should treat two objects carrying the same value as equivalent for the domain:

```java
LocalDate a = LocalDate.of(2026, 10, 5);
LocalDate b = LocalDate.of(2026, 10, 5);

boolean sameValue = a.equals(b); // true
```

Do not build logic around `a == b`, object identity, or using date-time instances as synchronization monitors. The API contract is about **value**, not a promised instance identity.

Immutability also lets the core value types be safely shared according to their thread-safe contracts, instead of requiring mutation control around the older mutable API style.

### Reading with/plus/minus methods

Use this mental model:

```text
withX(...)
→ produce a new value with one field replaced/adjusted

plusX(...)
→ produce a new value after addition

minusX(...)
→ produce a new value after subtraction
```

Example:

```java
LocalDateTime meeting = LocalDateTime.of(2026, 10, 5, 9, 0);

LocalDateTime moved = meeting
        .withHour(10)
        .plusDays(2);
```

`meeting` remains unchanged. A common beginner mistake is to ignore the returned value:

```java
meeting.plusDays(1); // the result is discarded
```
