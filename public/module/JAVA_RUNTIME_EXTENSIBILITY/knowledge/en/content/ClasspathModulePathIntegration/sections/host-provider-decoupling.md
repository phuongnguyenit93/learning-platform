A central goal of service-provider architecture is for the host to depend on the **service contract**, not provider modules.

Prefer a host descriptor like:

```java
module com.example.report.host {
    requires com.example.export.api;
    uses com.example.export.ReportExporter;
}
```

instead of:

```java
module com.example.report.host {
    requires com.example.export.api;
    requires com.example.export.pdf;
    requires com.example.export.csv;
}
```

If the host requires every provider module, the extension set becomes a compile-time dependency list again and much of the decoupling benefit disappears.

Provider modules belong in the runtime image/module path or in a dynamically resolved configuration according to the deployment architecture. The host knows the contract and selection policy, not each implementation.

Tests should preserve this boundary too: provider contract tests validate each provider independently, and integration tests verify discovery from real deployment artifacts without importing concrete providers into host code.

At this point Java has supplied the **contract, registration, and discovery boundary**, but it still has not decided who owns validation, the selection registry, lifecycle, failure containment, or cleanup. Those responsibilities motivate the next chapter's move from ServiceLoader providers to a **plugin architecture**.
