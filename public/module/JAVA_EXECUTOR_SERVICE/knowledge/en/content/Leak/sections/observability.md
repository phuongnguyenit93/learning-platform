Signs to watch:

- live thread count increases over time;
- pool count/worker count increases without going down;
- queue depth increases continuously;
- increased memory with backlog;
- CPU increase due to busy loop/context switch;
- prolonged shutdown/deploy;
- duplicate scheduled execution.

Useful Tools:

- thread dump;
- JFR/JDK tooling;
- executor metrics;
- queue depth metrics;
- application logs with thread name;
- OS/container metrics.

### Thread dump diagnostic workflows

Thread dumps are most useful when they're used to answer specific questions, not just taking a file and counting the number of lines.

An actual workflow:

```text
1. Detect an abnormal increase in live thread count
        ↓
2. Shoot multiple thread dumps at intervals
        ↓
3. Group by Thread Name/Pool Prefix
        ↓
4. View Thread.State and Stack Trace Iterations
        ↓
5. Identify the Thread/Pool Creator
        ↓
6. Reconciliation of queue depth, executor metrics, request rate
        ↓
7. Lifecycle test: shutdown/cancel/timeout/cleanup
```

A single dump is just a snapshot. Multiple snapshots help differentiate:

```text
Threads are temporarily busy
vs
Thread is kept alive for an unusually long time
```

### Read Thread.State properly

Some common patterns:

| State/pattern | Questions to ask |
| --- | --- |
| Multiple `RUNNABLE` Same Stack | Is there a busy loop, CPU hot path, or contention outside of the JVM? |
| Multiple `BLOCKED` with monitor | Who is keeping the monitor? Is the critical section too big? |
| Multiple `WAITING/TIMED_WAITING` in Executor | Is this a normal idle worker or a pool without owner/lifecycle? |
| Thread name prefix keeps increasing | Are you creating a new pool by request/job? |
| Stack keeps the same application object/context | Does ThreadLocal/task/reference have a longer lifecycle than intended? |

`WAITING` Not automatically means leak. A pool worker who lives for a long time and waits for a queue can be perfectly normal if the pool is resource-owned and has a clear lifecycle.

On the contrary, the thread count increases steadily even though the request rate returns to normal, which is a much stronger signal.

### Combining thread dumps with executor metrics

If there are executor metrics, they should be read together:

```text
poolSize
activeCount
queueSize
completedTaskCount
rejectionCount
```

For example:

```text
poolSize is stable
activeCount is always max
queueSize increases continuously
```

Often suggest saturation/backlog rather than thread leak.

While:

```text
Stable Request Rate
but the number of new pools/thread name prefixes keeps increasing.
```

Suggest an ownership/lifecycle bug in the creation of the executor.

### Practical Tooling

Depending on the environment, you can use:

- `jcmd <pid> Thread.print`;
- `jstack <pid>`;
- Java Flight Recorder / JDK Mission Control;
- Spring Boot Actuator metrics if the executor is instrumental;
- container/OS process metrics.

The ultimate goal is not to find "which thread looks strange", but to connect the thread:

```text
Symptom
→ resource
→ owner
→ missing/incorrect lifecycle rule
→ fix
```
