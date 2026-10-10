# Interruption & Cooperative Cancellation in Java

This section learns how to **require a Thread to stop controlled.**.

The most important mental model:

```text
interrupt()
    ≠ kill thread

interrupt()
    = Send signal interruption
      Let the running code cooperate on its own
```

After this part, it is necessary to answer:

- `interrupt()` what to actually do.
- Why do busy loops have to actively check interrupt flags?
- `isInterrupted()` Others `Thread.interrupted()` where.
- Why `sleep()`, `wait()` and `join()` Throwable `InterruptedException`.
- Why interrupt flags often return `false` When `InterruptedException` are thrown.
- When to restore interrupt status.
- Why cleanup should be in `finally`.
- What states cannot be escaped by just `interrupt()`.
- `Volatile Boolean Stop` Others `interrupt()` at what point when the worker is blocking.
