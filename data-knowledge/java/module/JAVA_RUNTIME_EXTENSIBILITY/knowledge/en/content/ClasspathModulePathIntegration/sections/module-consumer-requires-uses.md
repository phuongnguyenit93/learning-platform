For a named-module consumer, using a service is declared in `module-info.java`.

If the service type is exported by `com.example.export.api`:

```java
module com.example.report.host {
    requires com.example.export.api;
    uses com.example.export.ReportExporter;
}
```

The directives serve different purposes:

```text
requires
→ lets the host read the module that exports the service type

uses
→ declares that the host consumes this service
```

When the service type is declared in the consumer module itself, it does not require itself, but `uses` still expresses service consumption.

For named-module callers, `uses` is not merely documentation. It is part of the service-loading/module contract used by resolution and service binding.

This module uses the JPMS rules needed for extensibility without duplicating the entire module-system curriculum.
