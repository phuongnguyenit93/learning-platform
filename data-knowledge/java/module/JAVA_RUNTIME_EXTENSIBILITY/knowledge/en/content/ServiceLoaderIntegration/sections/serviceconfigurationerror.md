`ServiceConfigurationError` indicates that the service-provider environment is invalid or a provider cannot be loaded or instantiated according to the platform contract.

Typical causes include:

- a provider class cannot be loaded;
- the provider is not assignable to the service when constructor-based instantiation requires it;
- a required public no-argument provider constructor is missing;
- a `provider()` method has an invalid signature or return type;
- `provider()` returns `null` or throws;
- a `META-INF/services/...` file is malformed;
- an I/O error occurs while reading provider configuration.

Because discovery is lazy, the error may surface from `hasNext()`, `next()`, or during stream processing.

```java
try {
    for (ReportExporter exporter : loader) {
        register(exporter);
    }
} catch (ServiceConfigurationError error) {
    log.error("Broken exporter provider", error);
}
```

Do not silently swallow every `ServiceConfigurationError`. Broken provider configuration is usually a deployment/configuration defect that deserves clear observability.

If the product requirement allows skipping a bad provider and continuing, make that recovery policy explicit and test it. Do not build the architecture on an assumption that every failure is recoverable.

Once discovery can produce zero, one, many, or broken providers, the next problem is deliberately separate from discovery itself: **which usable provider should the application select for the current request, and how should ambiguity be handled?**
