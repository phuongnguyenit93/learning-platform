Not all diagnostic data is analyzed immediately on the JVM that is experiencing the incident. Three modes are common.

**1. Live diagnostics**

You query the running JVM and receive immediate output:

```bash
jcmd 12345 VM.flags
jcmd 12345 Thread.print -l
jcmd 12345 GC.heap_info
jstat -gcutil 12345 1000 10
```

The benefit is current state. The limitation is that state can change quickly and some operations have meaningful runtime impact.

**2. Artifact collection for later analysis**

You ask the JVM to write data to a file:

```bash
jcmd 12345 GC.heap_dump /diagnostics/heap.hprof
jcmd 12345 Thread.dump_to_file -format=json /diagnostics/threads.json
jcmd 12345 JFR.dump filename=/diagnostics/incident.jfr
```

The artifact can be moved to an analysis machine, attached to an incident record, or compared later. Protect it carefully because heap dumps and recordings can contain application data.

**3. Postmortem evidence**

Once the JVM has terminated, live commands are no longer possible. Investigation then depends on artifacts that already exist: fatal-error logs, core dumps, heap dumps, GC/application logs, and flight recordings. That workflow is covered in depth in the Crash/Postmortem chapter.

The connection between all three modes is **time**. If a failure lasts only 30 seconds, a heap dump captured ten minutes later may describe a different state. Record a timestamp, PID, host/container identity, and symptom window for each artifact.

Before restarting a JVM, ask:

```text
Which evidence exists only in the current process?
Which evidence is already durable?
What will restart destroy?
```

In a real incident, preserving the right evidence is often as important as knowing how to read a tool's output.
