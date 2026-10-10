### java.util.Date

The name `Date` is misleading to modern readers: `java.util.Date` is not a calendar-date type like `LocalDate`. It primarily represents a point in time using milliseconds from the epoch and comes from an older mutable API design.

```java
Date legacy = new Date();
```

Many calendar-style getters/setters on `Date` have long been deprecated. New application code should generally prefer `java.time` types whose semantics are explicit.

### Calendar

`Calendar` combines calendar fields, zone information, and mutable arithmetic:

```java
Calendar calendar = Calendar.getInstance();
calendar.add(Calendar.DAY_OF_MONTH, 1);
```

The operation mutates the object, unlike the immutable value model used by `java.time`.

Legacy types still appear at integration boundaries, but their presence does not make them the right default for new domain code.

### SimpleDateFormat — a mutable, non-thread-safe legacy formatter

Older code frequently contains `java.text.SimpleDateFormat`:

```java
SimpleDateFormat legacyFormatter = new SimpleDateFormat("dd/MM/yyyy");
```

Unlike `DateTimeFormatter`, `SimpleDateFormat` is **mutable and not thread-safe**. Sharing one global/static instance across multiple threads can therefore create race conditions and unpredictable parse/format results.

```text
SimpleDateFormat
→ legacy formatter
→ mutable
→ should not be shared across threads without appropriate synchronization

DateTimeFormatter
→ modern java.time formatter
→ immutable + thread-safe
```

For new code, prefer `DateTimeFormatter`; keep `SimpleDateFormat` only at legacy boundaries where an old API requires it.
