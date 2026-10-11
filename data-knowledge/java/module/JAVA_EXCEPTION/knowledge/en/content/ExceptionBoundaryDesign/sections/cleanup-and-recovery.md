These are different responsibilities.

### Cleanup

```text
goal
→ release owned resources / perform mandatory exit work

mechanisms
→ try-with-resources
→ finally when appropriate
```

Cleanup does not mean the operation recovered.

### Recovery

Recovery means applying a real strategy that still produces a valid outcome.

Example:

```text
primary configuration file is missing
→ use a documented default configuration
```

Catching a failure and returning an arbitrary value is not recovery if callers cannot distinguish real data from fabricated success.

### Retry

Retry makes sense only when the failure may be **transient** and the operation is safe to attempt again.

Before retrying, ask:

```text
Is the failure plausibly transient?
Is the operation idempotent or otherwise protected from duplicate side effects?
Is retry bounded?
Does the policy account for backoff, cancellation, and timeout limits?
```

Avoid:

```java
while (true) {
    try {
        sendPayment();
        break;
    } catch (Exception ex) {
        // retry forever
    }
}
```

Unbounded retry can turn a failure into overload and can duplicate side effects.

For this Java Core module, the key idea is that **retry is a policy chosen at a boundary with enough context**, not an automatic response to every exception.

### Propagation

If the current layer cannot:

- recover;
- translate meaningfully;
- add needed context;
- terminate the operation;
- clean up resources it owns;

then propagation may be the correct choice.

### Decision model

```text
Exception reaches this layer
        ↓
Do I own resources that need cleanup?
        → yes: clean them up safely

Can I produce a valid recovered outcome?
        → yes: recover

Is the failure transient and retry safe?
        → yes: retry with a bounded policy

Does the abstraction change here?
        → yes: translate + preserve cause

Is this the final request/job boundary?
        → yes: map outcome + log/observe appropriately

None of those responsibilities apply?
        → propagate
```

The final chapter connects these decisions into one end-to-end failure-handling model from the origin of a failure to the boundary that ultimately owns the outcome.
