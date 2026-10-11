`ClassLoader` separates the public loading protocol from the usual subclass extension point:

```text
loadClass(name)
  → checks whether the class was already loaded
  → delegates according to the loader policy
  → calls findClass(name) when this loader should define the class

findClass(name)
  → subclass-specific byte lookup
  → defineClass(...)
  → return the resulting Class<?>
```

For a normal parent-first custom loader, overriding `findClass` is usually enough. The inherited `loadClass` preserves duplicate-load checks, parent delegation, and synchronization around loading.

```java
final class PluginClassLoader extends ClassLoader {
    private final Path root;

    PluginClassLoader(ClassLoader parent, Path root) {
        super(parent);
        this.root = root;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        // Custom byte lookup belongs here.
        return definePluginClass(name);
    }

    private Class<?> definePluginClass(String name) throws ClassNotFoundException {
        // implemented in the next section
        throw new ClassNotFoundException(name);
    }
}
```

This relationship matters because `loadClass` answers the full lookup question, while `findClass` answers only the narrower question: **"If this loader is responsible for defining this name, where are its bytes?"**

Override `loadClass` only when the lookup policy itself must change, such as a carefully scoped child-first strategy. Once you replace it, you also take responsibility for preserving already-loaded checks, thread-safety, protected package boundaries, and the intended parent/child sharing rules.
