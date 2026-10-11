A common anti-pattern is:

```text
repository catches → logs → rethrows
service catches    → logs → rethrows
controller catches → logs → maps outcome
```

One failure produces several nearly identical stack traces.

### Useful heuristic

```text
layer that only rethrows/translates
→ preserve context/cause
→ usually do not log the same failure again

layer that terminates the request/job/message
→ has the final request/job/business context
→ usually logs/records the failure once
```

This is not an absolute law. A layer may emit a metric or audit event without dumping the same full exception again.

A better question than “should I log here?” is:

```text
What new information does this record add,
and which layer owns the final failure outcome?
```

### Do not log and then discard the cause

Weak:

```java
catch (SQLException ex) {
    log.error("database failed");
    throw new OrderRepositoryException("load failed");
}
```

If translation is needed, preserve the cause:

```java
catch (SQLException ex) {
    throw new OrderRepositoryException("load failed", ex);
}
```

The final boundary can log the wrapper and its causal chain once.
