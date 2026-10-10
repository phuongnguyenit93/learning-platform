An arena's most important job is to define the temporal boundary of native memory.

With a confined arena:

```java
MemorySegment segment;

try (Arena arena = Arena.ofConfined()) {
    segment = arena.allocate(32, ValueLayout.JAVA_INT.byteAlignment());
    segment.set(ValueLayout.JAVA_INT, 0, 7);
}

// arena is closed here; segment is no longer valid
```

Closing the arena releases the native regions it owns and makes associated segments unusable. Subsequent access through those segments fails rather than touching memory that has already been deallocated.

This relationship is deliberate:

```text
arena lifetime
    ↓
scope lifetime
    ↓
segment validity
    ↓
legal memory access
```

Do not model a segment's lifetime from the Java variable that stores it. A reference can still exist after the arena has closed; the scope, not variable reachability, determines whether access remains legal.
