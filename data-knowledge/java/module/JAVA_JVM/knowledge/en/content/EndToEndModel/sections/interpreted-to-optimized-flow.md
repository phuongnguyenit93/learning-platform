In HotSpot, a method can begin interpreted, gather profile data, and later be JIT compiled as it becomes hot.

```text
cold bytecode
→ interpreted
→ profiled
→ compiled
→ optimized
→ assumption invalid?
   └─→ deopt / recompile
```

This is a dynamic lifecycle rather than a single permanent transition.

One consequence is that JVM benchmarking needs warm-up and disciplined measurement. Startup/cold-path latency can differ significantly from steady-state behavior.
