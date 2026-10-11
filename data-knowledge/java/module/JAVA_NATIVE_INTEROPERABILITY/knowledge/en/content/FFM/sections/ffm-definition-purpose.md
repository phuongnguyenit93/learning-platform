The Foreign Function & Memory API (FFM) is Java's API for interacting with memory and functions outside the Java runtime. It brings two related problems under one model:

- **foreign memory**: representing and accessing memory regions that may live outside the Java heap;
- **foreign functions**: locating native symbols and calling them through the platform ABI.

The API exists because native integration needs more than a raw address. Java must also know how large a region is, how long it remains valid, which thread may access it, how native data is laid out, and what binary signature a function expects.

FFM makes those concerns explicit through Java objects instead of forcing the application to encode all boundary logic in hand-written JNI glue.

```text
native memory         → MemorySegment + Arena + MemoryLayout
native function       → SymbolLookup + FunctionDescriptor + Linker
Java ↔ native calls   → downcall / upcall MethodHandle boundary
```

The API improves the Java-side model of interoperability, but it does not make native code safe. A wrong native descriptor, unsafe pointer reinterpretation, or buggy foreign function can still corrupt memory or crash the process.
