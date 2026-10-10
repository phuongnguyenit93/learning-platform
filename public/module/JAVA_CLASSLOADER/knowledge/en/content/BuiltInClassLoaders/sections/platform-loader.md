Java also exposes a **platform ClassLoader**:

```java
ClassLoader platform = ClassLoader.getPlatformClassLoader();
System.out.println(platform);
System.out.println(platform.getParent()); // typically null: bootstrap boundary
```

Its role is to load platform classes that are not defined by the bootstrap loader. Since Java 9, this model is tied to the modular runtime rather than the older Java 8 "extension class loader" model.

The platform loader is useful as a boundary between core/runtime classes and ordinary application classes. It also matters when creating a custom loader: choosing a parent determines which types the custom loader naturally shares with the rest of the process.

For example, an isolated tool might deliberately use the platform loader as its parent when it should see Java platform APIs but should not automatically inherit all classes visible to the main application loader:

```java
ClassLoader parent = ClassLoader.getPlatformClassLoader();
ClassLoader isolated = new PluginClassLoader(parent, pluginDirectory);
```

That is an architectural decision, not merely a constructor parameter. A narrower parent can increase isolation, but it also means application-owned API classes are no longer automatically shared unless the loader design provides another bridge.
