JIT (Just-In-Time) compilation converts sufficiently important bytecode into native machine code while the application is running.

Conceptually:

```text
method bytecode
→ collect profile
→ compilation request
→ optimization
→ machine code
→ later calls may execute the compiled version
```

JIT compilation can use runtime information for optimizations such as aggressive inlining based on observed receiver types.

Compilation itself consumes CPU and memory, so a runtime must decide **which code**, **when**, and **at what optimization level** should be compiled.
