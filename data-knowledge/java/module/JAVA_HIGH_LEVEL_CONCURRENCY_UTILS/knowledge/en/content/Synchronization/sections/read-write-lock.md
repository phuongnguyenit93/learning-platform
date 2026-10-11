`ReentrantReadWriteLock` Split access into:

```text
Read Lock
→ multiple readers can hold the same

Write Lock
→ exclusive
```

Basic Rules:

| A is holding | B wants | Result |
| --- | --- | --- |
| Read | Read | Can run together |
| Read | Write | Write must wait |
| Write | Read | Read must wait |
| Write | Write | Write must wait |

References:

```text
SynchronizationController#readWriteLock()
GET /synchronization/read-write-lock
```

Experiment for two readers to hold the read lock together and then start writer.

Points to observe:

```text
maxConcurrentReaders >= 2
writerAcquiredWhileReadersHeld = false
writerEventuallyAcquired = true
```

### Lock downgrading

`ReentrantReadWriteLock` Support **Downgrade** From Write Lock to Read Lock by Flow:

```text
hold write lock
→ acquire read lock
→ release write lock
→ continue to keep read lock
```

In the opposite direction **Not supported as a lock upgrade**. A Thread that holds a read lock cannot rely on acquiring a write lock to "upgrade" the right to hold the lock while keeping the read lock.

Mental models to remember:

```text
write → read
→ supported downgrade

read → write
→ upgrade is not supported
→ have to redesign the flow, release read lock, and then compete to write lock according to the appropriate protocol
```

Refer to the private experiment:

```text
SynchronizationController#readWriteLockDowngrade()
GET /synchronization/read-write-lock-downgrade
```

Experiment keeps write lock, acquires more read lock, and then releases write lock. Another writer still has to wait until the read lock downgrade is released.

Then together with the experiment to keep **Read Lock Only** then try `writeLock().tryLock(timeout)`. Expected results:

```text
readToWriteUpgradeSucceeded = false
readToWriteUpgradeSupported = false
```

**Final Thoughts** downgrade retains continuity of reading rights after the end of mutation; `ReentrantReadWriteLock` Read → Write Upgrade is not supported. If write access is required, flow must release/re-coordinate instead of keeping read lock and waiting for the upgrade.
