FFM adds safety checks around memory that raw pointer APIs typically leave to the programmer.

The two central guarantees are:

- **spatial safety**: access is checked against the bounds of the `MemorySegment`;
- **temporal safety**: access is checked against the lifetime of the segment's scope.

With a confined arena:

```java
MemorySegment segment;

try (Arena arena = Arena.ofConfined()) {
    segment = arena.allocate(16, ValueLayout.JAVA_INT.byteAlignment());
    segment.set(ValueLayout.JAVA_INT, 0, 42);
}

// The arena is closed; the segment is no longer valid.
// segment.get(ValueLayout.JAVA_INT, 0) throws IllegalStateException.
```

FFM also models thread accessibility: memory allocated from a confined arena is restricted to the arena's owner thread, while shared, global, and automatic arena memory can be accessible from multiple threads.

These guarantees apply to Java's access through the FFM abstractions. Once an address is passed to arbitrary native code, that code can still perform unsafe operations beyond what Java can check. FFM narrows the unsafe surface; it does not sandbox the native function.
