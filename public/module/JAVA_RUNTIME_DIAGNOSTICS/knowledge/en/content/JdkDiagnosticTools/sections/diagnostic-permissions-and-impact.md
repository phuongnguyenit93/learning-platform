Diagnostic commands operate close to the target process, so two questions always travel together: **are you allowed to attach**, and **is this operation safe at this moment**?

According to the JDK 21 documentation, `jcmd` must run on the same machine as the target JVM and normally requires the same effective user and group identity that launched the JVM. Containers, PID namespaces, security policies, and whether the image contains a full JDK can all affect process visibility and attach behavior.

Before running a command:

1. Confirm the PID and service instance.
2. Run `jcmd <pid> help <command>` to verify support and inspect its documented impact.
3. Check the output path and write permissions when a command creates a file.
4. Check disk and I/O headroom.
5. Decide whether the current symptom window is a state that must be preserved first.

Examples of documented HotSpot JDK 21 impact:

- `VM.flags`: low impact;
- `Thread.print`: medium, depending on the number of threads;
- `GC.class_histogram`: high, depending on heap size/content;
- `GC.heap_dump`: high, depending on heap size/content, and it can request a full GC unless the relevant option is used.

An impact label is not an SLA. “Medium” on a JVM with a few dozen threads is different from a process with a huge thread population; “high” on a 512 MB heap is different from a heap measured in tens of gigabytes.

Avoid broadcasting commands simply for convenience. `jcmd 0 <command>` can send a command to all available JVMs; doing that with a heavy operation can create an avoidable operational incident. Target the intended PID.

Finally, diagnostic artifacts can contain sensitive application data. Heap dumps contain object contents, system properties can reveal configuration, and thread stacks can expose request/task names. Access, storage, and sharing of diagnostic data should follow the same production-data controls used elsewhere in the system.
