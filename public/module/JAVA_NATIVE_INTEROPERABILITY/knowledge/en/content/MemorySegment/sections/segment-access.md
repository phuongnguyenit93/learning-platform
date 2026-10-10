`MemorySegment` provides typed access operations. A `ValueLayout` specifies the size, alignment, byte order, and Java carrier expected for the value.

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(16, ValueLayout.JAVA_INT.byteAlignment());

    segment.set(ValueLayout.JAVA_INT, 0, 42);
    int value = segment.get(ValueLayout.JAVA_INT, 0);
}
```

For repeated homogeneous values, index-based methods express an element index rather than a raw byte offset:

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment values = arena.allocate(
        ValueLayout.JAVA_INT.byteSize() * 10,
        ValueLayout.JAVA_INT.byteAlignment()
    );

    for (int i = 0; i < 10; i++) {
        values.setAtIndex(ValueLayout.JAVA_INT, i, i * 10);
    }
}
```

An access succeeds only when the segment is alive, accessible from the current thread, large enough for the requested value, writable for writes, and compatible with the layout's alignment constraints.

Do not treat the layout argument as decorative metadata. It is part of the access contract.
