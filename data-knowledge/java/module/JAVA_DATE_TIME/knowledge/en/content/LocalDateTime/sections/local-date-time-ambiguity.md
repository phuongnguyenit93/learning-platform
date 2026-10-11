This is the central distinction of the chapter.

The local value:

```text
2026-10-05T09:00
```

can map to different global instants under different zones:

```java
LocalDateTime local = LocalDateTime.of(2026, 10, 5, 9, 0);

Instant vietnam = local
        .atZone(ZoneId.of("Asia/Ho_Chi_Minh"))
        .toInstant();

Instant paris = local
        .atZone(ZoneId.of("Europe/Paris"))
        .toInstant();
```

The local fields are identical, but the region rules resolve them onto different points of the global timeline.

```text
LocalDateTime
    + ZoneId
        ↓
resolve local fields through zone rules
        ↓
ZonedDateTime
        ↓
Instant
```

### DST makes the ambiguity visible

In regions with daylight-saving transitions, a local date-time can fall into one of three shapes:

```text
normal
→ exactly one valid offset

gap
→ the local clock jumps forward
→ some local times do not exist

overlap
→ the clock moves backward
→ some local times occur twice under two offsets
```

Because `LocalDateTime` carries no zone rules, it cannot resolve those cases by itself. Later chapters cover the actual zone-resolution behavior.

### Common mistake: createdAt as LocalDateTime

```java
class Order {
    LocalDateTime createdAt;
}
```

If `createdAt` means an event that actually occurred in a distributed system, a zone-less local value may lose the information needed to compare events across machines. `Instant` is usually a better semantic fit for that kind of machine-oriented timestamp.
