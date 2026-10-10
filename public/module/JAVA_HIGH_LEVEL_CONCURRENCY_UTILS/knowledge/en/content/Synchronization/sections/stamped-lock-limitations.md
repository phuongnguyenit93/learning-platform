`StampedLock` There are some important semantics to remember:

- **No reentrant**: Threads holding write locks are not assumed to be re-acquiable as `ReentrantLock`;
- the `Lock` View of `StampedLock` Not Provided `Condition`;
- Programmer must manage `Long Stamp` and unlock the correct mode;
- Optimistic Read is always needed `validate(stamp)` before the snapshot;
- When cancellation/interruption is important, it is necessary to choose the appropriate Interruptible API instead of defaulting all acquisitions to cancellable.

References:

```text
SynchronizationController#stampedLockLimitations()
GET /synchronization/stamped-lock-limitations
```

Experiment hold write lock and call `tryWriteLock()` again on the same Thread. Since the lock does not reentrant, the second attempt fails. Experiment also calls `newCondition()` Read-Lock View and Operation Observation are not supported.

```text
sameThreadReentrantTryWriteLockSucceeded = false
reentrant = false
conditionSupported = false
```

**Final Thoughts** USE ONLY `StampedLock` When optimistic/read semantics are really worth it, complexity increases.
