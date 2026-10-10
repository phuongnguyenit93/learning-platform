The useful debugging question is: **what longer-lived object still has a path to the old loader, one of its classes, or one of its instances?**

A **GC root** is a starting point that the garbage collector treats as live when tracing reachability, such as a live thread or other long-lived runtime structures that lead to static state. If an object still has a reference path from a GC root, it is not collectible.

Common paths include:

```text
live host thread
  → contextClassLoader
  → old plugin loader

live pooled thread
  → ThreadLocal value
  → old plugin object
  → its Class
  → old plugin loader

host/global cache
  → Class<?> or ClassLoader key/value
  → old plugin loader

host registry/listener list
  → old plugin listener object
  → old plugin Class
  → old plugin loader
```

The reference does not have to point to the loader directly. Retaining an object whose class was defined by the old loader can keep that class and loader graph relevant as well.

This is where heap-dump analysis is more useful than guessing from source syntax. Search from the stale `ClassLoader` instance back to GC roots and identify the ownership boundary that should have been cleared during shutdown.

The TCCL chapter showed one such root. The same principle applies to callbacks, registries, executors, management hooks, caches, and other infrastructure whose lifetime exceeds the plugin deployment.
