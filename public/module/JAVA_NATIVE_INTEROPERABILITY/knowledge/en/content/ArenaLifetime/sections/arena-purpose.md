An `Arena` is the FFM abstraction that combines **native-memory allocation with lifetime and thread-access policy**.

The core problem is that off-heap memory is not reclaimed merely because a Java variable stops referencing it. Java therefore needs an explicit object that says:

- where new native allocations come from;
- how long those allocations remain valid;
- when their backing memory can be released;
- which threads may access segments associated with that lifetime.

```text
Arena
  ├─ allocates native memory
  ├─ owns a Scope
  ├─ defines when that scope is alive
  └─ defines thread accessibility
```

Every native segment allocated by an arena is associated with the arena's scope. Closing a closeable arena ends that lifetime and invalidates the segments tied to it.

Think of the arena as the lifetime owner, while `MemorySegment` is a bounded view used to access the memory.
