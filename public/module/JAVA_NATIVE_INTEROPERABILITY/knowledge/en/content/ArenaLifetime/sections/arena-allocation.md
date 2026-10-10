Because `Arena` is also a `SegmentAllocator`, it provides allocation methods that return native `MemorySegment` instances associated with the arena's scope.

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment bytes = arena.allocate(128);
    MemorySegment ints = arena.allocate(
        ValueLayout.JAVA_INT.byteSize() * 10,
        ValueLayout.JAVA_INT.byteAlignment()
    );
}
```

The advantage of a closeable arena is **timely deallocation**. Try-with-resources makes the native lifetime visible in ordinary Java control flow:

```text
enter block
   ↓
allocate native resources
   ↓
use segments
   ↓
leave block
   ↓
arena.close()
   ↓
memory released + segments invalidated
```

This is preferable when the application knows exactly when a native working set is no longer needed.

Automatic and global arenas are useful for different lifetimes, but they give up deterministic reclamation. Use the narrowest lifetime that matches the native contract.
