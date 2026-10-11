Concurrency model and network API influence each other, but they are not the same decision.

Classic blocking code often has a direct control flow:

~~~text
accept/connect
→ read
→ process
→ write
~~~

Before virtual threads, one blocking platform thread per connection could become expensive at very high concurrency. Selector-based non-blocking I/O multiplexes many channels over fewer threads, but in exchange the application owns readiness handling and per-connection state more explicitly.

Java 21 changes that trade-off: a virtual thread blocked on supported network I/O can suspend without holding its carrier thread. Therefore:

~~~text
many concurrent connections
≠ automatically require Selector
~~~

Choose **blocking + virtual threads** when:

- the workflow is naturally sequential;
- thread-per-task keeps code clearer;
- readiness-level control is not required.

Choose **Selector/event-driven I/O** when:

- the architecture is already event-loop based;
- explicit readiness multiplexing/control is valuable;
- the application intentionally owns connection state machines.

Choose **asynchronous channels** when completion-style operations fit the surrounding architecture.

Do not decide this from a synthetic microbenchmark alone. Throughput, latency, memory, scheduling behavior, and code complexity all matter in the real workload.
