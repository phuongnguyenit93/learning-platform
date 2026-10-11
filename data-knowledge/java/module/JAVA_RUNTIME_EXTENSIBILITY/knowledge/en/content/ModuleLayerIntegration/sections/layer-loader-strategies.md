When defining a layer, resolved modules must be mapped to class loaders.

Java provides three main choices:

```text
defineModulesWithOneLoader
→ all modules in the configuration use one newly created loader

defineModulesWithManyLoaders
→ each module is mapped to its own loader

defineModules
→ the application supplies a module-name → ClassLoader mapping function
```

One-loader is simpler when modules trust each other and strong dependency isolation is unnecessary.

Many-loaders increases isolation but also introduces more loader boundaries. Types crossing boundaries must still respect module readability and compatible shared identity.

Custom mappings serve specialized architectures and carry more responsibility for loader readiness and delegation behavior.

With `defineModules(Configuration, Function<String, ClassLoader>)`, the application must ensure that custom loaders:

- respect module readability in their delegation behavior;
- are preferably parallel-capable to reduce class-loading deadlock risk;
- are ready to load classes and resources from their mapped modules before the layer is used.

The API also does not guarantee that custom layer creation is atomic in every implementation: an operation can fail after some modules have already been defined to the JVM. That makes custom mapping an advanced tool for a real loader-topology requirement rather than a default plugin choice.

Do not choose many-loaders merely because there are many plugins. Start with actual isolation, dependency-conflict, and replacement requirements.
