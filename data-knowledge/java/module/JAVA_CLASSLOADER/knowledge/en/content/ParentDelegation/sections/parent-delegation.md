The default `ClassLoader.loadClass` workflow is conceptually:

```text
loadClass(name)
    ↓
already loaded by this loader?
    ├─ yes → return it
    └─ no
        ↓
ask parent (or bootstrap when parent is null)
        ├─ found → return parent's Class
        └─ not found
            ↓
call this loader's findClass(name)
            ↓
optionally resolve before returning
```

The real `ClassLoader` implementation also coordinates concurrent loading and resolution, but this order is the core mental model.

The two-argument `loadClass(name, resolve)` overload connects directly to the Lifecycle chapter. When `resolve` is `true`, the loader invokes `resolveClass(...)` before returning the class:

```text
loadClass(name, false)
→ load/find the class
→ no request to resolve it immediately through this call

loadClass(name, true)
→ load/find the class
→ resolveClass(class)

resolveClass
≠ initialize the class
```

Application code rarely needs to call `resolveClass` directly. The important semantic point is that **resolve belongs to linking/resolution, not static initialization**.

At this chapter, keep the implementation at the policy level:

```text
loadClass(name)
→ check whether the class is already loaded
→ ask the parent first
→ only if the parent cannot provide it, try the current loader's own source
```

The next `CustomClassLoader` chapter owns the concrete `findClass`, `defineClass`, and subclass code. This keeps the learning order clean: first understand **why delegation exists**, then learn **how to implement a loader**.

Suppose the application loader already defines the shared plugin API:

```text
Application loader
  └─ demo.api.Plugin

PluginClassLoader
  └─ demo.plugins.HelloPlugin
```

When `PluginClassLoader` needs `demo.api.Plugin`, default delegation asks the application parent first. The child therefore reuses the host's `Plugin` class instead of defining a private copy. When the child requests `demo.plugins.HelloPlugin`, the parent cannot find it, so the child gets a chance to define it through `findClass`.

For most custom loaders, this is why overriding `findClass` is safer than replacing `loadClass`: the inherited `loadClass` keeps the established delegation protocol and invokes your byte-source logic only after parent lookup fails.
