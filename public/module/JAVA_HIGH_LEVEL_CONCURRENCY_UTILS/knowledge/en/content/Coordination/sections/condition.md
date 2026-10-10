`Condition` Provide Condition Queue tied with Explicit `Lock`.

```java
lock.lock();
try {
    while (!ready) {
        condition.await();
    }
} finally {
    lock.unlock();
}
```

A `ReentrantLock` can create multiple `Condition`, useful when multiple groups of waiters wait for different predicates.

Varieties `wait/notify` requires ownership of the monitor, operations such as `await()`, `signal()` and `signalAll()` must be used when the Thread is on hold **associated Lock**. Otherwise, the implementation may throw `IllegalMonitorStateException`.

`Condition.await()` There is a mental model similar to the Monitor's Condition Wait:

```text
caller holding associated lock
→ await()
→ release Lock in the meantime
→ be signaled/interrupt/timeout
→ must reacquire the Lock before await() return/throw according to the contract
```

So the following code `await()` still running in the critical section until `finally` Call `unlock()`.

References:

```text
CoordinationController#condition()
GET /coordination/condition
```

Experiment creates two independent wait-sets on the same lock:

```text
dataAvailable → wake up data waiter
shutdownRequested → wake shutdown waiter
```

After `dataAvailable.signal()`, the shutdown waiter continues to wait until the main `shutdownRequested.signal()` called.

**Final Thoughts** `Condition` is an explicit-lock version of condition waiting; a predicate loop is still required.
