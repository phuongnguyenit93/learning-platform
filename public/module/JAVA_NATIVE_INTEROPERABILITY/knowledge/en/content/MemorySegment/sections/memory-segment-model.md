A `MemorySegment` models a **contiguous region of memory with explicit bounds and lifetime semantics**. It is more than a numeric address.

The segment tells Java:

- how large the region is;
- whether the backing storage is heap or native memory;
- which scope controls its validity;
- which threads may access it;
- whether the view is read-only.

This changes the mental model from raw-pointer programming:

```text
raw pointer
→ "an address; the programmer remembers the rest"

MemorySegment
→ "bounded region + scope + access constraints"
```

A segment can represent an entire allocation or only a slice of one. Several segments may refer to overlapping parts of the same backing region while exposing different bounds.

FFM validates segment accesses before touching memory, which is the basis for spatial and temporal safety.
