Arena choice also determines thread accessibility.

A segment allocated from `Arena.ofConfined()` can only be accessed by the thread that created the arena. The same owner-thread restriction applies to closing that confined arena.

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(16);
    // use segment on this owner thread
}
```

If multiple threads must legally access the segment, use an arena whose policy allows it, such as `Arena.ofShared()`, `Arena.ofAuto()`, or `Arena.global()`.

Thread accessibility and thread safety are not the same thing:

```text
shared arena
→ FFM allows multiple threads to access the segment

application synchronization
→ still needed when those threads race on mutable native data
```

FFM enforces whether a thread is permitted to access the segment. It does not automatically make the data structure stored in that memory safe for concurrent mutation.

Once a memory region has explicit bounds, lifetime, and thread accessibility, the next question is what its bytes mean. The next chapter uses MemoryLayout to make native size, alignment, field placement, and pointer-shaped data explicit.
