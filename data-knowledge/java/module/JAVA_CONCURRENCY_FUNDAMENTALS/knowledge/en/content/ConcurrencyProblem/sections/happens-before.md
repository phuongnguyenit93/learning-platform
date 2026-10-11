Happens-before is not simply "A happens before B clockwise".

If action A happens-before action B, then the effects of A are guaranteed to be visible to B according to the Java Memory Model.

Some foundational rules:

### Program order

In a Thread, the previous action happens—before the subsequent action follows program order semantics.

### Thread start rule

Actions that occur first:

```java
thread.start();
```

happens-before Thread actions are started.

### Thread join rule

Every action in the Thread worker happens-before code continues after another Thread `join()` successful workers.

### Monitor rule

Unlock on a monitor happens-before locking that monitor later.

### Volatile rule

Write to a volatile variable happens—before a subsequent read of the volatile variable itself according to the JMM rule.

### Transitivity

If:

```text
A happens-before B
B happens-before C
```

then:

```text
A happens-before C
```

### Higher-level java.util.concurrent also carries memory guarantees.

Happens-before doesn't stop at `synchronized`, `Volatile`, `start()` and `join()`.

The abstraction in `java.util.concurrent` Build a higher-level guarantee on top of the same memory model. Some edges are very realistic:

```text
actions before Executor.execute/submit(task)
→ happen-before actions in a task when the task starts running

Actions of Asynchronous Computation
→ happen-before code after Future.get() succeeds in another thread

actions before CountDownLatch.countDown()
→ happen-before actions after await() success

actions before Semaphore.release()
→ happen-before actions after successful acquire() on the same synchronizer

Put/Access via Concurrent Collection
→ have a publication guarantee defined by the API for that element
```

This is very important about mental models: use `Executor`, `Future`, synchronizer, or concurrent collection doesn't mean the programmer leaves JMM; those APIs provide higher-level synchronization edges so that programmers don't have to build everything themselves using volatile/monitors.

### Demo start/join

References:

```text
ConcurrencyProblemController#startJoinHappensBefore()
```

Endpoint:

```text
GET /concurrency/problem/happens-before-start-join
```

Experiment with flow:

```text
request thread write beforeStart = 7
        ↓
worker.start()
        ↓
worker read beforeStart
worker writtenByWorker = 42
        ↓
worker.join()
        ↓
request thread read writtenByWorker
```

Expected results:

```text
workerObservedBeforeStart=7
parentObservedAfterJoin=42
```

**Final Thoughts** `start()` and `join()` not only coordinate the lifecycle. They also carry a memory-consistency guarantee.
