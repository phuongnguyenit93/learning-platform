Don't understand:

```text
interrupt()
→ all blocking operations are immediately broken
```

An important example is a thread waiting for your intrinsic monitor `synchronized`.

```java
synchronized (monitor) {
    Other threads are holding monitors
}
```

If the worker is in `Thread.State.BLOCKED` because waiting for this monitor, call `interrupt()`:

- set interrupt status;
- **None** make workers get rid of waiting for monitors;
- Workers still have to wait for the monitor to be released.

Once the monitor is obtained, the code can check the interrupt status and handle the cancellation.

If lock acquisition is needed to react to interruption, the Synchronization chapter will introduce `ReentrantLock.lockInterruptibly()`.

Blocking I/O should also not be grouped into a general rule. Interruption capabilities depend on the specific API; some NIO channels have their own semantics interruption while many other blocking APIs require a different resource closure or cancellation mechanism.

### Demo in module

References:

```text
InterruptionController#interruptSynchronizedWaiter()
```

Endpoint:

```text
GET /interruption/synchronized-blocked
```

The service keeps a monitor, starts the worker so that the worker falls into `BLOCKED`, then call `interrupt()` when the worker still hasn't gotten the monitor.

Points to observe:

```text
state before interrupt = BLOCKED
state immediately after interrupt = BLOCKED
interrupt flag = true
```

After the service release monitor:

```text
Worker gets monitor
→ still observe interrupt flag = true
→ worker ends
```

**Final Thoughts** interrupt signals can exist while Threads continue to suffer from `BLOCKED`; the ability to "wake up" depends on the operation Thread is waiting for.
