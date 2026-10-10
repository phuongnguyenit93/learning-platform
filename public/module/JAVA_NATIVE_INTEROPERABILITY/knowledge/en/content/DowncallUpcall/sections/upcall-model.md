An **upcall** reverses the direction: native code calls a Java target through a native function pointer.

This is useful for native APIs that accept callbacks, such as comparators, event handlers, visitor functions, or completion functions.

The conceptual flow is:

```text
Java MethodHandle
      ↓
FunctionDescriptor for callback ABI
      ↓
Linker.upcallStub(...)
      ↓
native function pointer
      ↓
foreign code invokes pointer
      ↓
JVM executes Java target
```

The descriptor must match both sides: the native callback type and the Java target method-handle type.

Upcalls introduce an extra responsibility that ordinary downcalls do not: the function pointer may be stored by native code and invoked later. That makes callback lifetime and thread assumptions part of the integration contract.
