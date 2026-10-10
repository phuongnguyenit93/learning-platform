An SPI plus `ServiceLoader` solves **contract + discovery**. A complete plugin architecture must also answer questions such as:

```text
which providers may activate?
→ who owns lifecycle?
→ how are plugin failures contained?
→ which dependencies are shared?
→ where is compatibility validated?
```

Once these questions matter, a provider is more than “an implementation that was found.” It becomes a **plugin** with a host-managed boundary and lifecycle.

A typical flow is:

```text
discover
→ validate
→ select
→ initialize
→ activate
→ execute
→ deactivate
→ clean up
```

Java does not provide a universal plugin framework through `ServiceLoader`. The application builds the remaining orchestration on top of Java's discovery and module primitives.
