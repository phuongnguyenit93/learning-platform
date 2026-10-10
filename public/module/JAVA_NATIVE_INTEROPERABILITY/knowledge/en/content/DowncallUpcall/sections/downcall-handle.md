A bound downcall handle is created by combining a function address with a descriptor:

```java
Linker linker = Linker.nativeLinker();
MemorySegment symbol = linker.defaultLookup()
    .find("strlen")
    .orElseThrow();

MethodHandle strlen = linker.downcallHandle(
    symbol,
    FunctionDescriptor.of(
        ValueLayout.JAVA_LONG,
        ValueLayout.ADDRESS
    )
);
```

The returned `MethodHandle` has a Java method type derived from the descriptor and linker rules.

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment text = arena.allocateUtf8String("hello");
    long length = (long) strlen.invokeExact(text);
}
```

The exact native layout for a type such as C `size_t` is platform-dependent, so production descriptors should be derived from the actual target ABI rather than copied blindly from an example.

The linker also has an unbound downcall form whose resulting handle accepts the target address as a leading argument, useful when the function pointer varies at invocation time.
