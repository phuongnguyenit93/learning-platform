A capability model answers “what can this plugin do?” in a form the host can use without knowing implementation details.

The `ReportExporter` variant below intentionally uses a **capability-oriented contract** to demonstrate selection across multiple formats and options; it does not replace the baseline interface used by the API experiments:

```java
public interface ReportExporter {
    Set<String> formats();
    boolean supports(ExportOptions options);
    void export(Report report, ExportOptions options);
}
```

The host may build a registry such as:

```text
pdf  → PdfExporter
csv  → CsvExporter
json → JsonExporter
```

If multiple providers advertise the same capability, the contract needs an application policy for priority, version, environment, quality tier, or explicit configuration.

Capability metadata should describe what the host needs to decide, not every provider detail. Do not expose arbitrary dependency versions when a simple supported-feature flag would answer the real selection question.

The more explicit the selection contract, the less the system depends on incidental discovery ordering.
