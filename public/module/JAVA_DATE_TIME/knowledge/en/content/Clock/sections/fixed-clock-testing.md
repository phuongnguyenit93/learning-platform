Suppose a token expires at 10:05 UTC:

```java
Instant expiresAt = Instant.parse("2026-09-27T10:05:00Z");
```

Test the rule before expiry:

```java
Clock beforeExpiry = Clock.fixed(
        Instant.parse("2026-09-27T10:04:00Z"),
        ZoneOffset.UTC
);

assertFalse(isExpired(expiresAt, beforeExpiry));
```

Then after expiry:

```java
Clock afterExpiry = Clock.fixed(
        Instant.parse("2026-09-27T10:06:00Z"),
        ZoneOffset.UTC
);

assertTrue(isExpired(expiresAt, afterExpiry));
```

At the exact expiry boundary:

```java
Clock atExpiry = Clock.fixed(
        expiresAt,
        ZoneOffset.UTC
);

assertTrue(isExpired(expiresAt, atExpiry));
```

None of these tests sleeps or depends on the real wall clock.

### Do not use Thread.sleep as a unit-test clock

Weak pattern:

```java
Thread.sleep(1_000);
assertTrue(...);
```

It makes tests slower and can introduce flakiness under scheduler or CI load. If the rule only needs controlled time, move the clock rather than waiting for real time to pass.
