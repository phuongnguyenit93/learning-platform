`StampedLock` Support:

- write lock;
- read lock;
- optimistic read.

Optimistic read does not keep the read lock for the entire reading. The reader takes a stamp, reads the snapshot, and then calls `validate(stamp)`.

```text
tryOptimisticRead()
        ↓
Read the Snapshot
        ↓
validate(stamp)
   ├─ True → Snapshot is still valid
   └─ false → fallback to real read lock
```

References:

```text
SynchronizationController#stampedLock()
GET /synchronization/stamped-lock
```

Writers are deliberately interspersed in the middle of the optimistic read.

Expected results:

```text
optimisticStampValid = false
fallbackValue = updatedValue
```

**Final Thoughts** Optimistic Read is a read-and-proof strategy, not "read safely without validation".
