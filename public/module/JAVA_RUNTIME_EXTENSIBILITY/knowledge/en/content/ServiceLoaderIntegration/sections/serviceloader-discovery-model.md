`ServiceLoader<S>` is Java's standard facility for locating implementations of a **service type** `S` in the runtime environment.

The basic flow is:

```java
ServiceLoader<ReportExporter> loader =
        ServiceLoader.load(ReportExporter.class);

for (ReportExporter exporter : loader) {
    System.out.println(exporter.format());
}
```

`ServiceLoader` is not a dependency-injection container. It does not resolve arbitrary constructor graphs, scopes, or application lifecycle. It follows the service/provider contracts defined by the Java platform.

A service may have:

```text
zero providers
one provider
many providers
```

The host therefore has to design both the “no provider” and “multiple providers” cases.

Provider sources depend on the overload and context being used:

- class-loader-based discovery can locate providers in relevant named and unnamed modules/class-path resources;
- layer-based discovery via `ServiceLoader.load(layer, service)` searches the supplied layer and its ancestors.

The key point is that `ServiceLoader` **locates and loads** providers. The application still owns provider selection and domain behavior.
