Host and plugin responsibilities should remain distinct.

The host commonly owns:

- discovery context;
- selection policy;
- lifecycle orchestration;
- logging and metrics boundaries;
- timeout or cancellation policy;
- failure containment;
- the shared service contract.

The plugin commonly owns:

- implementation details;
- private dependencies;
- capability-specific resources;
- cleanup for resources it creates;
- extension-domain behavior.

Avoid host code that reaches through the contract:

```java
PdfExporter pdf = (PdfExporter) plugin;
pdf.getInternalEngine().reset();
```

That destroys the plugin boundary.

Likewise, a plugin should not silently control global host lifecycle or retain global mutable state unless the contract explicitly permits it.

A clear responsibility boundary lets providers change without leaking their implementation changes into the host.
