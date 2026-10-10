Discovery only proves that a provider **can be located**. It does not prove that the provider is ready to serve.

Keep activation steps separate:

```text
discover
→ validate class/metadata
→ validate compatibility
→ create provider
→ initialize resources
→ mark ACTIVE
```

A `PdfExporter` might be discoverable but fail activation because a font engine, license, or configuration is unavailable.

Do not publish the plugin to the request-serving registry before activation succeeds.

When several plugins start together, define partial-failure policy explicitly:

- fail host startup for a required plugin;
- skip an optional plugin;
- run in degraded mode;
- retry according to a separate policy.

Selection should only see providers in a state that is valid for receiving work.
