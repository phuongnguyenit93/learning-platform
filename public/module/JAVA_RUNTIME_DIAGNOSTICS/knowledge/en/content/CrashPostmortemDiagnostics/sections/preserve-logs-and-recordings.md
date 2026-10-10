Rare incidents are usually reconstructed from several sources. Before a restart, preserve the evidence that may disappear:

- application logs and JVM/GC logs for the relevant time window;
- a continuous recording or freshly dumped JFR file;
- several thread dumps if the process still responds;
- a heap dump or histogram for a memory problem;
- NMT summary/diff output when NMT was enabled;
- fatal-error logs and core dumps after a crash;
- command line, runtime version, environment, and recent deployment timing.

Oracle's troubleshooting guidance recommends preparing these capabilities before an incident, including core-file readiness when appropriate, HeapDumpOnOutOfMemoryError, continuous Flight Recording, GC logging, and managed remote monitoring.

The operational rule is **preserve first, restart second** when the service objective allows it. Restarting may restore availability while destroying thread state, recording buffers, process memory, and other transient clues.

Treat dumps as production data. Heap and core files can contain credentials, request payloads, PII, or key material, so access and retention often need stronger controls than ordinary logs.
