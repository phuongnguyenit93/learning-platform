Static wiring is not a problem by itself. It is often the simplest and best design when the set of implementations is known at build and deployment time.

The limitation appears when adding an extension requires changing the host:

```java
switch (format) {
    case "pdf" -> new PdfExporter();
    case "csv" -> new CsvExporter();
    case "json" -> new JsonExporter();
    default -> throw new IllegalArgumentException();
}
```

Adding a provider now means editing, rebuilding, and redeploying the host. A hard-coded registry merely moves the coupling:

```java
registry.put("pdf", new PdfExporter());
registry.put("csv", new CsvExporter());
```

Runtime extensibility becomes useful when one or more of these requirements exist:

- providers are developed or packaged independently;
- the host should not know every provider in advance;
- capabilities can be added by deploying another JAR or module;
- the application must select providers by capability or metadata;
- plugins need explicit lifecycle or isolation boundaries.

Without such requirements, dependency injection or static wiring is usually simpler to reason about and operate.
