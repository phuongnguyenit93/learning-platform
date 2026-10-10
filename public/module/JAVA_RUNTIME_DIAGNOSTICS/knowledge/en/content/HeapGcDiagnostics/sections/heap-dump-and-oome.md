A heap dump is a snapshot of the Java-heap object graph. It is useful when the investigation needs to know **which objects remain live and what keeps them reachable**.

Create one from a running JVM with:

~~~text
jcmd <pid> GC.heap_dump heap.hprof
~~~

Analysis commonly looks at:

- retained size;
- dominators;
- GC roots;
- reference chains;
- class-loader retention;
- unexpectedly large caches or collections.

OutOfMemoryError does not automatically mean a leak. The heap may simply be undersized, workload may have grown, there may be an allocation burst, the live data set may legitimately be too large, or there may be real retention.

Heap dumps can be expensive in pause time and disk usage. The Postmortem chapter owns automatic capture on OOME; this chapter owns **analysis**.
