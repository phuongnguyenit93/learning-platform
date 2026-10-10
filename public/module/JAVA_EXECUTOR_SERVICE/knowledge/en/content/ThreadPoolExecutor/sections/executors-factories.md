### newFixedThreadPool(n)

Fixed number of workers. This factory uses unbounded `LinkedBlockingQueue`, so the backlog can grow large if producers are faster than long-term consumers.

### newCachedThreadPool()

Pools can increase workers drastically and use `SynchronousQueue`. Suitable for short tasks in some workloads but need to understand the risk of creating multiple platform threads.

### newSingleThreadExecutor()

A worker, which helps serialize tasks according to the executor's queue.

The factory also uses an unbounded queue according to a small application capacity configured by the caller. If the producer submits faster than a single worker processes for a long time, the backlog/memory/latency can still increase dramatically. "One worker" does not mean "self-backpressure".

### newScheduledThreadPool(n)

Supports delayed/periodic execution.

Don't choose a factory just because of the name; in production, it is often necessary to understand the queue, worker limit, and rejection behavior.

References:

```text
ThreadPoolController#fixedPoolReuse()
GET /thread-pool/fixed-pool-reuse

ThreadPoolController#executorFactories()
GET /thread-pool/executor-factories
```

`fixed-pool-reuse` send multiple tasks but only observe up to two worker names, indicating that the worker is reused instead of creating a thread for each task.

`Executor-Factories` Run four bounded experiments to observe the Semantics represented:

```text
newFixedThreadPool(2)
→ two workers keep the task running
→ Extra Tasks Waiting for Queue

newCachedThreadPool()
→ there is no idle worker, many tasks can increase the pool of workers at the same time.

newSingleThreadExecutor()
→ tasks are serialized according to the submission order of the queue

newScheduledThreadPool(1)
→ task is run after a delay without writing a sleep-loop yourself.
```

Executors are shutdown/awaitTermination in the experiment itself so that the request does not leave the worker alive.
