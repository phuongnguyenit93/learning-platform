Safe replacement usually follows **prepare → switch → retire** rather than stopping the old plugin before the new one proves usable.

```text
discover candidate
→ validate compatibility
→ initialize new plugin
→ health check
→ atomically switch registry/reference
→ drain old plugin
→ stop old plugin
```

If the new plugin fails before the switch, the host can keep the old provider.

Rollback after the switch can be harder if requests already produced side effects with the new version. Runtime lifecycle therefore does not automatically solve data or domain migration.

A versioned registry or immutable snapshot can help in-flight requests retain a consistent provider reference while replacement occurs.

If the architecture cannot provide rollback, document that limitation instead of implying that every “reload” is reversible.
