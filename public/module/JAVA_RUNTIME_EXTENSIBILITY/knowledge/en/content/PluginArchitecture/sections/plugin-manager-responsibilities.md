When the model grows beyond simple discovery, a `PluginManager` or equivalent component often centralizes orchestration.

Typical responsibilities include:

```text
discover providers
→ validate metadata/compatibility
→ build a registry
→ activate selected plugins
→ expose a stable/read-only view to business code
→ stop and clean up on shutdown or replacement
```

For example:

```java
final class PluginManager {
    private final Map<String, ReportExporter> exporters;

    void start() { ... }
    ReportExporter exporterFor(String format) { ... }
    void stop() { ... }
}
```

The manager does not need to be a large framework. Its value is giving lifecycle and selection policy one clear home instead of letting business code call `ServiceLoader` everywhere.

Avoid turning it into a god object that knows provider internals. It should orchestrate through stable contracts and metadata.
