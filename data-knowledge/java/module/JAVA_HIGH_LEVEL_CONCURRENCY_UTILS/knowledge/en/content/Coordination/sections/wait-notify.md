`Object.wait()` is only called when Thread is holding the corresponding monitor.

When calling `wait()`:

```text
Thread Holder Monitor
→ wait()
→ release monitor
→ to the wait set
```

`notify()` wake up a waiter; `notifyAll()` Wake up all the waiters so they compete to get the monitor back.

Three rules are easy to mistake:

1. `wait()`, `notify()` and `notifyAll()` must be operated when the caller is in possession of the corresponding monitor; otherwise, it can be received `IllegalMonitorStateException`.
2. `wait()` release monitor in the standby timeout, but `Thread.sleep()` **No release monitor** just because Thread is sleeping.
3. `notify()`/`notifyAll()` do not transfer the monitor immediately to the waiter. Waiters who are awakened still have to wait for the notifier to leave `synchronized`/release monitor and then you can reacquire and continue.

### Always wait with a predicate loop

Correct Pattern:

```java
synchronized (monitor) {
    while (!condition) {
        monitor.wait();
    }
    condition is correct
}
```

Not used `if` just to test once. Thread can wake up but the condition isn't suitable, and Java allows spurious wakeup.

References:

```text
CoordinationController#waitNotify()
GET /coordination/wait-notify
```

Experiment makes sure the waiter actually enters the wait set before the notifier updates the predicate and calls `notifyAll()`.

The demo uses three waiters to observe two steps separately:

```text
notify()
→ only one waiter is awakened to retest the predicate
→ predicate is still false, so the waiter returns to wait

ready = true + notifyAll()
→ the entire waiter is awakened
→ each Thread competes to acquire the monitor
→ all done because the predicate was true
```

**Final Thoughts** The notification is just a "check again" signal; the predicate decides whether to continue or not.
