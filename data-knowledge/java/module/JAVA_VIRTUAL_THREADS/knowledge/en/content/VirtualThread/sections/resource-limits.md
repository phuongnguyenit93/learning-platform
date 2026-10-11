A lot of virtual threads can be created, but database connection pools, downstream APIs, file descriptors, and rate limits are still finite.

Therefore, it usually still needs a concurrency limiter like `Semaphore`.

References:

```text
VirtualThreadController#limitedResource()
GET /virtual-thread/limited-resource
```

The demo creates multiple virtual tasks but only puts up to 5 tasks in the critical external-resource section at the same time.

Implementation of special keeping rules:

```text
Only release permit if the acquire is really successful
```

Avoid bugs that increase permits when Threads are interrupted before acquire.
