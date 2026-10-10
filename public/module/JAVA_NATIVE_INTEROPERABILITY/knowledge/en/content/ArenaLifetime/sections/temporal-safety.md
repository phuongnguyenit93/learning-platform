Temporal safety prevents Java code from accessing a memory region after its lifetime has ended.

Every segment has an associated scope. Before an access proceeds, the API checks that the scope is still alive. If a closeable arena has already been closed, access through one of its segments fails with `IllegalStateException`.

```java
MemorySegment segment;

try (Arena arena = Arena.ofConfined()) {
    segment = arena.allocate(ValueLayout.JAVA_LONG);
}

// IllegalStateException: the backing scope is no longer alive
// segment.get(ValueLayout.JAVA_LONG, 0);
```

This is the managed answer to a classic native bug:

```text
native allocation freed
        ↓
old pointer retained
        ↓
use-after-free
        ↓
undefined behavior / corruption / crash
```

FFM prevents that class of mistake for accesses performed through the segment abstraction. It cannot prevent foreign native code from retaining and later dereferencing an address after Java has ended the corresponding lifetime.
