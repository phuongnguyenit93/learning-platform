`newCachedThreadPool()` capable of expanding the number of platform workers when the task comes quickly and there are no free workers.

If the workload block is long and the submission rate is high, the number of native threads can increase dramatically.

Consequences may include:

- increased memory;
- increased context switching;
- scheduler overhead;
- may eventually encounter an error creating a new native Thread.

Cached pools should not be considered "self-optimal pools should always be safe".

### Platform Thread: memory and context-switching cost

Platform Thread is not free. A live Thread may include:

- native/JVM bookkeeping;
- stack reservation/commit depending on JVM/OS/configuration;
- Scheduling State;
- reachable references from the stack or ThreadLocal.

So don't reasoning type:

```text
1 Thread is quite light
→ 100,000 platform threads is also only 100,000 times "quite light"
→ is definitely fine
```

CPU cores are also finite. When the number **runnable** Platform Threads are much larger than the number of cores:

```text
Multiple runnable threads
        ↓
OS/JVM scheduler split CPU time
        ↓
execution context is passed back and forth
        ↓
Add Scheduling/context-switch overhead
+ Cache locality may deteriorate
        ↓
Throughput/tail latency can be worse
```

Context switches themselves are not bugs and are not always equally expensive. Threads that are blocking are also different from continuous runnable threads. So don't use a "N threads are too many" number for every machine/workload.

When thread pressure is suspected, look at thread count/state, CPU, scheduler/OS metrics, and JFR/profiler instead of conferring from the configuration alone `maxPoolSize`.

This is also why Virtual Thread in the following chapter focuses on reducing the cost of the thread-per-task model for proper workload blocking; it does not infinite CPU core or downstream resources.
