A broken plugin should not automatically leave the whole host in an undefined state.

At minimum distinguish:

```text
discovery/configuration failure
→ provider cannot be loaded

activation failure
→ provider loads but cannot start

request failure
→ one plugin operation fails

fatal integrity failure
→ host invariant is compromised and host shutdown may be appropriate
```

Invocation can be wrapped for observability:

```java
try {
    exporter.export(report);
} catch (PluginException ex) {
    metrics.pluginFailure(exporter.getClass().getName());
    throw ex;
}
```

But catching exceptions does not create perfect isolation. A plugin can still deadlock threads, exhaust memory, or corrupt shared mutable state.

When failure containment must be stronger than an in-JVM boundary can provide, process isolation may be the correct architecture.
