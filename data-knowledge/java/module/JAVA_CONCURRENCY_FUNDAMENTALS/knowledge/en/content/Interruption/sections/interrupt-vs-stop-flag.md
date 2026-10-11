A custom stop flag is still a valid cooperative cancellation technique in several loops:

```java
while (!stopRequested) {
    doWork();
}
```

If `stopRequested` shared between multiple Threads, visibility must be ensured, e.g. by `Volatile` or a primitive equivalent.

The key differences are **Stop flag is just the application state**. It doesn't integrate with Java's interruption protocol and doesn't automatically wake up a thread that's in an interruptible operation like `sleep()`, `wait()` or `join()`.

For example:

```java
volatile boolean stopRequested;

while (!stopRequested) {
    Thread.sleep(30_000);
}
```

If the Thread is in the middle `sleep(30_000)` and other Threads just do:

```java
stopRequested = true;
```

workers haven't had a chance to re-read the flag until `sleep()` natural finish.

While:

```java
worker.interrupt();
```

can do `sleep()` Ending early with `InterruptedException`.

Mental Model Comparison:

| Mechanism | Visibility signal | Wake-up `sleep/wait/join` | Have interrupt status | Integrate with multiple concurrency APIs |
| --- | --- | --- | --- | --- |
| `Volatile Boolean Stop` | Yes | No | No | No |
| `interrupt()` | Yes interruption signal | Yes with API support interruption | Yes | Yes |

This does not mean that it must be used all the time. `interrupt()` instead of every flag. A state flag can better represent the business lifecycle, for example: `RUNNING`, `PAUSED`, `STOPPING`. But if the task can be blocked and needs responsive cancellation, interruption is usually the more suitable protocol.

### Demo in module

References:

```text
InterruptionController#stopFlagVsInterrupt()
GET /interruption/stop-flag-vs-interrupt
```

Experiment for workers to enter `sleep(30s)`, then:

```text
set volatile stop flag = true
→ worker is still alive
→ interrupt worker
→ sleep throw InterruptedException
→ worker ends
```

Critical Response:

```text
stopFlagVisible = true
aliveAfterOnlyStopFlag = true
stateAfterOnlyStopFlag = TIMED_WAITING
interruptWokeBlockingOperation = true
workerAliveAfterCleanup = false
```

**Final Thoughts** Stop Flag helps workers know *should stop*, and `interrupt()` In addition to carrying cancellation signals, there is also the ability to make many API blocks end early so that workers have the opportunity to react immediately.
