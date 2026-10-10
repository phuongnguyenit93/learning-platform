Runtime Diagnostics sits next to several domains, so it is important to know **where deeper ownership moves elsewhere**.

**JVM internals** explain the underlying mechanism. When a GC log shows long pauses, diagnostics helps establish when they happened, how often they occurred, and whether they align with the symptom. Collector algorithms, allocation mechanics, or JIT strategy belong to the JVM module.

**Concurrency** owns semantics and correctness. A thread dump can show a held monitor, many `BLOCKED` threads, or a deadlock cycle. The Java Memory Model, happens-before rules, synchronization design, and the correctness of a fix belong to Java Concurrency.

**Instrumentation** actively changes or augments runtime behavior, for example through Java Agents and bytecode transformation. This module primarily uses observation capabilities already exposed by the JDK/JVM. When the problem requires transforming classes to insert probes, the work has crossed into the Instrumentation boundary.

**Observability platforms** provide large-scale collection and analysis of metrics, logs, traces, and often vendor-specific runtime data. This module focuses on JDK/JVM diagnostic primitives and reasoning from evidence rather than on telemetry-platform architecture.

Keep this relationship in mind:

```text
JVM / Concurrency
→ explain mechanisms

Runtime Diagnostics
→ observe evidence and troubleshoot

Instrumentation
→ actively modify or insert observation

Observability platform
→ collect, store, and analyze telemetry at system scale
```

Real incidents often cross these boundaries. You might detect a problem in a metric, use `jcmd` to capture thread evidence, move to JVM knowledge to understand GC behavior, and then use Concurrency knowledge to repair locking. The boundary exists so each topic retains clear ownership, not because production troubleshooting stays inside one box.
