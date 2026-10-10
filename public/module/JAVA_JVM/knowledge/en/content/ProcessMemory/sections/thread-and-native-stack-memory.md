Each platform thread requires process-level stack resources. A large platform-thread count can therefore consume significant memory even when each thread allocates almost nothing on the Java heap.

```text
N platform threads
× per-thread stack reservation
→ process virtual/native memory pressure
```

`-Xss` is a HotSpot/JVM-launcher control associated with thread-stack sizing, not a universal Java language rule.

Virtual threads use a different runtime architecture, but their scheduling and stack model belong to the Concurrency/Virtual Threads curriculum. The JVM lesson here is simply that thread count can affect total process memory.
