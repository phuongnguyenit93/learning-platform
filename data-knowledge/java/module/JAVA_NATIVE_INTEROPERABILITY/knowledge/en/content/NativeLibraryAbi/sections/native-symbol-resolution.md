A **symbol** is a linker-visible name associated with an address or object in native code. For foreign-function calls, Java usually cares about exported function symbols.

Suppose a C library exports:

```c
int add(int a, int b);
```

At runtime, interoperability code needs two independent pieces of information:

```text
"add"  ----------------------> which native entry point?
int(int, int) + ABI details -> how may that entry point be called?
```

JNI native-method binding performs its own mapping between Java native methods and native implementations, either through name-based linkage or explicit registration. FFM exposes the steps more directly: `SymbolLookup` finds a symbol and `Linker` combines its address with a `FunctionDescriptor`.

Symbol names can be affected by the native toolchain. C++ name mangling is a classic example: a source-level function name may not be exported as a simple C symbol unless the native API deliberately exposes a stable C ABI.

Linkage therefore means more than “the file loaded.” It is the process of connecting the Java-side call site to the intended native entry point under a compatible binary contract.
