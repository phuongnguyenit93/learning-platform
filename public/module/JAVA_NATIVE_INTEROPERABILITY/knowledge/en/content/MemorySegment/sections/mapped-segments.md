A mapped segment is a native memory segment backed by a **memory-mapped file region** rather than a freshly allocated anonymous native block.

Java 21 exposes an FFM preview overload on `FileChannel.map` that accepts an `Arena`:

```java
try (FileChannel channel = FileChannel.open(
        path,
        StandardOpenOption.READ,
        StandardOpenOption.WRITE);
     Arena arena = Arena.ofConfined()) {

    MemorySegment mapped = channel.map(
        FileChannel.MapMode.READ_WRITE,
        0,
        channel.size(),
        arena
    );
}
```

The arena controls the mapped segment's scope. When that scope ends, the segment becomes invalid and the mapping is released according to the API contract.

Mapped segments also expose mapping-related operations such as `load()`, `isLoaded()`, `unload()`, and `force()` where supported.

The relationship is:

```text
native segment
└─ off-heap region

mapped segment
└─ native segment whose region is backed by a file mapping
```

Mapped memory is still subject to the same segment bounds, lifetime, and thread-access checks.
