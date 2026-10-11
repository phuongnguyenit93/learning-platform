VarHandle groups operations by access semantics:

```text
plain
→ get / set

opaque
→ getOpaque / setOpaque

acquire / release
→ getAcquire / setRelease

volatile
→ getVolatile / setVolatile

atomic / update
→ compareAndSet
→ compareAndExchange...
→ getAndSet
→ getAndAdd...
```

A stronger mode is not automatically “better.” It expresses a different ordering/atomicity contract and can carry different costs.

The goal here is to understand that VarHandle lets code **choose an access contract**. Formal memory-model proofs belong to Concurrency.

Not every VarHandle supports every access mode. For example:

- a VarHandle for a `final` field does not support write or atomic-update modes;
- numeric atomic updates are available only for supported numeric variable types;
- bitwise atomic updates are available only for the variable types documented by the API.

Invoking an unsupported access mode throws `UnsupportedOperationException`. Code can query `isAccessModeSupported` before relying on a mode.
