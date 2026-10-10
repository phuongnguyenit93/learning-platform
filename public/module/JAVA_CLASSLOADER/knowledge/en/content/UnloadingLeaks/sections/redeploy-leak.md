Redeploy works by creating a new namespace; it does not mutate old `Class<?>` objects into new definitions.

```text
generation 1
  → PluginClassLoader A
  → HelloPlugin A

redeploy
  → PluginClassLoader B
  → HelloPlugin B
```

If loader A is still reachable, generation 1 remains alive even though generation 2 works correctly. Repeating that pattern creates the classic redeploy leak: every deployment adds another loader graph.

A disciplined plugin shutdown sequence typically includes the responsibilities that the plugin actually acquired:

- stop plugin-owned threads, scheduled tasks, and executors;
- restore or clear TCCL values on surviving host threads;
- remove `ThreadLocal` values from long-lived threads where the plugin placed them;
- unregister listeners, callbacks, drivers, or management objects from longer-lived registries;
- evict host caches containing plugin classes, loaders, method handles, reflection metadata, or plugin objects;
- close closeable loader/resource containers such as `URLClassLoader` when used, so JAR/file handles are released;
- remove the host's final strong references to plugin instances and the old loader.

Closing a `URLClassLoader` does **not** unload its already-defined classes. It releases resources used for future loading. Unloading still depends on garbage-collection reachability.

The shared API should remain parent-owned while plugin-private implementations remain child-owned. That boundary makes lifecycle ownership easier to reason about: the durable parent keeps contracts; a disposable child owns one plugin generation.
