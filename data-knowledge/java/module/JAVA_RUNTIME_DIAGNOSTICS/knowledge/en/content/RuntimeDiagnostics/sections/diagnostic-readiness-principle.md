Important runtime evidence can be transient. Restarting may release the heap, remove lock state, terminate threads, discard crash context, or rotate away useful logs. Diagnostic capability therefore needs to be prepared **before** the incident.

A useful operational baseline commonly includes:

- knowing the exact JDK/JVM version and startup flags;
- having retention and rotation rules for JVM and application logs;
- considering GC logging appropriate to the environment;
- configuring `-XX:+HeapDumpOnOutOfMemoryError` and `-XX:HeapDumpPath=...` when the storage budget allows it;
- considering continuous JFR when pre-incident event history is valuable;
- ensuring operators can access the correct process with the required permissions;
- knowing where artifacts will be written and whether enough disk space exists;
- keeping timestamps comparable across application logs, JVM logs, and monitoring systems.

Oracle's JDK troubleshooting guidance explicitly recommends preparing heap dumps for `OutOfMemoryError`, GC logging, and continuous flight recording as useful troubleshooting readiness measures. This does not mean that every production JVM should enable every facility with the same settings. Collection policy should reflect storage, data-handling, and runtime-cost constraints.

A small pre-incident checklist prevents a large amount of wasted time:

```text
Which JVM?
Which PID/container?
Where are the JDK tools?
Who can attach?
Where will artifacts be written?
How much disk is available?
Which timezone do timestamps use?
What evidence disappears after restart?
```

Readiness turns troubleshooting into a repeatable workflow. During the incident, time can be spent interpreting evidence instead of discovering that the process cannot be accessed or that the filesystem cannot hold the required dump.
