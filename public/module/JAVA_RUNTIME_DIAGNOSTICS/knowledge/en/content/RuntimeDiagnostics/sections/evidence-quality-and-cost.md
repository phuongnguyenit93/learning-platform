Diagnostic evidence differs not only in what it reveals but also in **collection cost** and in how much the act of collecting it can perturb the target process.

A useful mental model is a spectrum:

```text
process / flag information
        ↓
counters / logs / lightweight events
        ↓
thread dump
        ↓
class histogram
        ↓
heap dump or another very large artifact

usually lighter -------------------- usually heavier
```

This is only a guide. Actual impact depends on the JVM, number of threads, heap size, collector, machine load, and the specific command. For many diagnostic commands, `jcmd <pid> help <command>` reports an impact level.

For every evidence source, ask:

- **What question can it answer?** A thread dump is strong for execution and lock state but does not tell you which objects dominate the heap.
- **Is it a snapshot or a timeline?** A histogram is a snapshot; GC logs and JFR preserve events over time.
- **Can it pause or materially load the JVM?** Some heap operations can require a safepoint or full GC, and a heap dump can produce substantial I/O.
- **Is there enough storage for the artifact?** Heap dumps can be very large.
- **Can observation change the behavior?** On a process already constrained by CPU or I/O, a heavy operation can worsen the incident.

Evidence quality matters as much as detail. A technically correct snapshot taken after a restart can be useless because the failure state has disappeared. A modest continuous log can be more valuable than a very detailed artifact captured at the wrong time.

Start with low-impact evidence that can separate plausible hypotheses, then increase depth when necessary. More data is not automatically better evidence.
