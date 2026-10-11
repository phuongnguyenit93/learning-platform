`findFirst()` returns the first provider yielded by the loader traversal. It does not make discovery order a universal priority contract.

Java defines some local ordering behavior, such as the order of multiple providers declared by one module and the order derived from class-path configuration resources. But ordering between modules in the same layer is not a total business order an application should rely on.

This can therefore be too weak:

```java
ReportExporter exporter =
        ServiceLoader.load(ReportExporter.class)
                .findFirst()
                .orElseThrow();
```

when multiple providers expose different quality or capabilities.

A stronger flow is:

```text
discover candidates
→ validate compatibility
→ filter by capability
→ apply explicit priority/tie-breaker
→ select
```

`findFirst()` is appropriate when any valid provider is genuinely acceptable or when the pipeline has already imposed the host's selection policy.
