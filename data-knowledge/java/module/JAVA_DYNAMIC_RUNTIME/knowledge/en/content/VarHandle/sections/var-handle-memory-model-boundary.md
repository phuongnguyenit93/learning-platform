VarHandle defines access modes with different memory-ordering effects, but this module establishes only the API vocabulary and boundary.

```text
plain
opaque
acquire/release
volatile
```

To answer questions such as:

- which operation happens-before another;
- what acquire/release orders;
- whether a CAS loop is linearizable;
- whether an object is safely published;

you need Java Memory Model reasoning from Concurrency.

`VarHandle` also exposes fence operations such as `acquireFence`, `releaseFence`, and `fullFence` (plus related variants). This module only identifies them as ordering primitives; deciding where fences are correct and proving their memory-ordering effects belongs to Concurrency.

```text
Dynamic Runtime
→ VarHandle shape + modes + invocation mechanics

Concurrency
→ correctness implications of memory ordering
```

This boundary avoids teaching an incomplete JMM inside an API chapter.
