Plugin isolation prevents an extension from implicitly sharing the host's entire class, dependency, and resource space with every other extension.

Without isolation, plugins can:

- require conflicting versions of one library;
- see implementation details they should not depend on;
- keep threads or resources that the host cannot clean up;
- spread failures through shared global state.

Isolation does not always mean a custom class loader. Requirements may call for different levels:

```text
logical isolation
→ contract + lifecycle + no shared mutable state

class-loader isolation
→ dependency/type namespace boundary

module-layer isolation
→ named-module graph + loader mapping

process isolation
→ stronger failure/security/resource boundary
```

This module focuses on in-JVM isolation. Process or container isolation belongs to a broader system architecture decision.
