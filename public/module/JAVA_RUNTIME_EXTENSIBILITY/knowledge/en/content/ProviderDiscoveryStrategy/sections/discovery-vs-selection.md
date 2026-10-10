Discovery and selection are separate steps:

```text
Discovery
→ which providers exist in this runtime context?

Selection
→ which provider satisfies the current request and policy?
```

`ServiceLoader` handles the first step. The application owns the second.

For example, a host that needs a PDF exporter might do:

```java
ReportExporter exporter = ServiceLoader.load(ReportExporter.class)
        .stream()
        .map(ServiceLoader.Provider::get)
        .filter(p -> p.format().equalsIgnoreCase("pdf"))
        .findFirst()
        .orElseThrow(() -> new IllegalStateException("No PDF exporter"));
```

Here `findFirst()` is only a terminal operation after the application has applied part of its policy.

Do not turn “the provider discovered first” into a business rule without an explicit contract. Discovery order can depend on module topology, class-loader/resource ordering, and deployment structure.

A sound architecture treats discovery as input to selection rather than treating discovery order as the selection policy itself.
