Happy-path demos aren't enough to use a safe synchronizer. It's important to understand what happens when a participant doesn't arrive on time.

References:

```text
CoordinationController#synchronizersTimeout()
GET /coordination/synchronizers-timeout
```

Endpoint illustration bounded:

```text
CountDownLatch.await(timeout)
→ false when caller timed out
→ real workers continue to run and complete normally

CyclicBarrier participant timeout
→ barrier broken
→ reset() brings barriers to a new generation
→ Next Generation Can Run Successfully with New Participants

Semaphore acquire(2) + tryAcquire(timeout)
→ timeout if there is no longer a permit

Phaser arrive /arriveAndAwaitAdvance /deregister
→ a participant leaves after phase 0
The remaining → participants continue to phase 1
→ represent dynamic registration/deregistration

Phaser coordinator
→ use awaitAdvanceInterruptibly(..., timeout, ...)
→ bounded wait and react to interruption

Exchanger without a partner
→ timed exchange throws TimeoutException

Exchanger waiting for partner
→ interrupt blocking exchange ends with InterruptedException
```

As for the demo latch, the worker is held by another latch and is only released **after the caller has observed the timeout**. Do not use the difference between the two intervals `sleep()` to assume the timeout definitely happens.

Fields to observe in `countDownLatch`:

```text
completedBeforeTimeout = false
workerContinuedAfterCallerTimeout = true
workerTerminatedNormally = true
```

If the caller is interrupted or the observation step fails, the service still releases the gate and cleanup worker in the `finally`. With Phaser, the coordinator uses timed interruptible wait; the cleanup force-terminate Phaser line so that workers don't get stuck in the phase where there are not enough participants. With Exchanger, the experiment runs both timed wait and interrupt path so that participants don't wait for an infinite partner.

**Final Thoughts** Timeout isn't just about "waiting less"; each primitive has its own failure state and recovery semantics.
