When a JVM process starts, the runtime establishes VM-wide structures, threads, and the runtime policies/ergonomic defaults it needs. The initial application class is then loaded, linked, and initialized according to lifecycle rules before execution proceeds through the entry method.

```text
process startup
→ JVM runtime initialization
→ initial class loading/linking/initialization
→ entry-method frame
→ bytecode execution
→ adaptive optimization over time
```

This does not mean every application class is eagerly loaded at startup. Loading and linking continue dynamically as execution discovers additional types.
