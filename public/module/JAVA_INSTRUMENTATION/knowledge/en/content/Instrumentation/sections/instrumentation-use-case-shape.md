Common use cases fall into a few families:

| Family | Typical instrumentation work |
| --- | --- |
| Profiling | inject timing/counters around selected execution points |
| Coverage | record which methods, branches, or lines execute |
| Monitoring / APM | add probes around HTTP, database, messaging, or business boundaries |
| Event logging / tracing | emit events or propagation hooks without requiring application code changes |

Agents can also use redefine/retransform for debugging and runtime tooling. However, “can replace bytecode” does not imply “should arbitrarily change business semantics.” The Java SE Instrumentation contract highlights benign tools whose changes are primarily additive and observational.

Keep the ownership boundary clear:

- **Instrumentation** owns code injection/transformation and agent lifecycle.
- **Runtime Diagnostics** owns interpretation of dumps, JFR, GC evidence, and troubleshooting workflows.

A profiler may collect data through Instrumentation, but turning that data into a diagnostic conclusion belongs to a different layer.
