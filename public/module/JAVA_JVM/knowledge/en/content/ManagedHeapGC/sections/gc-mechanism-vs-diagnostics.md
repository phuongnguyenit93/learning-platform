The JVM module explains **why garbage collection exists and how collector trade-offs work**. Production questions such as long pauses, allocation pressure, or suspected leaks require evidence.

```text
JVM
→ allocation / reachability / collector concepts / goals

Runtime Diagnostics
→ GC logging
→ heap histograms / heap dumps
→ JFR allocation events
→ evidence-driven troubleshooting
```

Do not tune from theory alone. The same symptom can come from allocation rate, live-set size, heap sizing, collector behavior, or a completely unrelated subsystem.

Theory creates hypotheses; diagnostics validates them.
