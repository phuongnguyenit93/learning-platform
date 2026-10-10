Three layout properties are fundamental to ABI correctness:

- **size**: how many bytes the layout occupies;
- **alignment**: which byte boundaries are valid for correctly aligned access;
- **offset**: where a selected member begins relative to the enclosing layout.

`MemoryLayout.byteSize()` and `byteAlignment()` expose the first two. Layout paths and `byteOffset(...)` can calculate member offsets.

Consider:

```java
StructLayout RECORD = MemoryLayout.structLayout(
    ValueLayout.JAVA_BYTE.withName("kind"),
    MemoryLayout.paddingLayout(3),
    ValueLayout.JAVA_INT.withName("value")
);
```

The padding moves `value` to the intended offset. Without matching the native structure's padding/alignment rules, Java can read the correct number of bytes from the wrong location.

Alignment is also enforced during access. A layout can require a stricter aligned address than an arbitrary byte offset provides.

Never guess offsets from source code appearance. Derive them from the real native ABI and encode that representation in the layout.
