Tasks are rejected when the executor is still RUNNING but no longer has the appropriate worker/queue capacity, or when the executor has shut down.

Default policies:

| Policy | Behavior |
| --- | --- |
| `AbortPolicy` | Throw `RejectedExecutionException` |
| `CallerRunsPolicy` | Caller Runs Task Manually if Executor Hasn't Shut Down |
| `DiscardPolicy` | Silent Task Drop |
| `DiscardOldestPolicy` | Remove the task at **Head of Work Queue** then try submitting a new task again |

### CallerRunsPolicy as a form of feedback/backpressure

References:

```text
ThreadPoolController#callerRuns()
GET /thread-pool/caller-runs
```

The pool is filled intentionally. The next task runs right on the caller thread.

Points to observe:

```text
fallbackThread = HTTP/caller thread
```

Callers are busy handling tasks themselves, so the submission speed is reduced. This is feedback pressure, not self-blocking queues `execute()`.

`DiscardPolicy` and `DiscardOldestPolicy` It should only be used when the semantics that lose the task are clearly understood and accepted.

### DiscardPolicy and DiscardOldestPolicy: Losing tasks is business semantics

`DiscardPolicy` Drop a new task without throwing an exception. `DiscardOldestPolicy` Call by Semantics **Head Work Queue** then try submitting a new task again.

With FIFO queue as `LinkedBlockingQueue` In this experiment, the head is also the task that has been in the queue the longest. But don't translate that into a general contract: if the work queue has other ordering, such as priority ordering, the head depends on the semantics of the queue, not necessarily the "oldest over time" task.

This means that they are not just "technical handling when the pool is full". They change **Which tasks are allowed to disappear**.

References:

```text
ThreadPoolController#discardPolicies()
GET /thread-pool/discard-policies
```

The experiment fills the pool/queue with a latch and observes:

```text
DiscardPolicy
→ new task does not run and there is no exception

DiscardOldestPolicy
→ head of LinkedBlockingQueue in the demo does not run
→ new task replaced and executed
```

**Final Thoughts** Only choose the Discard policy when the application has a clear rule on dropping data/tasks; if losing the task is unacceptable, this policy is not suitable.
