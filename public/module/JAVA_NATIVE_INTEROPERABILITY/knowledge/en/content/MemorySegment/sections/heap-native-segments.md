Java 21 defines two broad kinds of memory segments.

**Heap segments** are backed by Java-heap storage. Factory methods such as `MemorySegment.ofArray(int[])` create a segment over an existing Java array:

```java
int[] values = {10, 20, 30};
MemorySegment heap = MemorySegment.ofArray(values);
```

**Native segments** are backed by off-heap memory and are commonly allocated through an `Arena`:

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment nativeMemory = arena.allocate(64);
}
```

The distinction matters because ownership and lifetime differ. Heap storage follows Java object reachability. Native allocation has a scope whose lifetime is controlled by the arena that produced it.

Thread-access semantics differ as well. Heap segments are accessible from any thread, while native segments follow the accessibility policy of their arena.

Use the same segment abstraction for reading and writing both kinds of memory, but do not assume their lifecycle or address capabilities are identical.
