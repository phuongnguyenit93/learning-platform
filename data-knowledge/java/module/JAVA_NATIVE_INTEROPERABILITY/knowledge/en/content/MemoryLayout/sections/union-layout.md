A `UnionLayout` models heterogeneous members that all begin at the **same starting offset**. This matches the overlapping storage semantics of a native union.

For example:

```c
union Value {
    int   i;
    float f;
};
```

can be described as:

```java
UnionLayout VALUE = MemoryLayout.unionLayout(
    ValueLayout.JAVA_INT.withName("i"),
    ValueLayout.JAVA_FLOAT.withName("f")
);
```

Unlike a struct, the members do not follow one another:

```text
struct → member A | member B | member C
union  → member A
         member B    all overlay the same starting bytes
         member C
```

The layout tells Java how the storage is shaped; it does not know which union member is logically active. If a native API uses a tag/discriminator to say which interpretation is valid, application code must honor that protocol.
