Capability versioning focuses on **what the provider can do** rather than only on “which release is this provider?”

For example:

```java
enum ExportCapability {
    PDF_A,
    STREAMING,
    ENCRYPTION
}

Set<ExportCapability> capabilities();
```

The host can express a requirement as:

```text
request needs PDF_A + ENCRYPTION
→ filter by capabilities
→ then apply version/priority policy
```

This is useful when feature rollout does not align perfectly with release numbers or providers implement different subsets.

Do not create a version dimension for every method. Model compatibility dimensions that the host actually needs to decide.

Combining capabilities with contract versions can enable gradual migration: older providers continue serving basic requests while new capabilities route to newer providers.
