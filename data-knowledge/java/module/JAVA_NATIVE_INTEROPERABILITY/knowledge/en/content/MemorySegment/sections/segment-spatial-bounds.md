Every segment has a byte size. Access through that segment must stay entirely inside the represented range.

For a 16-byte segment, writing a four-byte integer at offset 12 is valid, while writing it at offset 14 would cross the end. The failing line uses `JAVA_INT_UNALIGNED` so the example isolates the bounds violation instead of also triggering an alignment violation:

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(16, ValueLayout.JAVA_INT.byteAlignment());

    segment.set(ValueLayout.JAVA_INT, 12, 99);                  // bytes 12..15
    // segment.set(ValueLayout.JAVA_INT_UNALIGNED, 14, 99);     // out of bounds
}
```

This is **spatial safety**. The bounds belong to the current segment view, not merely to some larger allocation that may exist underneath.

That matters for slices. If a 100-byte allocation is sliced to expose only 8 bytes, access through that slice is limited to those 8 bytes even though the backing allocation is larger.

Bounds checking protects accesses performed through Java's segment operations. It cannot stop arbitrary native code from misusing a pointer after Java passes that pointer across the boundary.
