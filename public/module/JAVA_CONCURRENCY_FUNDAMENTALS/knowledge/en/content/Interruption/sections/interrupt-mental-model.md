Java does not design `interrupt()` as a forced order to end the Thread.

When calling:

```java
worker.interrupt();
```

The caller is sending a **Interruption Request** to `worker`.

What happens next depends on the state and code of the worker.

If the worker is running the code normally:

```text
interrupt()
    ↓
interrupt status = true
    ↓
Workers must check the signal themselves
    ↓
Worker decides cleanup and ends
```

If the worker is in an operation that supports interruption, such as `sleep()`, `wait()` or `join()`, that operation can end as soon as possible `InterruptedException`.

So the concept is correct:

```text
Cooperative Cancellation

caller
  → Request a Stop

worker
  → observation requirements
  → cleanup
  → Safe End
```

### Why not use Thread.stop()?

`Thread.stop()` is a deprecated API because it can stop the thread at an unsafe time and break the invariant of the shared state.

Modern code should design tasks that are able to react to cancellations instead of forcibly killing threads.

### Demo in module

References:

```text
InterruptionController#interruptBusyWorker()
```

Endpoint:

```text
GET /interruption/busy-loop
```

Experiment creates a worker running the CPU loop:

```java
while (! Thread.currentThread().isInterrupted()) {
    work
}
```

The controller calls service, service start worker and then sends `interrupt()`.

When running, it is necessary to observe:

```text
Worker Start
→ interrupt is sent
→ Worker Observation Interrupt Flag
→ End Loop
→ Thread TERMINATED
```

**Final Thoughts** with non-block code in the interruptible API, `interrupt()` only set the signal; the worker must actively check that signal.
