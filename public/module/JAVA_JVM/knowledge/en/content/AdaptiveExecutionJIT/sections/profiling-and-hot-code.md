Runtime profiling gathers evidence about code that actually executes: frequently invoked methods, common branches, receiver types at call sites, and other signals chosen by the implementation.

The runtime uses that evidence to identify **hot code** worth optimizing.

This is powerful because:

```text
what source code permits
≠ what the workload actually does
```

Runtime information can support optimizations that would be unsafe or unprofitable without observed behavior.

Profiles can also change. Optimized code based on a runtime assumption therefore needs a safe path back when that assumption stops being true.
