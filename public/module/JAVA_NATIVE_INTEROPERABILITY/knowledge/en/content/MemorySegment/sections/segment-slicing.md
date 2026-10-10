A slice is another `MemorySegment` view over part of an existing segment's backing region. Creating a slice does not inherently copy the bytes.

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment block = arena.allocate(64);
    MemorySegment header = block.asSlice(0, 16);
    MemorySegment payload = block.asSlice(16, 48);
}
```

The views have different bounds:

```text
block   : 64 bytes
header  : first 16 bytes
payload : remaining 48 bytes
```

Overlapping views observe the same backing memory. A write through one segment can therefore be visible through another segment that covers the same bytes.

Slices retain the lifetime relationship of their backing region. A slice cannot remain usable after the relevant scope is no longer alive.

Bounded views are useful for expressing ownership and intent. Passing a small slice to code that only needs a header is safer and clearer than exposing the entire buffer.

Bounds answer **where** a segment may access memory, but not **how long** that access remains valid. The next chapter introduces Arena as the owner of native-allocation lifetime and thread-access policy.
