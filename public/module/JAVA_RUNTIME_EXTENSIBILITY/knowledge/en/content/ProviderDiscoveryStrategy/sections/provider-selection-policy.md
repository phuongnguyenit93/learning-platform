A selection policy should be explicit instead of scattered through host code as unrelated `if/else` statements.

For example:

```java
public final class ExporterSelector {
    public ReportExporter select(
            Collection<ReportExporter> providers,
            String format,
            Report report) {

        return providers.stream()
                .filter(p -> p.format().equalsIgnoreCase(format))
                .filter(p -> p.supports(report))
                .findFirst()
                .orElseThrow(() -> new NoExporterException(format));
    }
}
```

Selection can use:

- format, protocol, or capability;
- supported feature set;
- version compatibility;
- environment configuration;
- application-defined priority;
- health or availability when the architecture models it.

Priority should come from an **application contract**, not incidental discovery order.

When selection becomes non-trivial, isolate a provider registry/selector from business services. Domain code should not need to know whether providers came from the class path, module path, or a module layer.
