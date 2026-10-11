A native function does not receive Java objects with Java field metadata. It receives bytes whose meaning is defined by a native data contract: value width, byte order, alignment, member order, padding, arrays, unions, and pointer-sized values.

`MemoryLayout` is FFM's way to describe that contract in Java.

```text
MemorySegment
→ where the bytes are

MemoryLayout
→ how those bytes are structured and interpreted
```

This distinction matters because Java object layout is not a portable representation of a C struct or another native data structure. Even fields with similar source-language names may have different size or alignment rules.

Layouts are immutable descriptions. They can report `byteSize()` and `byteAlignment()`, carry optional names, form nested structures, calculate offsets, and derive structured access handles.

The layout must match the native ABI contract. A syntactically valid Java layout that describes the wrong native structure is still an interoperability bug.
