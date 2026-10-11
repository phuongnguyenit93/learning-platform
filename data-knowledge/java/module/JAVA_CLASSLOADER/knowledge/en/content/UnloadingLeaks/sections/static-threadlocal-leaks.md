The phrase "static causes ClassLoader leaks" is too broad. A static field owned by a class inside the old plugin loader does not by itself make the graph immortal. If nothing outside the old loader graph is reachable from a GC root, the loader, its classes, and their static state can be reclaimed together.

The dangerous pattern crosses a lifetime boundary.

### Host static cache retains plugin types

```java
// Defined by a long-lived host/shared loader:
final class MetadataCache {
    static final Map<Class<?>, Object> CACHE = new ConcurrentHashMap<>();
}

// Later:
MetadataCache.CACHE.put(pluginType, pluginMetadata);
```

If the entry is never removed, a parent-owned static field keeps `pluginType` reachable, which can keep its defining loader reachable.

For metadata naturally associated with a `Class<?>`, `ClassValue` can sometimes provide a better lifecycle-aware design than a permanent global `Map<Class<?>, ...>`, though the correct choice depends on the cache contract.

### Long-lived thread retains plugin state through `ThreadLocal`

```java
ThreadLocal<Object> local = hostThreadLocal;
local.set(pluginObject);
```

If a pooled host thread survives plugin shutdown and the value is not removed, the thread can retain an object from the old plugin loader.

Use a bounded lifecycle:

```java
try {
    local.set(pluginObject);
    runWork();
} finally {
    local.remove();
}
```

### Host registry retains plugin listeners

```java
eventBus.addListener(pluginListener);
```

Registration establishes a reference from a longer-lived owner to the plugin. Plugin shutdown must remove that listener.

The common rule is ownership: if an object with a longer lifecycle stores plugin-defined state, there must be a matching release/unregister path.
