`OffsetDateTime` stores local fields plus **one `ZoneOffset`**, but no named region rule set.

```java
OffsetDateTime value = OffsetDateTime.of(
        2026, 10, 5,
        9, 0, 0, 0,
        ZoneOffset.ofHours(7)
);
```

That is still enough to calculate an instant:

```java
Instant instant = value.toInstant();
```

But the value cannot prove that the original region was `Asia/Ho_Chi_Minh`.

### Choosing between ZonedDateTime and OffsetDateTime

```text
Does the domain need a named region and its rules over time?
→ ZonedDateTime

Does a boundary provide only local fields + a concrete offset?
→ OffsetDateTime

Does only the global timeline point matter?
→ consider Instant
```

Offset-carrying API timestamps are often excellent interchange values, while future scheduling may still need a separate `ZoneId` when regional rule semantics matter.
