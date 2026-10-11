`ReentrantLock` provides the same mutual exclusion objectives but adds control capabilities that `synchronized` No Direct:

- `tryLock()`;
- `tryLock(timeout, unit)`;
- `lockInterruptibly()`;
- fairness option;
- Many `Condition` on the same lock.

Important Rule:

```java
lock.lock();
try {
    Critical Section
} finally {
    lock.unlock();
}
```

If you forget `unlock()`, the lock can be held indefinitely.

### Why is it called Reentrant?

Reentrant means **The thread holding the lock can acquire the lock itself** without deadlocking itself.

`ReentrantLock` Track Hold Count:

```text
lock() 1st time → holdCount = 1
lock() 2nd → holdCount = 2
unlock() → holdCount = 1
unlock() → holdCount = 0
```

Intrinsic monitor of `synchronized` also reentrant.

References:

```text
SynchronizationController#reentrantLock()
GET /synchronization/reentrant-lock
```

**Final Thoughts** Reentrancy allows a call chain on the same thread to go through multiple methods and acquire a lock without locking itself; but the number of releases still has to match the number of acquires.

### tryLock demo

References:

```text
SynchronizationController#tryLock()
GET /synchronization/try-lock
```

Worker A holds the lock. Worker B only waits for a finite amount equal to `tryLock(timeout)`.

Points to observe:

```text
holderAcquired = true
contenderAcquiredWhileHeld = false
workersTerminated = true
```

**Final Thoughts** `tryLock` allows for timeout/fallback construction instead of waiting for an infinite lock.

### lockInterruptibly demo

References:

```text
SynchronizationController#interruptibleLock()
GET /synchronization/interruptible-lock
```

A worker waiting for the lock `lockInterruptibly()` are sent interrupt.

Expected results:

```text
waiterInterrupted = true
waiterAcquired = false
```

**Final Thoughts** Explicit Lock can support cancellation while waiting for the lock.

### Fair and unfair lock

`new ReentrantLock(true)` Fairness Policy requirements are stronger than the default.

Fairness should not be judged by the order of a few log lines. Scheduler and when the Thread actually calls `lock()` May be different order `start()`.

Fair lock often exchanges throughput for the ability to limit barging/starvation. Benchmarking is required according to real workload if this option is important.

Don't use a benchmark of a few hundred or a few thousand threads and then conclude absolutely that:

```text
Fair = Never Starvation
unfair = definitely starvation
```

Fairness is **Acquisition Policy** of the lock, not the promise of order `Thread.start()`, the order in which the scheduler runs the Thread or the order in which the log appears.

An important footgun: with fair `ReentrantLock`, `tryLock()` **No timeout** It is not required to follow the fairness policy. It can be acquired immediately if the lock is available even though another thread has been waiting longer. In contrast, timed `tryLock(timeout, unit)` Honor Fairness Policy of Fair Lock when having to wait in line.

Mental model:

```text
new ReentrantLock(true)
→ lock()/lockInterruptibly()/timed tryLock() using the appropriate fair admission policy

untimed tryLock()
→ opportunistic immediate acquisition
→ can barge
```

So don't use untimed `tryLock()` and then deduce that all fair lock acquisitions are FIFO-like.

### Fair/unfair policy demo

References:

```text
SynchronizationController#reentrantLockPolicy()
GET /synchronization/reentrant-lock-policy
```

Experiment deliberately does not benchmark timing. It only observes the configuration contract:

```text
defaultIsFair = false
explicitUnfairIsFair = false
explicitFairIsFair = true
untimedTryLockHonorsFairness = false
timedTryLockHonorsFairness = true
fairnessGuaranteesThreadStartOrder = false
fairnessEliminatesSchedulingVariance = false
fairnessHasPotentialThroughputCost = true
```

**Final Thoughts** use fairness when semantics about reducing barging/starvation is worth more than throughput cost; if performance is important, benchmark the actual workload, not inferred from a few endpoint runs.
