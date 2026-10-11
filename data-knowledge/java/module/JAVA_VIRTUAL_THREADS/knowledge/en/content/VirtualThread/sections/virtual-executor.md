Java 2. provides:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    executor.submit(task);
}
```

Each task is executed in a new virtual thread.

There is no need to pool virtual threads in the way of traditional platform thread pools, as virtual threads are designed to create as much and not reuse as worker pools to save OS threads.

References:

```text
VirtualThreadController#blockingScale()
GET /virtual-thread/blocking-scale
```

The demo compares a small amount of sleep-based blocking tasks:

- fixed platform pool has .0 workers;
- virtual-thread-per-task executor.

Timing is for illustrative purposes only, **Not a standard benchmark**. `sleep` used to clarify the concurrency shape, not to conclude the production performance.
