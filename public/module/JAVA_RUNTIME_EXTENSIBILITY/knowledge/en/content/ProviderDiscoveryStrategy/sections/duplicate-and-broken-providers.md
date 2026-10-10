“Multiple providers” does not automatically mean duplication. Multiple implementations are a normal SPI use case.

Duplication can occur at different levels:

```text
the same provider class is listed repeatedly
→ Java has duplicate-elimination rules for service configuration

different provider classes claim the same business capability
→ the application must resolve the ambiguity
```

For example, two exporters may both report `format() == "pdf"`. The host needs a policy: prefer one, reject the ambiguity, or choose by capability/version.

A broken provider is different from an unsupported provider. A broken provider is present in configuration but fails to load or instantiate; an unsupported provider is healthy but does not match the current request.

A useful architecture often normalizes discovery once:

```text
ServiceLoader
→ validate provider
→ normalize metadata
→ detect capability collisions
→ build an immutable registry
```

The request path can then use a validated registry instead of performing raw discovery repeatedly.

A selection policy only helps when providers are actually **registered and deployed correctly in the runtime topology**. The next chapter therefore moves from “which provider should be selected?” to how the class path and module path encode the provider registration and discovery boundary.
