A **downcall** is a call from Java into a foreign function. FFM represents the call site as a `MethodHandle` created by a `Linker`.

The call depends on three contracts:

```text
symbol address
→ which native function?

FunctionDescriptor
→ what argument/return layouts?

native Linker
→ how does this platform ABI perform the call?
```

For example, a native `strlen`-like function can be linked after resolving its symbol and describing its signature.

The downcall boundary is where Java values become ABI carriers and native execution begins. Once control enters the foreign function, the JVM cannot enforce the foreign implementation's internal pointer arithmetic or memory safety.

Treat a downcall as a typed but still native boundary: Java has a callable handle, yet correctness ultimately depends on the descriptor matching the real foreign function.
