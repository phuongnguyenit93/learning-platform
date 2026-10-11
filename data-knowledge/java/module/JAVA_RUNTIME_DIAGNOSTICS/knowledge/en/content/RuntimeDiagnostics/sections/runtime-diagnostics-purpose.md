Runtime diagnostics is the process of observing a running JVM, or the artifacts it leaves behind, to answer a specific question about an incident. The goal is not to run as many tools as possible. The goal is to turn an external symptom into evidence strong enough to test a hypothesis.

The following are still only **symptoms**:

- an API suddenly becomes slow;
- the process consumes high CPU;
- process memory keeps increasing;
- requests appear to hang;
- an `OutOfMemoryError` occurs;
- the JVM crashes.

Each symptom has several possible causes. High latency can come from blocked threads, lock contention, GC pauses, I/O, a downstream dependency, or hot application code. Runtime diagnostics therefore follows a reasoning chain such as:

```text
Symptom
    ↓
What is happening inside the JVM?
    ↓
What evidence can we observe?
    ↓
Which hypothesis fits that evidence?
    ↓
What additional data would confirm or reject it?
```

Evidence in this module includes thread dumps, class histograms, heap dumps, GC logs, JFR recordings, Native Memory Tracking output, MXBean/JMX data, and crash artifacts. Each source exposes only part of the runtime. No single artifact explains every class of failure.

It is important to separate **mechanism** from **diagnosis**. The JVM module explains how heap memory, GC, JIT compilation, and runtime execution work. The Concurrency modules explain synchronization, happens-before, and correctness. Runtime Diagnostics consumes those mental models to interpret observable evidence when a system misbehaves.

By the end of this module, you should be able to start from a symptom, choose an appropriate source of evidence, collect it at a reasonable cost, and build a conclusion that can be tested rather than guessed.
