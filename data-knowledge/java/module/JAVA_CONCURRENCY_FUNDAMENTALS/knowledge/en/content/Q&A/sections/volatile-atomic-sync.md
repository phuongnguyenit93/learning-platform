### Volatile

Suitable for the visibility/order of a variable state when the update does not require an atomic invariant compound.

```text
Stop Flag
Ready Flag
Published Configuration Reference
```

### Atomic

Suitable for simple atomic state transition:

```text
counter
CAS reference update
```

CAS only checks the current expected value/reference. With a reference that can occur ABA (`A → B → A`): Plain CAS may see the final state as A and do not know that there has been a change in the middle. When the version of the state is partially correctness, consider abstraction as `AtomicStampedReference` instead of the default plain `AtomicReference` enough for all protocols.

### synchronized/Lock

Suitable when multi-step critical section or invariant protection is required.

Not used `Volatile Int Count` then expect `count++` atomic.
