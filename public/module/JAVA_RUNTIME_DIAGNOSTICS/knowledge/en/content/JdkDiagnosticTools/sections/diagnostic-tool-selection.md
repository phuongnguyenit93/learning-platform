Tool selection should start from the **question**, not from the name of a command.

| Question | First evidence to consider |
| --- | --- |
| Which JVM is running and with which options? | `jcmd -l`, `VM.version`, `VM.command_line`, `VM.flags` |
| Is the application hung or are requests not making progress? | Repeated `Thread.print`; virtual-thread-aware dump when needed |
| Is there evidence of deadlock or lock contention? | Thread dumps with lock information, compared across snapshots |
| Which object types occupy the heap? | `GC.class_histogram` |
| Do I need detailed object-retention relationships? | Heap dump |
| How are heap/GC signals changing over time? | GC logs, `jstat`, JFR |
| Is process memory growing while the Java heap does not explain it? | NMT if enabled; continue in Native Memory Diagnostics |
| Do I need a timeline of CPU, allocation, lock, or I/O events? | JFR |

The same symptom can require more than one source. “Memory is growing” should first be split:

```text
RSS/process memory increases
        ↓
Is the Java heap increasing?
  ├─ yes → histogram / heap dump / GC evidence
  └─ no  → native-memory evidence / OS evidence
```

A common mistake is to capture a heap dump merely because process memory is high. A heap dump describes the Java heap. If growth comes from JVM-native structures or a native library, that artifact may not answer the question.

Likewise, one thread dump is not a profiler. It can show where threads are at one instant, but if the question is “which method consumed CPU over the last 20 minutes,” sampling or event data such as JFR is a better fit.

Use this selection rule:

1. Write the question as something data can answer.
2. Decide whether you need a snapshot or a timeline.
3. Choose the smallest artifact that contains enough information.
4. Check impact and permissions.
5. Escalate to heavier evidence only when current data cannot separate the hypotheses.

This is why the module begins with diagnostic reasoning before introducing individual tools.
