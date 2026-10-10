`ThreadFactory` allows control over how worker Threads are created, especially useful for:

- thread name prefix;
- Daemon Policy when really needed;
- uncaught exception handling;
- observability/thread dump.

Names like:

```text
payment-worker-1
payment-worker-2
```

much more useful than `pool-7-thread-3` when debugging production.
