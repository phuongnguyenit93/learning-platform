Providers are discovered and instantiated **lazily** rather than all being created when `ServiceLoader.load(...)` returns.

```java
ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class);

// This does not mean every provider has already been instantiated.
```

During iteration the loader behaves conceptually like this:

```text
cached providers
→ yielded first in load/instantiation order

unprocessed providers
→ located lazily
→ instantiated when required
→ added to the loader cache
```

The cache belongs to a particular **ServiceLoader instance**. Two loader objects have separate discovery/cache state.

Laziness is useful when many providers exist but a request only needs one. It also means provider errors may surface while iterating or consuming a stream rather than at the initial `load(...)` call.

```java
for (ReportExporter exporter : loader) {
    if (exporter.supports(report)) {
        exporter.export(report);
        break;
    }
}
```

Do not confuse the provider cache with an application-level singleton registry. It is discovery behavior, not a plugin lifecycle contract.
