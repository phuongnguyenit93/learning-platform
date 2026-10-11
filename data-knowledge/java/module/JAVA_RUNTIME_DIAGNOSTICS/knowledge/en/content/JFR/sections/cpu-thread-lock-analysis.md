For CPU, threads, and locks, JFR gives a time-based view that complements thread snapshots.

**CPU samples** show stacks observed statistically while execution is sampled. They are evidence of hot paths, not nanosecond-perfect accounting.

**Thread and lock events** can reveal:

- park or block duration;
- monitor contention;
- synchronization context;
- virtual-thread pinning;
- whether contention overlaps the latency interval.

Typical flow:

~~~text
CPU/latency spike time
        ↓
select the matching JFR interval
        ↓
top execution stacks
        +
lock/park events
        ↓
correlate with request/log context
~~~

If the remaining question is about happens-before, lock correctness, or synchronization design, hand off to the Concurrency curriculum. JFR supplies runtime evidence, not the full correctness model.
