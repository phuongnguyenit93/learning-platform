Applications continuously create objects with very different lifetimes. If every piece of Java code had to determine exactly when to free each object, complex ownership would make use-after-free, double-free, and manual-memory leaks much easier to create.

The managed heap changes the responsibility split:

```text
application
→ create and use objects

runtime / GC
→ determine what remains reachable
→ reclaim storage when appropriate
```

Java developers still manage **logical lifetime** through references and explicit resource lifecycles, but they do not directly free ordinary heap objects.

The trade-off is that the runtime must track reachability and perform collection work, introducing throughput, latency, and memory-footprint trade-offs.
