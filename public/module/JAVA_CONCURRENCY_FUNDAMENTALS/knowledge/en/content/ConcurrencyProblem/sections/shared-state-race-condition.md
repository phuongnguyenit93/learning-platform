### What is Shared Mutable State?

An object becomes a shared mutable state when:

```text
shared
→ multiple Threads can access the same object

mutable
→ object has a changeable state
```

For example:

```java
class Counter {
    int value;
}
```

If two Threads perform the same operation on `value`, the results may depend on how the operations alternate.

### Why is count++ not atomic?

`count++` It looks like an operation, but logically it's a read-modify-write sequence:

```text
read count
    ↓
count + 1
    ↓
write count
```

Two Threads can read the same old value and then write a new result based on that snapshot.

For example:

```text
Initial Count = 0

Thread A Read 0
Thread B reads 0

Thread A Record 1
Thread B Record 1

Sequential Expectation = 2
actual = 1
```

This is **Lost Update**.

### How is race condition different from race data?

**Race condition** is a problem of correctness: the true/false result depends on the alternating order of operations that the program has not controlled.

**Data race** Specific meaning in JMM: two Threads access the same variable, at least one access is write, and those two conflicting accesses are not ordered by happens-before.

For example:

| Code | Problem |
| --- | --- |
| Two Threads Together `count++` on the field `int` Normal, asynchronous | There is a data race and can be lost update |
| Two Threads Together `count++` on the field `Volatile int` | Read/write used to have volatile semantics, but compound increment still has race conditions |
| `get()` then `put()` separately on `ConcurrentHashMap` to increase counter | Collection protects each operation; check/read/update sequences can still race |

Therefore, **No Data Race Is Not Enough to Secure Every Atomic Business Operation**. The range of invariants to be protected should be determined.
Two endpoints `race-condition` and `volatile-not-atomic` Below helps to compare: both can be lost updates, although the Field's sync mechanism is different.

### Demo in module

Refer to the controller:

```text
ConcurrencyProblemController#raceCondition()
```

Endpoint:

```text
GET /concurrency/problem/race-condition
```

The experiment deliberately divides the increment operation into two phases:

```text
Thread A reading snapshot
Thread B reads snapshots
        ↓
Both are allowed to record
```

This coordination is only for race purposes **deterministic** for learning purposes.

Expected results:

```text
snapshotA=0
snapshotB=0
expectedSequentialResult = 2
actualResult = 1
lostUpdates = 1
```

**Final Thoughts** Race condition doesn't mean that the result is always wrong. It means that correctness depends on interleaving/timing that the code doesn't control.
