Java portability comes from distributing a platform-neutral class-file representation rather than machine code compiled for every CPU/OS combination. The JVM installed on each target platform implements the common execution contract.

```text
same class file
   ├─→ JVM on Windows/x64
   ├─→ JVM on Linux/x64
   └─→ JVM on Linux/ARM64
```

This reduces coupling between the application artifact and a machine instruction set.

Portability is still not absolute. Application behavior can depend on file-system semantics, native libraries, default charset, OS scheduling, environment limits, or implementation-specific VM options.

So “write once, run anywhere” is best understood as a **portable execution contract**, not a guarantee that every environmental detail is identical.
