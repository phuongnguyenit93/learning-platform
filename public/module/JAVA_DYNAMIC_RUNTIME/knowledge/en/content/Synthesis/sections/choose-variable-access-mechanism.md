Use VarHandle when the problem is variable abstraction plus explicit access semantics:

```text
ordinary field access is enough?
→ direct field/getter/setter access

runtime-selected field/array coordinate
or explicit access mode/CAS?
→ VarHandle
```

Good fits include:

- infrastructure libraries that pre-resolve field access;
- typed array or byte-buffer views;
- implementations of concurrency primitives that require acquire/release/CAS semantics.

Poor fits include:

- ordinary business-entity getters/setters;
- using VarHandle for “performance” without measurement;
- hiding unclear shared-state ownership behind atomic operations.
