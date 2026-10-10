A `SequenceLayout` models a homogeneous repetition of one element layout. It is the natural layout for fixed-size native arrays and repeated records.

```java
SequenceLayout TEN_INTS =
    MemoryLayout.sequenceLayout(10, ValueLayout.JAVA_INT);
```

Conceptually:

```text
sequenceLayout(4, JAVA_INT)

element 0 | element 1 | element 2 | element 3
   int    |    int    |    int    |    int
```

The sequence has an element count and an element layout. Its total byte size follows from repeating that element representation.

Sequence layouts can be nested to represent multidimensional data, or combined with struct layouts to describe arrays of records.

Use a sequence when the native contract says “repeat this same representation N times.” If members differ in type or meaning, a struct or union is the more appropriate model.
