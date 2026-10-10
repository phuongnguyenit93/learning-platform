Choose a target type that preserves the information actually present in the text.

```java
LocalDate date = LocalDate.parse("2026-09-27");
LocalDateTime local = LocalDateTime.parse("2026-09-27T14:30:00");
OffsetDateTime offset = OffsetDateTime.parse("2026-09-27T14:30:00+07:00");
ZonedDateTime zoned = ZonedDateTime.parse("2026-09-27T14:30:00+07:00[Asia/Ho_Chi_Minh]");
Instant instant = Instant.parse("2026-09-27T07:30:00Z");
```

### Do not parse and throw information away

If the input contains an offset:

```text
2026-09-27T14:30:00+07:00
```

manually stripping `+07:00` and parsing only a `LocalDateTime` loses timeline context. Parse into `OffsetDateTime` or another appropriate type first, then convert intentionally.

### Do not invent information that the text does not contain

If the input is only:

```text
2026-09-27T14:30:00
```

do not assume UTC or the JVM's default zone unless an external contract explicitly says so.

```text
fields actually present in the text
        ↓
parse into a type that preserves their meaning
        ↓
add zone/offset only when the contract/domain supplies it
```

Once parsing has preserved the right semantics, the next question is arithmetic and comparison: adding, subtracting, and ordering values whose temporal meanings are not all the same.
