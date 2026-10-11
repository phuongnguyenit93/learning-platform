Java supports several levels of extensibility. Not every system needs a `ModuleLayer`.

```text
1. Static wiring
   The host knows concrete implementations.

2. Interface + configurable wiring
   The host depends on a contract; configuration chooses an implementation.

3. ServiceLoader on the class path/module path
   Providers are discovered from the runtime environment.

4. Plugin architecture
   The host adds selection, lifecycle, failure, and compatibility policies.

5. ModuleLayer-based composition
   The host resolves and defines another graph of named modules in the JVM.
```

Each level adds flexibility and operational complexity.

For example, `ServiceLoader` solves **discovery and loading**. It does not automatically provide plugin lifecycle, dependency-conflict resolution, hot unload, version negotiation, or retries. Those are application architecture concerns.

A useful rule throughout this module is:

> Choose the simplest mechanism that still satisfies the required extension boundary and lifecycle.
