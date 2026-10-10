The provider does not always need to be the final object that performs the domain operation.

Two common models are:

```text
Direct provider
→ the provider is the service implementation

Factory/indirection provider
→ the provider creates the real implementation on demand
```

A direct provider works well for cheap, stateless, or reusable objects:

```java
public final class PdfExporter implements ReportExporter { ... }
```

A factory is useful when the final object is expensive or request-specific:

```java
public interface ExporterFactory {
    String format();
    ReportExporter create(ExportOptions options);
}
```

The host discovers factories once and lets them create exporters for particular configurations.

For providers deployed as explicit modules, Java also supports a public static `provider()` method. That mechanism allows the class named in `provides ... with ...` to act as an indirection point without itself being assignable to the service. The domain design should still decide whether indirection is useful; the platform mechanism merely enables it.
