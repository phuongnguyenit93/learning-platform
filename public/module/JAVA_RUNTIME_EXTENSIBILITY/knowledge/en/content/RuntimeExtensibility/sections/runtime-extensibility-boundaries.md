Runtime Extensibility touches several neighboring Java topics without owning them completely.

```text
ClassLoader
→ class identity, delegation, visibility, loader lifecycle

JPMS
→ module descriptors, readability, exports/opens, general resolution

Runtime Extensibility
→ service/provider contracts, discovery, plugin architecture,
   service binding, and ModuleLayer integration

Instrumentation
→ changing or observing bytecode/classes in a running JVM
```

A plugin-isolation design may use custom class loaders, but this module focuses on **why the isolation boundary is needed** and how it affects plugin architecture. Detailed delegation mechanics belong to the ClassLoader curriculum.

Likewise, this module uses `requires`, `uses`, `provides`, `Configuration`, and `ModuleLayer` where they support extensibility; it does not duplicate the complete JPMS curriculum.

One boundary is especially important:

```text
loading another provider
≠
redefining an already-loaded class
```

The first is extensibility. The second belongs to instrumentation and agent mechanisms.
