SPI evolution should prefer changes that allow existing providers to remain useful when that behavior is genuinely valid.

To isolate the evolution problem, the following example uses a **reduced `ReportExporter` variant** and adds an optional capability with a sensible default. It is an evolution sketch, not the current signature of the running example:

```java
public interface ReportExporter {
    void export(Report report);

    default boolean supportsStreaming() {
        return false;
    }
}
```

Default methods can reduce disruption, but use them only when the default semantics are truly correct. A fake default can hide incompatibility.

Other strategies include:

- add a separate capability interface such as `StreamingExporter`;
- support two SPI generations during migration;
- keep shared DTOs backward compatible;
- deprecate before removal;
- avoid silently changing exception or `null` semantics.

Do not use implementation casts as a hidden extension mechanism. If the host needs a capability, model it in a contract.

Validate evolution rules with contract tests against older providers rather than relying only on code review.
