**Contention** means threads compete for a shared resource or lock. **Deadlock** is stronger: a set of threads forms a wait cycle so none of them can make progress.

Example:

~~~text
Thread A holds Lock 1 → waits for Lock 2
Thread B holds Lock 2 → waits for Lock 1
~~~

Thread dumps can reveal owners and waiters, and JDK diagnostic tooling can identify some deadlocks explicitly.

For contention:

- find many threads BLOCKED on the same monitor;
- identify the owner;
- inspect what the owner is doing;
- repeat the dump to see whether the relationship persists;
- correlate with JFR monitor/park events when duration and timeline matter.

No detected deadlock does not prove liveness is healthy. Starvation, external I/O waits, executor saturation, or logical livelock can stop useful progress without a lock cycle.
