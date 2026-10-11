An `AddressLayout` models a machine address stored in memory. Its Java carrier is `MemorySegment`, and its size/alignment depend on the platform's address representation.

The standard `ValueLayout.ADDRESS` constant represents a native address value:

```java
AddressLayout pointer = ValueLayout.ADDRESS;
```

An address layout can optionally have a **target layout** that describes the memory expected to exist at the stored address. That makes pointer relationships explicit in a larger structured layout.

This still requires caution. A pointer-sized value does not prove that the target memory is valid, large enough, alive, or owned by Java.

```text
address value
    ↓
points somewhere
    ↓
target layout says how Java intends to interpret that memory
    ↓
lifetime/ownership must still be correct
```

Some address/target-layout operations are restricted in Java 21 because incorrect pointer interpretation can escape normal memory-safety guarantees.
