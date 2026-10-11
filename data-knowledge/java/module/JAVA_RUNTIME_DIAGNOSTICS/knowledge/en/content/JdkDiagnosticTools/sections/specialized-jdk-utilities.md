The specialized JDK utilities still matter because you will encounter them in runbooks, older documentation, and workflows where their output is convenient. The key is to know **which question each tool answers**.

| Tool | Primary role | Example |
| --- | --- | --- |
| `jps` | List observable HotSpot JVMs in the local VM namespace | `jps -lv` |
| `jstack` | Print Java thread stack traces; `-l` adds lock information | `jstack -l 12345` |
| `jmap` | Heap histograms, heap dumps, and selected heap/class-loader statistics | `jmap -histo 12345` |
| `jinfo` | Inspect system properties and VM flags; some flags may be manageable depending on the JVM | `jinfo -flags 12345` |
| `jstat` | Sample HotSpot performance counters over time | `jstat -gcutil 12345 1000 10` |

Oracle marks `jstack`, `jmap`, and `jinfo` as experimental/unsupported in JDK 21 tool documentation and recommends `jcmd` for equivalent operations when available. For example:

```text
jstack -l <pid>
≈ when appropriate, prefer jcmd <pid> Thread.print -l

jmap -histo <pid>
≈ when appropriate, prefer jcmd <pid> GC.class_histogram

jmap -dump:format=b,file=heap.hprof <pid>
≈ when appropriate, prefer jcmd <pid> GC.heap_dump heap.hprof
```

`jstat` has a somewhat different role. It reads HotSpot instrumentation counters and is useful for observing **trends**:

```bash
jstat -gcutil 12345 1000 10
```

This command takes 10 samples at one-second intervals. Columns describing GC counts, GC time, and region/generation utilization can show that runtime behavior is changing. These counters are implementation-oriented, however, so a single `jstat` column should not be promoted directly into a root-cause claim without correlating it with the collector, logs, and the actual symptom.

`jps` also deserves caution. The local VM identifier often matches the operating-system PID, but automation should not assume identical process visibility across hosts and containers.

Treat these utilities as specialized windows into the JVM, with `jcmd` as the preferred general diagnostic surface for modern HotSpot.
