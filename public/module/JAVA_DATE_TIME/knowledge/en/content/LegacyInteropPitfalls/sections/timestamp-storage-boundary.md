There is no universal rule saying “all date-time data must be stored as UTC” for every domain. A better rule is: **store enough information to reconstruct the semantics the business actually owns**.

### Events that already happened

Examples:

```text
paymentCapturedAt
requestReceivedAt
auditEventAt
```

These usually need a timeline point, so `Instant`/UTC-oriented storage is a natural fit.

### Future schedules tied to a place

For a requirement such as:

```text
“09:00 on October 5 in Europe/Paris”
```

the domain may need to preserve:

```text
local date-time
+ ZoneId
```

because the regional rule set is part of the scheduling intent. Storing only the initially resolved instant or offset can lose context needed for rescheduling, display, or future rule updates.

### Local business dates and times

Birthdays, invoice dates, and opening times should not be forced into instants when the domain has no timeline semantics.

### Checklist before choosing a column/type

```text
1. Is this a calendar value or a timeline event?
2. Does the domain need a named region?
3. Is the offset original data or merely a resolved result?
4. Is this a future schedule or an event that already happened?
5. What precision does the storage system preserve?
6. What information must be reconstructed when the value is read back?
```

If those questions are answered first, choosing among `LocalDate`, `LocalDateTime`, `Instant`, `OffsetDateTime`, and `ZonedDateTime` becomes a domain decision rather than a vague convention.

The module's final mental model is:

```text
Understand temporal meaning first
        ↓
choose a type that preserves exactly that information
        ↓
add zone/offset only when the domain needs it
        ↓
choose Duration vs Period from semantics
        ↓
format/parse at boundaries
        ↓
inject Clock for “now”
        ↓
control default zones, DST, and legacy conversions explicitly
```
