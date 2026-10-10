Layout paths provide a structured way to navigate nested layouts. Instead of manually adding byte offsets, code selects members or sequence elements from the layout tree.

Example:

```java
StructLayout POINT = MemoryLayout.structLayout(
    ValueLayout.JAVA_INT.withName("x"),
    ValueLayout.JAVA_INT.withName("y")
);

long yOffset = POINT.byteOffset(
    MemoryLayout.PathElement.groupElement("y")
);
```

Paths can describe group members, fixed or open sequence elements, and—in address-layout cases—dereference steps where the API permits them.

The same path model supports operations such as:

- `byteOffset(...)` to compute a fixed offset;
- `select(...)` to obtain a nested layout;
- `sliceHandle(...)` to produce slices for selected regions;
- `varHandle(...)` to obtain structured memory access.

This chapter uses those APIs only as FFM layout tools. The deeper mechanics of `VarHandle` and `MethodHandle` belong to Dynamic Runtime.

Prefer layout paths when the native structure is nested or reused. They keep the access logic connected to the declared data shape and reduce duplicated magic offsets.

Layouts make native data contracts explicit; foreign-function calls need the same discipline for function signatures. The next chapter connects layouts with SymbolLookup, FunctionDescriptor, and Linker so Java can resolve and describe a callable native entry point.
