Four roles form the core mental model:

```text
Host
→ code that consumes a capability

Service Contract
→ interface or abstract class that describes the capability

Provider
→ implementation or factory that supplies the capability

Discovery
→ mechanism that locates providers while the application runs
```

For example:

```java
public interface ReportExporter {
    String format();
    String export(String report);
}
```

`ReportExporter` is the service contract. `PdfExporter` and `CsvExporter` can be providers. The host depends on `ReportExporter` instead of constructing every provider directly.

This is the **baseline running example** also used by the module's API experiments. Later chapters intentionally enrich or reduce `ReportExporter` in a few snippets to isolate capability modeling, error-contract, or SPI-evolution ideas; those snippets are **illustrative variants**, not silent changes to one source interface.

```java
ServiceLoader<ReportExporter> exporters =
        ServiceLoader.load(ReportExporter.class);
```

`ServiceLoader` is the discovery mechanism. Discovery does not make the business decision for the host, so keep these concepts separate:

```text
discovery
→ which providers exist?

selection
→ which provider satisfies this request?
```

That distinction drives the rest of the module: SPIs define contracts, `ServiceLoader` discovers providers, plugin architecture manages lifecycle and isolation, and `ModuleLayer` supports modular runtime composition.
