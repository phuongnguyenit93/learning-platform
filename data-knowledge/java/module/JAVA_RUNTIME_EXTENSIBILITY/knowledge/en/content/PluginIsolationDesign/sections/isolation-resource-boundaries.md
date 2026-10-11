Class isolation is not enough if a plugin leaks resources beyond its boundary.

Common resources that retain plugins include:

- non-daemon threads;
- executors and schedulers;
- `ThreadLocal` values on host threads;
- global registries or listeners;
- shutdown hooks;
- host caches retaining plugin instances/classes;
- open files, sockets, or native resources;
- thread context class loaders pointing to plugin loaders.

For example, a plugin-created executor needs explicit cleanup:

```java
final class PdfPlugin implements AutoCloseable {
    private final ExecutorService executor = Executors.newFixedThreadPool(2);

    @Override
    public void close() {
        executor.shutdown();
    }
}
```

The host must also stop retaining references to provider instances, classes, loaders, and plugin metadata if loader collection is expected.

The isolation boundary is therefore about **classes, resources, threads, and reference ownership**, not merely separate JAR files.
