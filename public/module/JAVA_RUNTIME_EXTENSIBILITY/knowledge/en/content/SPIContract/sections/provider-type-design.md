A provider type is the type that runtime discovery can locate and use to supply a service. Under the `ServiceLoader` contract, the provider type must be `public` and must not be an inner class. For an explicit module, the provider type may even be an interface or abstract class when it declares a valid static `provider()` method.

In the direct case:

```java
public final class PdfExporter implements ReportExporter {
    @Override
    public String format() {
        return "pdf";
    }

    @Override
    public boolean supports(Report report) {
        return true;
    }

    @Override
    public void export(Report report) {
        // PDF implementation
    }
}
```

The provider should not require the host to know helper classes, library-specific types, or construction details.

Provider design also needs clear answers to lifecycle questions:

- Is one instance reusable?
- Is it thread-safe?
- Does it retain long-lived resources?
- How are initialization failures reported?
- Who owns cleanup?

`ServiceLoader` defines platform-level construction rules, but it does not define the application's plugin lifecycle. Provider design must therefore fit the lifecycle policy the host establishes later.
