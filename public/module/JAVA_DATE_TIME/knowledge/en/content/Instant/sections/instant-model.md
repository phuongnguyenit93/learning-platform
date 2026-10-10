`Instant` represents **one point on the UTC timeline**. It does not primarily model a human calendar view such as `2026-10-05 09:00 Asia/Ho_Chi_Minh`; it models the event's absolute timeline position.

```java
Instant now = Instant.now();
Instant explicit = Instant.parse("2026-10-05T02:00:00Z");
```

The `Z` suffix in ISO-8601 denotes offset `+00:00`, or UTC.

### Why does Instant matter in distributed systems?

Two servers can display the same event using different wall clocks:

```text
Server A displays: 09:00 in Vietnam
Server B displays: 04:00 in Paris
```

Those local representations may still point to **the same instant**. For audit data, event ordering, message timestamps, and cross-system communication, putting values on one shared timeline removes local-time ambiguity.

### Instant is not “LocalDateTime in UTC”

Do not model `Instant` mentally as a `LocalDateTime` that happens to use UTC. `Instant` does not own year/month/day/hour as its primary domain fields. Calendar fields appear only after the instant is projected through a zone.

```java
Instant instant = Instant.parse("2026-10-05T02:00:00Z");

ZonedDateTime vietnamView = instant.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
ZonedDateTime parisView = instant.atZone(ZoneId.of("Europe/Paris"));
```

One instant can have many local calendar views.

### Advanced boundary — Java Time-Scale and leap seconds

A beginner can keep the simpler model: `Instant` is one point on a global UTC-oriented timeline. At the deeper specification level, Java defines a **Java Time-Scale** for its date-time classes; it models each calendar day with 86,400 subdivisions and defines its own relationship to a **leap second** — a special civil-time adjustment occasionally introduced to keep civil time close to Earth's rotation.

For ordinary applications, remember:

```text
Instant
→ excellent for event timestamps, ordering, and persistence boundaries

Instant
→ do not assume it is an astronomical/leap-second measurement model
  unless the domain explicitly requires one
```
