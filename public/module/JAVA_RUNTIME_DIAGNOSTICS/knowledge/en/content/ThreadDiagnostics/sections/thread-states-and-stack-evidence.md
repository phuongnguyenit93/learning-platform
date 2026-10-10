Java Thread.State provides the first vocabulary for interpreting a dump:

- **RUNNABLE**: executing or runnable from the JVM's perspective; not proof that it is currently consuming CPU;
- **BLOCKED**: waiting to acquire a monitor for synchronized code;
- **WAITING**: waiting indefinitely through mechanisms such as Object.wait, Thread.join, or park;
- **TIMED_WAITING**: waiting with a timeout;
- NEW/TERMINATED are less common in ordinary live dumps.

The stack trace supplies the current call path. When many threads share one stack, ask whether that is an **expected wait point** or a bottleneck.

A consumer WAITING in a queue take can be perfectly normal when there is no work. Hundreds of request threads repeatedly BLOCKED on the same application lock is much stronger contention evidence.

Do not map state directly to “problem.” Read state together with workload, stack, and time.
