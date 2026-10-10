Native interoperability is the set of mechanisms that let Java code cross from the managed Java runtime into code, data, or services represented in a native form. Typical targets are operating-system libraries, existing C APIs, device/vendor libraries, and memory whose lifetime is not managed as ordinary Java objects.

The key mental model is a **boundary between two execution worlds**. On the Java side, the JVM gives you managed objects, garbage collection, Java type safety, Java exceptions, and Java thread/runtime rules. On the native side, the contract is expressed through binary symbols, addresses, calling conventions, native data layouts, explicit resource lifetime, and platform-specific behavior.

This module studies the Java-facing mechanisms used to cross that boundary:

```text
Java code
   |
   +--> JNI  ------------------> native implementation using the JNI contract
   |
   +--> FFM  ------------------> native memory + foreign functions
                                   through MemorySegment, Arena,
                                   MemoryLayout, Linker, SymbolLookup
```

The goal is not to learn C or operating-system internals in full. The goal is to understand what Java must describe, own, validate, and clean up when the JVM no longer controls the whole operation.
