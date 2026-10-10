Common mistakes include:

**High heap usage means a leak**  
A healthy JVM may use much of its heap if GC reclaims enough memory.

**High allocation rate means a leak**  
Allocation and retention are different.

**One heap dump equals root cause**  
A dump needs trend, workload, and runtime context.

**The top histogram class is the culprit**  
It may simply be valid application data.

**Looking only at pre-GC used memory**  
Post-GC live-set trends are often more useful for retention.

**Ignoring native memory**  
Growing process RSS does not necessarily come from Java heap.

**Treating heap dumps as risk-free**  
They can pause the JVM, consume large disk space, and contain sensitive data.

Good heap/GC diagnostics combines snapshots, trends, and runtime context.
