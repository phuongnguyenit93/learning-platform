A `StructLayout` models heterogeneous members placed **one after another** in memory.

For a native structure such as:

```c
struct Point {
    int x;
    int y;
};
```

a corresponding FFM description can be:

```java
StructLayout POINT = MemoryLayout.structLayout(
    ValueLayout.JAVA_INT.withName("x"),
    ValueLayout.JAVA_INT.withName("y")
);
```

Names are useful because later layout paths can select members by name instead of hard-coded byte offsets.

Real native structs frequently contain padding required by an ABI. `structLayout` describes the member sequence you provide; when padding is part of the native representation, model it explicitly with `MemoryLayout.paddingLayout(...)` or otherwise construct the layout according to the target ABI.

The important rule is that the Java layout must reproduce the native structure's **actual binary representation**, not just its list of source-level field names.
