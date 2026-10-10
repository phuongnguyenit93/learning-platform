`Linker.upcallStub(...)` creates executable native code that adapts a foreign callback invocation to a Java `MethodHandle` target.

```java
MemorySegment callback = linker.upcallStub(
    targetHandle,
    callbackDescriptor,
    arena
);
```

The returned `MemorySegment` is a zero-length segment whose address is the native function pointer. Native code can receive that address as a callback argument.

The stub is associated with the supplied `Arena`. Its executable storage remains valid only for that lifetime.

The Java target must not let exceptions escape through the upcall boundary. Java 21's linker contract is categorical: if the target `MethodHandle` throws during an upcall, the JVM **will terminate abruptly**. Handle failures inside the callback and translate them into a native-compatible result/status.

Creating an upcall stub is a restricted operation in Java 21 because an invalid function-pointer contract can crash the process.
