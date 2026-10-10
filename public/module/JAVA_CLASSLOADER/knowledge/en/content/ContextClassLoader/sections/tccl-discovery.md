`ServiceLoader` is the classic example. The convenience form:

```java
ServiceLoader<Plugin> plugins = ServiceLoader.load(Plugin.class);
```

uses the current thread's context ClassLoader to locate provider configuration and provider classes.

For a plugin system, the host can expose the shared `Plugin` interface from a parent while a plugin loader provides an implementation and its service descriptor:

```text
META-INF/services/demo.api.Plugin
```

containing, for example:

```text
demo.plugins.HelloPlugin
```

Then discovery can run under the plugin loader as the TCCL:

```java
ClassLoader pluginLoader = ...;
Thread thread = Thread.currentThread();
ClassLoader previous = thread.getContextClassLoader();

try {
    thread.setContextClassLoader(pluginLoader);

    for (Plugin plugin : ServiceLoader.load(Plugin.class)) {
        System.out.println(plugin.name());
    }
} finally {
    thread.setContextClassLoader(previous);
}
```

The shared service type still has to be loader-compatible. Setting the TCCL does not repair a design where the provider implements a private child copy of `Plugin` while the host expects the parent copy.

Frameworks may use TCCL for other discovery tasks such as resource lookup or reflective loading. The principle is the same: parent-owned code obtains a loader that represents the current application's visibility context.

When the caller already knows the exact loader that should be used, an explicit API such as `ServiceLoader.load(service, loader)` is usually easier to reason about than ambient thread context. TCCL is most valuable when the framework contract intentionally relies on a loader context associated with the current thread so parent-owned code can act on behalf of child/application code.
