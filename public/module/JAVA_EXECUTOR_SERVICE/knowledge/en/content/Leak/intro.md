# Thread/Pool Lifecycle & Leak

A leak in a concurrency is usually not a simple Java object leak. A resource with a longer lifecycle than the application's intended life can be held by Thread, native stack, queue, task, or context.

Rules of the learning module:

```text
unsafe pattern
→ observed within bounded range
→ cleanup right in the same experiment
```

No endpoint is created, but each call leaves an infinite live Thread/pool.
