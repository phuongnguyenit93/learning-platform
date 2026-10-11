Notification is not proof that the condition is correct.

Pattern:

```java
synchronized (monitor) {
    while (!ready) {
        monitor.wait();
    }
}
```

Help to handle:

- spurious wakeup;
- many competitive waiters;
- The state may change before the waiter reacquires the monitor.

With `LockSupport.park()` also need a condition/cancellation loop. `park()` Can return for permit, interrupt or spurious return and do not throw `InterruptedException`; The caller must check the Interrupt Status/Predicate by himself.
