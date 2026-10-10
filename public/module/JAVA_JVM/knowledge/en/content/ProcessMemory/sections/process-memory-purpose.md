A JVM process needs much more memory than the storage used for Java objects. Beyond the heap, the runtime needs thread stacks, class metadata, compiled code, internal VM structures, native libraries, direct buffers, and memory used by other subsystems.

So:

```text
process RSS / committed memory
≠ Java heap usage
```

A dashboard that only watches `-Xmx` or heap-used metrics can miss the reason a process hits a container/OS limit while the heap still has free space.

This chapter builds a **whole-process memory model**. Measuring categories with NMT/JFR/OS tooling belongs to Runtime Diagnostics.
