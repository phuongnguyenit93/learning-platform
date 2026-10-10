For `MutableCallSite`, `setTarget` does not provide the same cross-thread visibility as a volatile write.

```java
site.setTarget(newTarget);
```

When a runtime needs to force synchronization of a group of mutable call sites:

```java
MutableCallSite.syncAll(
        new MutableCallSite[]{site}
);
```

With multiple writers, `setTarget` and `syncAll` generally need mutual exclusion so publication updates do not race with one another. Readers may observe the new target immediately after `setTarget` and before `syncAll`, or may keep seeing an older target until `syncAll` completes. `syncAll` can be expensive, so it is better suited to batched, relatively infrequent updates.

`VolatileCallSite` provides stronger visibility behavior:

```java
volatileSite.setTarget(newTarget);
```

This module stops at API-level behavior. Formal happens-before reasoning, memory ordering, and lock-free correctness belong to Java Concurrency.

A common mistake is assuming “mutable target” automatically means volatile publication. It does not.
