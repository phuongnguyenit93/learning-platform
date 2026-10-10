Suitable for testing when:

- a lot of concurrent requests/tasks;
- the task is mainly waiting for I/O;
- want to keep an imperative/thread-per-task style;
- Downstream capacity has been reasonably limited.

Not defaulting is the best option when:

- pure CPU-bound workload;
- the concurrency is really low;
- bottlenecks located entirely downstream with small capacity;
- the code keeps monitor/pinned blocking for a long time on the Java version you are using.
