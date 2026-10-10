```text
Synchronization
→ who can touch Shared State at what point?

Coordination
→ which thread has to wait for another event/phase/thread?
```

`synchronized` Counter protection is synchronization.

`CountDownLatch` Waiting for the two workers to complete is coordination.

A reality show usually uses both.

### Does fair lock mean all acquisitions are fair?

Nope. Example `new ReentrantLock(true)` Fair Lock configuration, but untimed `tryLock()` is still an opportunistic acquisition and can barge if the lock is available. Timed `tryLock(timeout, unit)` to join the Fair Ordering Policy when they have to wait. With `ReentrantReadWriteLock`, non-blocking `ReadLock.tryLock()` / `WriteLock.tryLock()` nor should it be considered fairness-preserving admission.
