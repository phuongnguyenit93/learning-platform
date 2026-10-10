Type formulas:

```text
CPU-bound → Ncpu range
I/O-bound → larger than Ncpu
```

is just the starting point.

Sizing production should be based on:

- arrival rate;
- service time;
- latency SLO;
- downstream capacity;
- memory for queued task;
- contention;
- behavior when overloading.

None `queueCapacity=500` or `maxPoolSize = Ncpu*2` True for every system.
