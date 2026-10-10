`resolve()` performs normal root-module and dependency resolution.

`resolveAndBind()` performs resolution **with service binding**. When modules in the graph `uses` a service, service binding can bring matching provider modules into the resulting configuration.

For example:

```java
Configuration config = parent.configuration()
        .resolveAndBind(
                finder,
                ModuleFinder.of(),
                Set.of("com.example.report.host"));
```

If the host module `uses com.example.export.ReportExporter` and modules observable through the finder `provides` that service, service binding can include those providers without the host directly requiring each provider module.

This is where JPMS service binding becomes useful for runtime extensibility.

`resolveAndBind()` is not “scan every module and load everything.” Normal observability, parent, root, and resolution rules still apply.
