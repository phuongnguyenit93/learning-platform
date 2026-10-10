Having no provider is a valid `ServiceLoader` state; a service may have zero providers.

The host has to define the meaning:

```text
required extension
→ fail fast during startup/activation

optional extension
→ disable the feature

default implementation
→ use an intentional fallback
```

Example fallback:

```java
ReportExporter exporter = loader.stream()
        .map(ServiceLoader.Provider::get)
        .filter(p -> p.format().equals("txt"))
        .findFirst()
        .orElse(DEFAULT_TEXT_EXPORTER);
```

Do not silently fall back when a missing provider indicates a deployment error. Silent fallback can hide broken configuration and create surprising production behavior.

A startup validation phase can verify required capabilities before accepting traffic:

```text
required capabilities
→ discover
→ validate at least/exactly one usable provider as required
→ publish readiness
```

Observability should make it clear whether a missing provider is optional or fatal.
