Diagnostic readiness at the tool level means that **artifacts can be created at the right time, in the right place, and remain usable after the incident**.

An operational design should decide in advance:

- a directory dedicated to diagnostic artifacts;
- storage limits and cleanup/retention behavior;
- write permissions for the JVM process;
- a filename convention containing service, instance, PID, and timestamp;
- GC-log rotation;
- the heap-dump location for `OutOfMemoryError`;
- a continuous-recording policy when JFR is used;
- how large artifacts will be moved off the host without saturating disk or network during an incident.

Example startup options:

```text
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/myapp/heapdump.hprof
-Xlog:gc*:file=/var/log/myapp/gc.log:time,uptime,level,tags:filecount=5,filesize=20M
```

These demonstrate the shape of the configuration; paths and retention values must fit the deployment. If several JVMs write to one fixed filename, the design must also prevent collisions.

Heap dumps require particular planning. Oracle labels `GC.heap_dump` as high impact, and the resulting file can be very large. Before capturing one, verify:

```text
free disk
→ output path
→ permission
→ acceptable pause/I/O impact
→ how the artifact will be protected and transferred
```

GC logs and JFR are valuable because they preserve **history before the failure**, while thread dumps and histograms are commonly collected after the symptom has already appeared.

Readiness does not mean enabling every option. It means having a minimal evidence set that matches important failure modes and knowing exactly how to collect deeper evidence when required.
