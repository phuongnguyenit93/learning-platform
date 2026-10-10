There is no ordinary Java call that means "unload this Class now." Application code can remove strong references and make the loader **eligible** for collection, but the garbage collector decides when collection and class unloading actually happen.

A bounded experiment can observe reachability with a `WeakReference`. A weak reference **does not by itself keep its referent alive**, so it can observe whether a loader remains reachable without becoming the strong reference that prevents collection:

```java
static WeakReference<ClassLoader> loadThenRelease(Path pluginRoot) throws Exception {
    ClassLoader loader = new PluginClassLoader(
            Plugin.class.getClassLoader(),
            pluginRoot
    );

    Class<?> type = loader.loadClass("demo.plugins.HelloPlugin");
    Object plugin = type.getDeclaredConstructor().newInstance();
    System.out.println(plugin);

    return new WeakReference<>(loader);
}
```

After the method returns, the local strong references are gone, but a real experiment must also ensure no TCCL, cache, listener, thread, or other external structure retained the plugin graph.

Calling `System.gc()` can request garbage collection for an experiment, but it is only a hint and cannot prove that unloading must occur at that exact point. Tests should not make correctness depend on one forced-GC call.

> **Advanced runtime diagnostics:** on HotSpot, unified JVM logging can provide direct evidence during controlled runs, for example:

```text
-Xlog:class+unload=info
```

Heap dumps and JDK diagnostic tools can then help answer a different question when unloading does **not** happen: which GC-root path still retains the stale loader?
