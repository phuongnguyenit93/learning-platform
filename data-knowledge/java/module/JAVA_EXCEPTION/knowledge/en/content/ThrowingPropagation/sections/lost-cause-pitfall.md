Anti-pattern:

```java
catch (SQLException ex) {
    throw new RuntimeException("load failed");
}
```

The new exception no longer knows that the `SQLException` caused it.

Consequences:

```text
log
→ only sees the wrapper chain you kept

root stack trace
→ removed from the causal chain

debugging
→ loses where the database failure originated
```

When creating a new exception from an older one, preserve the cause:

```java
catch (SQLException ex) {
    throw new RuntimeException("load failed", ex);
}
```

This section focuses only on **not losing the cause**. The decision to rethrow the same exception or wrap it in a new type is handled in the application-boundary chapter.

### CORE MODEL RECAP

```text
throw
→ starts exceptional flow

propagation
→ moves failure upward

stack unwinding
→ leaves frames while required cleanup still participates

catch
→ stops propagation where a layer owns a policy

new wrapper + cause
→ creates a new exception without losing the root failure
```

The remaining sections are the advanced checked-exception layer: precise rethrow and `throws` rules for overriding. Learners can revisit them after the core propagation, catch-selection, and causal-chain model is solid.
