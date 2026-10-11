With `ThreadPoolExecutor`, when calling `execute(task)`, the core mental model is:

```text
worker count < corePoolSize ?
        ├─ yes → create a core worker to run the task
        └─ No
            ↓
        Try Enqueue Task
            ├─ Successful → Waiting Task in Queue
            └─ queue full
                ↓
        worker count < maximumPoolSize ?
            ├─ yes → create additional workers
            └─ no → rejection policy
```

This is different from the sentence:

> queue is full `execute()` Block the caller yourself until there is space.

`ThreadPoolExecutor.execute()` There is no such contract. If you want to backpressure the caller, you need to choose the appropriate policy/architecture.

### Demo flow

References:

```text
ThreadPoolController#executorFlow()
GET /thread-pool/executor-flow
```

Demo pools use small configurations:

```text
core = 1
max = 2
queue = 1
AbortPolicy
```

Tasks are retained by latch for observation in turn:

```text
Task 1 → Core Worker
Task 2 → queue
Task 3 → the 2nd worker because the queue is full
task 4 → rejected
```

**Final Thoughts** `maximumPoolSize` There is only a chance to promote when Queue no longer accepts new tasks.
