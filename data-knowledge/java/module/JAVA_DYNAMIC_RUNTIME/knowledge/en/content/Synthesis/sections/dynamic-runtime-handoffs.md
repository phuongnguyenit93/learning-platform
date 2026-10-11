Major handoffs:

| When the question becomes... | Continue with |
| --- | --- |
| How do constant pool, resolution, bytecode execution, or JIT work? | JVM |
| How do `Class`, `Method`, and annotation inspection work? | Reflection |
| Are acquire/release/happens-before/CAS algorithms correct? | Concurrency |
| How do MethodHandles invoke native functions or access off-heap memory? | Native Interoperability |
| In which Java release did this feature appear/change? | Java Version |
| How do agents rewrite classes at runtime? | Instrumentation |

By the end of the module, you should be able to read a `Lookup → MethodHandle → adaptation → CallSite → invokedynamic` pipeline and recognize VarHandle as a separate variable-access branch.

More important than memorizing API names is identifying **the type contract, access capability, linkage object, and memory-semantics boundary** in a runtime design.
