`reload()` has one central job:

```text
clear the provider cache of this ServiceLoader instance
```

Later iteration or stream processing then performs discovery again from scratch for that loader context.

```java
ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class);

// ... providers were used
loader.reload();
```

`reload()` does **not**:

- invoke an application `stop()` lifecycle hook;
- close provider-owned resources;
- unload classes;
- unload modules;
- guarantee that an old JAR can be deleted;
- turn the architecture into a hot-reload plugin system.

Existing iterators and streams should be discarded after a reload; their sources are fail-fast with respect to the cleared provider cache.

A `ServiceLoader` instance is also **not safe for concurrent use by multiple threads**. The host must synchronize access or design loader ownership accordingly.

Real plugin replacement requires lifecycle, resource cleanup, and often loader/layer replacement. `ServiceLoader.reload()` is only a discovery-cache primitive inside that broader flow.
