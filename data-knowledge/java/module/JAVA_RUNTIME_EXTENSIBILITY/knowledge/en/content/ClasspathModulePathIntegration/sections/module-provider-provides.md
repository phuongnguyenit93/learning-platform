A provider in an explicit named module is registered with `provides ... with ...`:

```java
module com.example.export.pdf {
    requires com.example.export.api;

    provides com.example.export.ReportExporter
        with com.example.export.pdf.PdfExporter;
}
```

Important consequences are:

- the provider is declared by the module that contains it;
- a `provides` directive cannot name a provider class in another module;
- the implementation package usually does not need to be exported to the host;
- the host discovers the provider through the service contract instead of importing the implementation.

Avoiding an export for provider implementation packages preserves stronger encapsulation:

```text
host
→ sees service API
→ does not need provider implementation packages
```

A module may declare multiple providers for one service; their declaration order within that module contributes to the order used by `ServiceLoader` for those providers.
