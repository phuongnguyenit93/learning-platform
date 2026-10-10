Atomicity/visibility/ordering is mainly about **Correctness of state**.

Deadlock/livelock/starvation talks about **Progress of the system**.

### Deadlock

A deadlock occurs when threads form a dependency cycle and no thread can continue.

Classic Scenario:

```text
Thread A holds Lock A
Thread A wait for Lock B

Thread B holds Lock B
Thread B waits for Lock A
```

This is a circular wait.

A real deadlock if created directly in the HTTP demo will leave the Thread stuck for a long time, so the module does not create an intentional permanent deadlock.

Instead, use experiment bounded to simulate the correct dependency shape and then use `tryLock()` to escape.

References:

```text
ConcurrencyProblemController#deadlockRisk()
```

Endpoint:

```text
GET /concurrency/problem/deadlock-risk
```

Expected results:

```text
threadAHasFirstLock = true
threadBHasFirstLock = true
threadASecondLockAcquired = false
threadBSecondLockAcquired = false
recoveredWithoutLeak = true
```

**Final Thoughts** This endpoint demonstrates circular-lock dependency and deadlock avoidance, without pretending that the timeout is deadlock.

### Livelock

A livelock occurs when threads are still running and constantly reacting to each other but failing to make progress.

Mental model example:

```text
A sees B trying
→ A stepped back

B sees A trying
→ B stepped back

both try again at the same time
→ Repeat
```

References:

```text
ConcurrencyProblemController#boundedLivelock()
```

Endpoint:

```text
GET /concurrency/problem/livelock
```

The demo deliberately keeps two workers reacting symmetrically within a finite number of rounds and then ends.

Expected results:

```text
progressMade = false
workerABackoffs > 0
workerBBackoffs > 0
workersTerminated = true
```

It illustrates **active but no progress** without leaving an infinite loop.

### Starvation

Starvation occurs when a thread can theoretically continue but in practice continuously does not receive the required CPU/lock/resource for a very long time.

Quick Difference:

| Problem | Does Thread work? | System progress? |
| --- | --- | --- |
| Deadlock | Unable to move forward | No |
| Livelock | Yes, Continuous Reaction | No |
| Starvation | Some other Threads are still moving forward | One Thread can be starved |

Starvation depends on the scheduler/lock policy and workload, so it is not recommended to use a few lines `println` to "prove" it. Fair/unfair lock will be learned carefully in the Synchronization section.
