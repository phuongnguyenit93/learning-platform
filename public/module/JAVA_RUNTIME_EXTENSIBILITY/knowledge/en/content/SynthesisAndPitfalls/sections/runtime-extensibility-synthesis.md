The final mental model is:

```text
Runtime Extensibility
=
stable contract
+ independently deployable provider
+ explicit discovery context
+ application-owned selection policy
+ lifecycle
+ compatibility
+ isolation/failure boundary
```

In Java:

```text
SPI
→ defines the capability

ServiceLoader
→ locates/loads providers

Class Path / Module Path
→ provider deployment models

ClassLoader
→ visibility and type-identity boundary

Configuration / ModuleLayer
→ dynamic named-module graph
```

If you retain one principle, make it this: **discovery is not the whole plugin architecture**.

Start from the contract and the requirement. Add `ServiceLoader`, custom loaders, or `ModuleLayer` only when each mechanism solves a concrete problem that a simpler level cannot solve.
