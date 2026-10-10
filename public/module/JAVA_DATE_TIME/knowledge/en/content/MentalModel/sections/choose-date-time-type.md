The useful question is not “which class has the most methods?” but **“what does this value actually know?”**

| Problem | Good starting type | Reason |
| --- | --- | --- |
| birthday | `LocalDate` | calendar date only |
| daily opening time | `LocalTime` | time of day only |
| 09:00 on Oct 5 before a location is chosen | `LocalDateTime` | date + time, still no zone |
| request-arrival timestamp | `Instant` | unambiguous global timeline point |
| meeting at 09:00 in Paris | `ZonedDateTime` | local fields plus region rules |
| protocol timestamp with `+07:00` but no region | `OffsetDateTime` | concrete offset is known, ZoneId is not |
| billing period `2026-10` | `YearMonth` | year + month without inventing a day |
| recurring birthday `--07-20` | `MonthDay` | month + day without a specific year |
| a standalone year such as `2026` | `Year` | the domain owns only a year |
| protocol time `09:30+07:00` | `OffsetTime` | time-of-day + offset without a date/region |

### Quick decision tree

```text
Date only?                         → LocalDate
Time of day only?                  → LocalTime
Date + time but no zone?           → LocalDateTime
Absolute point on the timeline?    → Instant
Date/time plus named region rules? → ZonedDateTime
Date/time plus a concrete offset?  → OffsetDateTime
Year-month without a day?          → YearMonth
Month-day without a year?          → MonthDay
```

Types such as `Year`, `YearMonth`, `MonthDay`, and `OffsetTime` do not need dedicated chapters in this learning path because their mechanics follow from the core concepts. They still matter for modeling: **if the domain knows only a year-month, do not invent day `01`; if it knows only a month-day, do not invent a fake year**.

### “Local” does not mean “the machine's current zone”

The name `LocalDateTime` is easy to misread. `Local` means the object contains local calendar/clock fields **without** a zone or offset. It does not automatically attach the JVM's default time zone.

```java
LocalDateTime local = LocalDateTime.of(2026, 10, 5, 9, 0);
```

That object contains none of these:

```text
Asia/Ho_Chi_Minh
+07:00
UTC
```

The application must provide zone or offset context deliberately when it needs a timeline mapping.

### Module roadmap

```text
Date?                 → LocalDate
Time of day?          → LocalTime
Local date + time?    → LocalDateTime
Timeline point?       → Instant
Offset or zone rules? → ZoneOffset / ZoneId
Attach context?       → ZonedDateTime / OffsetDateTime
Amount of time?       → Duration / Period
Text ↔ temporal?      → Formatting / Parsing
Add/subtract/compare + DST? → Arithmetic / Comparison
Testable “now”?       → Clock
Old APIs + default zone + storage? → Legacy Interop / Synthesis
```

If only one idea stays with you before the next chapter, keep this one: **choose a date-time type from the meaning of the data, not from a habit of calling everything a timestamp**.
