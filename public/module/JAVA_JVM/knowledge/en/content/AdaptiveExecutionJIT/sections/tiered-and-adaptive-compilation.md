Tiered compilation lets HotSpot balance startup, profiling quality, and peak optimization instead of forcing each method to jump directly from interpreted execution to maximum optimization.

```text
interpreter
→ fast/light compilation
→ richer profiling
→ highly optimized compilation
```

Exact levels and thresholds are implementation/version details. The durable mental model is:

- cold code deserves little compiler effort;
- warm/hot code may be promoted;
- profiling feedback influences decisions;
- code can be recompiled or deoptimized.

This is why JVM applications often have a **warm-up phase** before reaching steady-state performance.
