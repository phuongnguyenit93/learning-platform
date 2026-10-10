The two main traversal APIs expose different things:

```text
iterator()/enhanced for
→ yields service/provider instances
→ providers are instantiated as needed

stream()
→ yields ServiceLoader.Provider<S>
→ provider type can be inspected before Provider.get()
```

Iterator example:

```java
for (ReportExporter exporter : ServiceLoader.load(ReportExporter.class)) {
    if ("pdf".equals(exporter.format())) {
        exporter.export(report);
    }
}
```

Stream example when type metadata is useful:

```java
List<ReportExporter> exporters =
        ServiceLoader.load(ReportExporter.class)
                .stream()
                .filter(p -> p.type().isAnnotationPresent(StableProvider.class))
                .map(ServiceLoader.Provider::get)
                .toList();
```

`Provider.type()` exposes the type represented by the `ServiceLoader.Provider`, while `Provider.get()` obtains an instance. For constructor-based providers this is the provider class. For an explicit-module provider that uses a static `provider()` method, `type()` is the **return type of `provider()`**, not necessarily the class named in `provides ... with ...`.

The stream does not make discovery eager by default. Providers are still located lazily as the stream pipeline is consumed.

Use iteration when the instance is what matters immediately. Use the `Provider` stream when selection can inspect metadata on the type exposed by `Provider.type()` before instantiation.
