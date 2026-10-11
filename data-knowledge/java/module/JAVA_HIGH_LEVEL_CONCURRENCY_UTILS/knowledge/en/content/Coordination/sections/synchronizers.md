### CountDownLatch

One or more threads wait counter to 0.

```text
new CountDownLatch(N)
workers countDown()
coordinator await()
```

Latch is a one-shot: the counter that has reached 0 does not reset to use a new round.

`await(timeout, unit)` Pay `false` when the timeout is up, the counter has not reached 0. Thread Timeout Waiting **No self-cancellation** the workers are running.

### CyclicBarrier

A group of Threads wait together at the barrier. When enough parties are enough, the group continues. The barrier can be reused for generations if it is not broken.

If a participant timeouts/interrupts during a wait, the barrier may go into a **broken**. Other participants can receive `BrokenBarrierException`. `reset()` Create a new generation but should only be used when the application has a clear understanding of the state of the old participants.

Barrier can also receive a `barrierAction`, which runs when the last party reaches the checkpoint before the party is released.

### Semaphore

Semaphore manages the number of permits, which is suitable for limiting concurrent access to a resource with finite capacity.

Rule cleanup:

```java
boolean obtained = false;
try {
    semaphore.acquire();
    obtained = true;
    use resource
} finally {
    if (acquired) {
        semaphore.release();
    }
}
```

None `release()` if not successfully acquired.

### Fair and non-fair Semaphore

`new Semaphore(n)` non-fair default. `new Semaphore(n, true)` Select Fairness for acquisitions to which this policy applies, in order to the internal queuing point. It does not guarantee the order `Thread.start()` or log order.

Fairness helps limit barging/starvation when disputing permits, but can reduce throughput. In particular, `tryAcquire()` **No timeout** Doesn't follow fairness: It can get the permit right even though there are other threads waiting. Don't infer the policy just from the constructor's name.

Experiment `synchronizers()` below focuses on concurrent access limits and permit returns; it's not a fairness measurement. This is a policy selection criterion, not a conclusion from the order of several output lines.

References: [Semaphore — Java 21](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/Semaphore.html).

Very important points: `Semaphore` do not enforce ownership like lock. Code can be called `release()` even though Thread is not currently a Thread that has acquired permission. So unmatched `release()` This can cause the permit count to increase incorrectly and break the concurrency limit.

In addition to `acquire()`, memorable APIs include:

```text
acquire(n)
tryAcquire()
tryAcquire(timeout)
```

They help represent resources that require multiple permits or admissions with timeouts.

### Phaser

`Phaser` Suitable for multi-phase coordination and dynamic number of participants who can register/deregister.

Important operations:

```text
register()
arrive()
arriveAndAwaitAdvance()
arriveAndDeregister()
```

Others `CountDownLatch`, Phaser can progress through multiple phases, and participants can change according to the lifecycle of the workflow.

The Phase Wait APIs do not have the same interruption semantics:

```text
awaitAdvance(...)
→ wait for phase advance
→ is not an interruptible wait API

awaitAdvanceInterruptibly(...)
→ reacts to interrupts

awaitAdvanceInterruptibly(..., timeout, unit)
→ reacts to interrupt + has bounded timeout
```

So if the coordinator has to support cancellation/timeout, choose the interruptible/timed API instead of just looking at the name `await`.

### Exchanger

Two Threads meet at an exchange point and exchange objects with each other.

If the partner doesn't come, `exchange(value)` can wait. When a workflow needs bounded waiting, use timed overload:

```java
exchange(value, timeout, unit)
```

Important Semantics:

```text
Partner to
→ exchange success

Partners don't arrive before the deadline
→ TimeoutException

Thread waiting to be interrupted
→ InterruptedException
```

References:

```text
CoordinationController#synchronizers()
GET /coordination/synchronizers
```

The endpoint runs small, bounded examples and returns a result map to see the semantics of each synchronizer.
