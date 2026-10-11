The worker pool is created once and then reused:

```text
parent context = USER_A
submit task 1
        ↓
worker-1 is created → inherit USER_A

parent context = USER_B
submit task 2
        ↓
still old worker-1
→ no new child Thread to inherit USER_B
```

References:

```text
ThreadLocalController#poolReuseProblem()
GET /context/pool-reuse-problem
```

Expected results:

```text
task1 = USER_A
task2 = USER_A
parent = USER_B
```

This is the stale context reused by the worker.
