# Concurrency Problems & Java Memory Model

This section answers the most important question before learning synchronization:

> Why can a piece of code that is correct when running a thread can be wrong when multiple threads are running at the same time?

Mental model throughout:

```text
Shared Mutable State
        ↓
Concurrent Access
        ↓
Atomicity / Visibility / Ordering problems
        ↓
Java Memory Model + Happens-Before
        ↓
Synchronization tools in the next chapter
```

After this section, it is necessary to distinguish:

- race condition and data race;
- atomicity and visibility;
- visibility and ordering;
- happens-before is a guarantee of the Java Memory Model, not a description of the CPU cache;
- `Volatile` resolve visibility/order but do not turn compound operations into atomic;
- Deadlock, LiveLock, and Starvation are all Liveness Problems but differ in their manifestations.
