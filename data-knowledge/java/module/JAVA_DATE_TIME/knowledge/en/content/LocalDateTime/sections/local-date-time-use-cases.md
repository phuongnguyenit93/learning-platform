`LocalDateTime` is correct when the domain genuinely owns **local calendar fields** while no timeline mapping exists yet, or when the local civil value itself is what the business cares about.

### 1. User input before a location is selected

```java
LocalDateTime requestedSlot = LocalDateTime.of(2026, 10, 5, 9, 0);
```

Later, once the region is known:

```java
ZoneId zone = ZoneId.of("Asia/Ho_Chi_Minh");
ZonedDateTime scheduled = requestedSlot.atZone(zone);
```

### 2. A domain rule expressed in local civil time

**Local civil time** means the calendar date and wall-clock time people in a place use for everyday/business purposes before that value is mapped to one global instant. A rule such as “close the accounting day at 23:00 on the last day of the month” is naturally expressed in local calendar fields. The owning zone may be supplied by a separate business configuration boundary.

### 3. A database column whose semantics are local time

If a column really means “timestamp without time zone,” `LocalDateTime` can be a natural mapping. The application must still avoid treating that column as an already-resolved global instant.

### When is it the wrong type?

Do not choose `LocalDateTime` simply because an input string looks like:

```text
2026-10-05 09:00:00
```

**Text shape does not define temporal semantics.** Ask what the data means.

```text
Audit timestamp?             → usually Instant
Meeting in a real region?    → ZonedDateTime or local + ZoneId
Date + time before zone?     → LocalDateTime
```

The next chapter moves to `Instant`, the type used when the model finally needs **one unambiguous point on the global timeline**.
