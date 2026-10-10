Common interpretation failures include:

**RUNNABLE means “using CPU”**  
Not necessarily. Correlate with CPU samples or OS/JFR evidence.

**WAITING or BLOCKED always means a bug**  
Many waits are expected by design.

**One dump proves a thread is stuck**  
A single snapshot lacks the time dimension.

**Many threads automatically means a problem**  
Large virtual-thread counts can be normal; thread type and workload matter.

**Reading only thread names**  
Names may be reused or framework-generated. Stack and context are more useful.

**No deadlock means liveness is healthy**  
Starvation, I/O stalls, and executor saturation may still exist.

**Using ThreadMXBean to count virtual threads**  
In Java 21 its management scope is platform threads.

When the question changes from “where are threads waiting?” to “is the synchronization design correct?”, hand off to the Concurrency curriculum.
