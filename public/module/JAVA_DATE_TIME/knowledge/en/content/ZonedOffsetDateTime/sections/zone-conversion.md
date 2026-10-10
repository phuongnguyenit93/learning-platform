### Preserve the instant

```java
ZonedDateTime source = ZonedDateTime.of(
        2026, 10, 5, 9, 0, 0, 0,
        ZoneId.of("Asia/Ho_Chi_Minh")
);

ZonedDateTime parisView = source.withZoneSameInstant(
        ZoneId.of("Europe/Paris")
);
```

Use this when displaying **the same event** to a user in another zone.

### Preserve local fields

```java
ZonedDateTime reinterpreted = source.withZoneSameLocal(
        ZoneId.of("Europe/Paris")
);
```

This keeps the local date/time as closely as the target rules allow and therefore normally changes the instant. It is not another view of the same event; it is a reinterpretation of a local schedule under different regional rules.

### Start from an Instant

```java
Instant eventTime = Instant.parse("2026-10-05T02:00:00Z");

ZonedDateTime vietnamView = eventTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
ZonedDateTime parisView = eventTime.atZone(ZoneId.of("Europe/Paris"));
```

Both values preserve the same event identity.

### OffsetDateTime has same-instant and same-local conversions too

The same mental model applies to `OffsetDateTime`:

```java
OffsetDateTime original = OffsetDateTime.parse("2026-10-05T09:00:00+07:00");

OffsetDateTime sameInstant = original.withOffsetSameInstant(
        ZoneOffset.ofHours(2)
);
// 2026-10-05T04:00+02:00 → same instant

OffsetDateTime sameLocal = original.withOffsetSameLocal(
        ZoneOffset.ofHours(2)
);
// 2026-10-05T09:00+02:00 → same local fields, different instant
```

```text
withOffsetSameInstant
→ preserve the timeline point and change wall-clock fields for the new offset

withOffsetSameLocal
→ preserve local fields and reinterpret them under the new offset
```

Because `OffsetDateTime` carries no regional rule set, this is conversion between concrete offsets only; it does not perform DST rule lookup like a region-based `ZoneId` does.

Resolving local fields around DST gaps and overlaps adds another layer of rules; the Arithmetic / Comparison chapter covers those cases explicitly. First, the next chapter separates two different meanings of an “amount of time”: `Duration` and `Period`.
