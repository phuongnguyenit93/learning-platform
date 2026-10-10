The Java heap is only part of a JVM process. When RSS/process memory grows while post-GC heap remains stable, or a container is OOM-killed before the Java heap reaches -Xmx, the investigation must include **native memory**.

Native memory can include:

- metaspace and class metadata;
- platform-thread stacks;
- JIT/code cache;
- GC internal structures;
- direct/native buffers;
- JNI or native libraries;
- memory mappings and other VM structures.

Native Memory Tracking (NMT) observes memory managed internally by HotSpot. It does not replace operating-system metrics and it does not account for all native allocations made by the application or third-party libraries.

Mental model:

~~~text
Process RSS / virtual memory
        ├─ Java heap
        ├─ HotSpot-managed native memory  ← much of this is visible to NMT
        └─ third-party / application native memory
~~~

NMT is especially useful for the question: “Which JVM-native category is using memory, and which category is growing over time?”
