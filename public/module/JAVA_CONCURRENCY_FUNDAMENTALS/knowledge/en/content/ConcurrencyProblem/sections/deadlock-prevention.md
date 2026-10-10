The classic deadlock requires four conditions at the same time, often called **Coffman conditions**:

1. **Mutual exclusion**: Resource has only one owner at a time.
2. **Hold and wait**: Thread holds this resource while waiting for another resource.
3. **No preemption**: The resource is not forcibly removed from the current owner.
4. **Circular wait**: exists a waiting loop A → B → ... → A.

It is not always possible to eliminate the first three conditions. A pragmatic strategy is to break the **Circular Wait** by **Global Lock Ordering**.

For example, if the entire application agrees:

```text
everywhere needs both Lock A and Lock B
→ always acquire A first
→ then acquire B
```

then you can't write another code path to acquire `B → A`.

References:

```text
ConcurrencyProblemController#deadlockPrevention()
GET /concurrency/problem/deadlock-prevention
```

Experiment has two workers competing with two locks, but they both use the following order:

```text
A → B
```

Expected results:

```text
completedWorkers = 2
circularWaitPossibleByDesign = false
workersTerminated = true
```

**Final Thoughts** `tryLock(timeout)` is a way to escape the dangerous wait; **consistent lock ordering** is a design way to eliminate circular-wait dependency in the first place.
