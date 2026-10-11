An application can fail because of process/native resource pressure even when the Java heap has not reached `-Xmx`.

Examples include class-metadata pressure, inability to create more native threads, failed direct/native allocations, or exceeding a container memory limit.

The failure may still surface as an `OutOfMemoryError` with a particular message, or the operating system/container may terminate the process.

Therefore:

```text
OutOfMemoryError
→ a failure category, not one universal root cause
```

Root cause requires evidence from the error, process limits, and diagnostic tools.
