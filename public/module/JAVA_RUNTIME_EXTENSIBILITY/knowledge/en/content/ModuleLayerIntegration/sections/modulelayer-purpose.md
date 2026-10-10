`ModuleLayer` is useful when plugins are **explicit named modules** and the host needs to create an additional module graph in the JVM after the boot layer already exists.

Do not introduce a `ModuleLayer` merely because providers are packaged as JARs. Startup discovery on the class path or module path is simpler when the provider set is fixed when the process starts.

`ModuleLayer` becomes useful when the host needs to:

- resolve modules from a separate plugin directory or repository;
- keep a module graph distinct from the boot layer;
- choose one-loader or many-loader mapping;
- discover services in the resulting layer;
- replace a plugin generation by creating another layer rather than mutating the boot graph.

The mental model is:

```text
module artifacts
→ ModuleFinder
→ Configuration
→ ModuleLayer
→ ServiceLoader.load(layer, service)
```

A layer represents a runtime module graph; it is not a mutable list of plugins.
