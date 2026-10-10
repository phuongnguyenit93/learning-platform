In the JVM, type identity is not just the fully qualified class name. A useful mental model is:

```text
type identity
≈ class name + defining ClassLoader
```

Two loaders can define two copies of `com.example.api.ReportExporter`, and the JVM may treat them as different types.

That is why the **shared contract** is commonly defined by a shared or parent loader visible to both host and plugins.

```text
shared parent loader
→ ReportExporter contract

plugin loader A
→ PdfExporter

plugin loader B
→ CsvExporter
```

If each plugin loads its own copy of the contract with incompatible loader policy, a cast to the host's `ReportExporter` may fail even when class names are identical.

Detailed delegation mechanics belong to the ClassLoader module. The key architectural rule here is that types crossing the plugin boundary need a compatible shared identity.
