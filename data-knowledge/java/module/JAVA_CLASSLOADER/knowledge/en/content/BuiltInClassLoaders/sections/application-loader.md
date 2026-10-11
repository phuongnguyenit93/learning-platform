The loader most application code encounters is the **application ClassLoader**, which is normally also returned as the system ClassLoader:

```java
ClassLoader system = ClassLoader.getSystemClassLoader();
ClassLoader current = BuiltInClassLoaders.class.getClassLoader();

System.out.println(system);
System.out.println(current);
System.out.println(system == current);
```

In a typical command-line application, this loader defines classes and dependencies made visible to the application through the configured class path and the runtime's module-loading arrangements.

The phrase **system ClassLoader** comes from the API (`ClassLoader.getSystemClassLoader()`). In common JDK setups it is the application loader, but code should avoid assuming a specific implementation class name because the JVM can use a custom system loader configuration.

In the plugin example, the host application's `demo.api.Plugin` interface would normally be defined by this application loader:

```java
System.out.println(Plugin.class.getClassLoader());
```

If plugin implementations are defined by child loaders but delegate `demo.api.Plugin` to this parent, both host and plugin agree on the same interface identity. That shared API boundary becomes essential when the Class Identity chapter explains cross-loader casts.
