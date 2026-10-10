Live diagnostics works while a JVM is healthy enough to answer diagnostic requests. When the process has crashed, has been forcibly terminated, cannot be attached to safely, or must be restarted to restore service, the investigation shifts to **postmortem diagnostics**: analyzing state that was preserved at or before the failure.

The key distinction is:

- live diagnostics can still ask the JVM for new information;
- postmortem analysis can only reason from captured artifacts;
- therefore postmortem quality depends heavily on preparation such as core dumps, fatal-error logs, OOME heap dumps, GC logs, and continuous JFR.

A restart can erase the most useful transient evidence. Before restarting a problematic JVM, consider capturing thread state, a JFR dump, memory evidence, and current logs when doing so is safe and compatible with the service objective.

Postmortem is not a replacement for live diagnostics. It is the continuation of the same evidence-driven process after live state is no longer available or trustworthy.
