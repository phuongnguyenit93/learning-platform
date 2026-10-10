Knowing when to **hand the problem to another curriculum owner** is part of understanding this module.

Hand off when the primary question becomes:

```text
detailed ClassLoader delegation/type-identity mechanics?
→ Java Core ClassLoader

complete module readability/exports/opens/resolution semantics?
→ JPMS / Module System

framework extension points, DI scopes, bean lifecycle?
→ the framework-specific owner

bytecode redefine/retransform or Java Agents?
→ Instrumentation

process sandboxing, security, or OS isolation?
→ system/infrastructure architecture
```

Runtime Extensibility keeps enough of these boundary concepts to design hosts and plugins correctly without duplicating their full curricula.

Clear boundaries help distinguish mechanisms used to implement a plugin system from concepts that are actually owned by this module.
