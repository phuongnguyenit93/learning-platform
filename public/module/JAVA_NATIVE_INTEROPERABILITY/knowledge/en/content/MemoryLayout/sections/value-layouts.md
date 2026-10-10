A `ValueLayout` describes one scalar value in memory. It combines a byte size and alignment with a Java carrier type and byte order.

Java 21 provides common constants such as:

- `ValueLayout.JAVA_BYTE`
- `ValueLayout.JAVA_SHORT`
- `ValueLayout.JAVA_INT`
- `ValueLayout.JAVA_LONG`
- `ValueLayout.JAVA_FLOAT`
- `ValueLayout.JAVA_DOUBLE`
- `ValueLayout.ADDRESS` for pointer-shaped values

A value layout can be used directly with `MemorySegment.get` and `set`:

```java
try (Arena arena = Arena.ofConfined()) {
    MemorySegment segment = arena.allocate(ValueLayout.JAVA_INT);

    segment.set(ValueLayout.JAVA_INT, 0, 123);
    int value = segment.get(ValueLayout.JAVA_INT, 0);
}
```

The **carrier** is the Java type used by the access operation. For example, `JAVA_INT` uses `int`, while an `AddressLayout` uses `MemorySegment` as its carrier.

Do not assume that a C type always maps to the Java layout with the same familiar name. C type widths can depend on the platform ABI.
