A service can receive `Clock` through its constructor:

```java
final class TokenService {
    private final Clock clock;

    TokenService(Clock clock) {
        this.clock = clock;
    }

    boolean isExpired(Instant expiresAt) {
        return !clock.instant().isBefore(expiresAt);
    }
}
```

Production wiring:

```java
TokenService service = new TokenService(Clock.systemUTC());
```

Test wiring:

```java
Clock fixed = Clock.fixed(
        Instant.parse("2026-09-27T10:00:00Z"),
        ZoneOffset.UTC
);

TokenService service = new TokenService(fixed);
```

### Where should Clock be injected?

Every method does not need its own `Clock` parameter. A common design is to inject one at a service/component boundary and use it internally. The goal is to avoid business logic reaching for an uncontrolled global time source.

### Clock is not a scheduler

`Clock` answers “what time does this source report now?” It does not run jobs, schedule callbacks, or guarantee wake-up timing. Scheduling is a separate responsibility.

The final chapter combines legacy APIs, default-zone assumptions, storage boundaries, and synthesis; DST gaps/overlaps were handled in Arithmetic / Comparison.
