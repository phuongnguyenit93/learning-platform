An explicit module provider supports two construction forms.

**1. Provider constructor**

```java
public final class PdfExporter implements ReportExporter {
    public PdfExporter() {}
}
```

The provider has a public no-argument constructor and the resulting instance is assignable to the service.

**2. Public static `provider()` method**

```java
public final class PdfExporterProvider {
    public static ReportExporter provider() {
        return new PdfExporter(loadNativeEngine());
    }
}
```

In this case `PdfExporterProvider` itself does not have to implement `ReportExporter`; the return type of `provider()` must be assignable to the service.

The provider method is useful when construction needs indirection or the class named in `provides` is not the final service object.

This is a precise Java service-provider convention: a public static no-argument method named `provider`, not an arbitrary application factory method.
