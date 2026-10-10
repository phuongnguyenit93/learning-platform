Tuning without evidence often becomes a loop:

```text
latency is high
→ change a GC flag
→ change heap size
→ change compiler options
→ still do not know what caused the latency
```

Move to diagnostics when the questions become:

- Is the pause actually caused by GC?
- What are the allocation rate and live-set size?
- Where are threads blocked?
- Which native-memory category is growing?
- Is code compiling or deoptimizing unexpectedly?

JVM theory produces hypotheses. Runtime Diagnostics uses JFR, `jcmd`, GC logs, dumps, NMT, and metrics to test them.

Use the loop: **measure → explain → change → measure again**.
