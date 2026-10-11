`ModuleFinder` locates module artifacts, while `Configuration` represents a **resolved readability graph**.

For example:

```java
Path plugins = Path.of("plugins");
ModuleFinder finder = ModuleFinder.of(plugins);

ModuleLayer parent = ModuleLayer.boot();
Configuration parentConfig = parent.configuration();

Configuration config = parentConfig.resolve(
        finder,
        ModuleFinder.of(),
        Set.of("com.example.report.plugins"));
```

Resolution starts from root modules and computes the required dependency/readability graph.

The configuration can then be defined as a runtime layer:

```java
ModuleLayer layer = parent.defineModulesWithOneLoader(
        config,
        ClassLoader.getSystemClassLoader());
```

Keep the distinction clear:

```text
Configuration
→ resolved graph

ModuleLayer
→ runtime modules + ClassLoader mapping
```
