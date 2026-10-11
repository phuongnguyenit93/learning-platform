“Unloading a plugin” in the JVM ultimately depends on making its **defining class loader unreachable** together with classes and objects that retain it.

There is no API such as:

```java
Class.unload(); // does not exist
```

A custom/plugin class loader can become collectible when no reachable strong references remain to the loader, its classes, or objects that retain them.

Common leak sources include:

- host static fields retaining plugin instances;
- live threads whose context class loader is the plugin loader;
- global caches retaining plugin `Class<?>` objects;
- listeners that were not unregistered;
- executors that were not stopped;
- native/JNI callbacks retaining references.

Unloadability therefore has to be designed through lifecycle, ownership, and reference cleanup.

`ServiceLoader.reload()` is not evidence that a plugin was unloaded; it only clears that loader's provider cache.
