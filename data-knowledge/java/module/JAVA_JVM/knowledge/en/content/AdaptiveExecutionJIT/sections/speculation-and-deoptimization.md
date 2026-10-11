Runtime optimizers can specialize code using assumptions derived from profiling. For example, a call site may observe only one receiver type for a long period.

If that assumption enables a profitable optimization, HotSpot can compile specialized code. If later execution invalidates the assumption, the JVM must return to a safe execution state through **deoptimization**.

```text
profile assumption
→ optimized compiled code
→ new runtime behavior invalidates assumption
→ deopt
→ interpreter / less-optimized state
→ possible recompilation
```

Speculation enables stronger optimization while also explaining why latency or throughput can shift across different application phases.
