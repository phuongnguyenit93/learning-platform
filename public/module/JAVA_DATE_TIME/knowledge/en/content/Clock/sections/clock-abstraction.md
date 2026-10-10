Without a clock dependency:

```java
boolean isExpired(Instant expiresAt) {
    return !Instant.now().isBefore(expiresAt);
}
```

The method reads global system time directly. Its behavior depends on when the test happens to run.

With `Clock`:

```java
boolean isExpired(Instant expiresAt, Clock clock) {
    return !Instant.now(clock).isBefore(expiresAt);
}
```

The business rule is unchanged, but the source of current time is now an explicit dependency.

This example deliberately defines expiry as **`now >= expiresAt`**. If a domain wants expiry only after that boundary, it can use `isAfter`; the important point is to choose and test equality at the deadline consistently.

### Useful Clock factories

```java
Clock utc = Clock.systemUTC();
Clock systemZone = Clock.systemDefaultZone();
Clock fixed = Clock.fixed(
        Instant.parse("2026-09-27T10:00:00Z"),
        ZoneOffset.UTC
);
Clock shifted = Clock.offset(utc, Duration.ofMinutes(5));
```

A `Clock` can provide both an instant and a zone:

```java
Instant now = clock.instant();
ZoneId zone = clock.getZone();
```

### InstantSource — when only an Instant source is needed

Since Java 17, `java.time` also provides `InstantSource`: a **narrower abstraction than `Clock`** whose job is simply to provide the current `Instant`.

```text
InstantSource
→ need to know "what is the current instant?"

Clock
→ also provides the current instant
→ additionally carries a ZoneId for APIs that need local/calendar context
```

`Clock` implements `InstantSource`, so a service that only needs timeline timestamps can depend on the narrower interface:

```java
boolean isExpired(Instant expiresAt, InstantSource source) {
    return !source.instant().isBefore(expiresAt);
}
```

Tests can still use a fixed source:

```java
InstantSource fixed = InstantSource.fixed(
        Instant.parse("2026-09-27T10:00:00Z")
);
```

Do not replace every `Clock` with `InstantSource`: when logic needs a `ZoneId`, `LocalDate.now(clock)`, or `ZonedDateTime.now(clock)`, `Clock` remains the better abstraction.

### Clock is not a stopwatch for elapsed time

`Clock`/`Instant.now()` model **wall-clock time**: they answer “which point on the timeline is it now?” A wall clock can be adjusted by the operating system, time synchronization, or the configured clock source.

When the goal is to measure **how long code took to execute** inside one JVM, Java provides `System.nanoTime()`:

```java
long start = System.nanoTime();

doWork();

long elapsedNanos = System.nanoTime() - start;
```

The absolute value returned by `nanoTime()` is not a timestamp, cannot be meaningfully converted to `Instant`, and has no calendar meaning. Only the **difference between readings in the same JVM** is meaningful for elapsed-time measurement.

```text
Clock / Instant.now()
→ "what point on the timeline is it now?"

System.nanoTime()
→ "how much time elapsed between two measurements in this JVM?"
```

These are different problems even though both involve the word “time.”
