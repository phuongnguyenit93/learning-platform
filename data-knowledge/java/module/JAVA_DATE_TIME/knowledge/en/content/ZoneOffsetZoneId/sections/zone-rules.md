A region-based `ZoneId` resolves through `ZoneRules`:

```java
ZoneId paris = ZoneId.of("Europe/Paris");
ZoneRules rules = paris.getRules();
```

The rule set can answer questions such as:

```text
Which offset applies to this Instant?
Which offsets are valid for this LocalDateTime?
Is there a transition around this local time?
```

```java
ZoneRules rules = ZoneId.of("Europe/Paris").getRules();

ZoneOffset winter = rules.getOffset(Instant.parse("2026-01-15T12:00:00Z"));
ZoneOffset summer = rules.getOffset(Instant.parse("2026-07-15T12:00:00Z"));
```

Those offsets can differ because the region rules differ by date.

### Why `+07:00` is not the same thing as `Asia/Ho_Chi_Minh`

The reliable direction is:

```text
ZoneId
    ↓ rules + date/instant
ZoneOffset
```

not:

```text
ZoneOffset
    ↓ uniquely recover
ZoneId
```

Multiple zones may share one offset at a particular instant, so an offset does not contain enough information to reconstruct a named region.

### Time-zone rules are updatable data

Governments can change daylight-saving policy or legal offsets. JDK updates can therefore include newer time-zone database rules. If a future schedule is defined by a real region, preserve its `ZoneId` when the business meaning depends on regional rules rather than freezing an offset too early.

The next chapter combines these pieces using `ZonedDateTime` and `OffsetDateTime`.
