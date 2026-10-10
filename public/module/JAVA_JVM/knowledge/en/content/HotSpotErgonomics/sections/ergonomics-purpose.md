A JVM implementation must run across many machines and workloads. If every application had to choose its collector, heap sizing, and compiler policy manually before it could run well, configuration would be both complex and fragile.

**Ergonomics** is the HotSpot idea of selecting defaults and using heuristics based on platform characteristics, available resources, and runtime behavior.

```text
machine + JVM version + workload signals
        ↓
ergonomic defaults / adaptive heuristics
        ↓
runtime behavior
```

Ergonomics does not mean the defaults are optimal for every SLO. It provides a sensible baseline before evidence justifies tuning.
