Once a layer exists, providers can be discovered explicitly in that layer context:

```java
ServiceLoader<ReportExporter> exporters =
        ServiceLoader.load(layer, ReportExporter.class);
```

This overload searches:

```text
the current layer
→ ancestor layers according to layer traversal rules
```

It does **not** include providers in unnamed modules/class-path configuration as part of this layer-based discovery scope.

A named-module caller still has to satisfy the service-usage contract (`uses`).

The main advantage is an explicit discovery context: the host knows which module-layer graph represents the current plugin generation.

Selection and lifecycle remain application responsibilities. `ServiceLoader.load(layer, ...)` does not activate plugins or resolve provider ambiguity for the host.
