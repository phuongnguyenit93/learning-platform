On the class path, a provider is registered with a **provider-configuration file** under:

```text
META-INF/services/<fully-qualified-service-name>
```

For a service named:

```text
com.example.export.ReportExporter
```

the provider JAR contains:

```text
META-INF/services/com.example.export.ReportExporter
```

with entries such as:

```text
com.example.export.pdf.PdfExporter
com.example.export.csv.CsvExporter
```

Each line names a provider class. The file is UTF-8 and supports blank lines and `#` comments.

The provider class must be visible from the discovery class loader and satisfy the constructor-based provider contract used for class-path providers.

This resource-based registration keeps the host free from compile-time provider dependencies, but it makes packaging correctness important. Shading or assembly can accidentally drop or overwrite service files, so test the actual built artifact.

One migration detail matters when moving to JPMS: when a provider class is deployed in a **named module**, a matching entry in `META-INF/services` is not used as an unnamed-module provider registration. Named-module providers are declared through `provides` in the module descriptor. This avoids discovering the same provider through both the module descriptor and a service-configuration file.
