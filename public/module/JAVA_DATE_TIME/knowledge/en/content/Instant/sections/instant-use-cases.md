`Instant` is commonly appropriate for values such as:

```text
createdAt / updatedAt for events that already occurred
requestReceivedAt
messageProducedAt
tokenIssuedAt / expiresAt when the rule is timeline-based
audit log timestamps
```

```java
record AuditEvent(String action, Instant occurredAt) {}

AuditEvent event = new AuditEvent("PAYMENT_CONFIRMED", Instant.now());
```

### When Instant is not the whole model

A future meeting such as “09:00 on October 5 in Europe/Paris” expresses intent in **local civil time plus region rules**. If the application stores only the initially resolved instant, it may lose region context that the domain needs for display, rescheduling, or reacting to future rule changes.

Ask:

```text
Has the event already occurred and only timeline position matters?
→ Instant is often sufficient

Is this a future schedule tied to a named place?
→ preserve local date-time + ZoneId/ZonedDateTime as the domain requires
```

### Comparing instants

```java
Instant a = Instant.parse("2026-10-05T02:00:00Z");
Instant b = Instant.parse("2026-10-05T03:00:00Z");

a.isBefore(b); // true
a.isAfter(b);  // false
```

Both values are already on the same global timeline, so comparison does not require guessing a zone.

The next chapter covers the bridge back to local civil time: **how is one concrete UTC offset different from a named zone whose rules can change by date?**
