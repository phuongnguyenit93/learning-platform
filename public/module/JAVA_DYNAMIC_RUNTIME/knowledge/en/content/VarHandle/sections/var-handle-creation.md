Instance/static fields:

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();

VarHandle value =
        lookup.findVarHandle(
                Counter.class,
                "value",
                int.class
        );
```

If `Counter` also has `static int globalValue`, static fields use a separate factory:

```java
VarHandle globalValue =
        lookup.findStaticVarHandle(
                Counter.class,
                "globalValue",
                int.class
        );
```

`findVarHandle` is for instance fields; `findStaticVarHandle` is for static fields.

Array elements:

```java
VarHandle element =
        MethodHandles.arrayElementVarHandle(
                int[].class
        );
```

Byte views:

```java
VarHandle ints =
        MethodHandles.byteArrayViewVarHandle(
                int[].class,
                ByteOrder.BIG_ENDIAN
        );
```

`byteBufferViewVarHandle` provides the corresponding abstraction for `ByteBuffer`.

Views introduce byte-order and alignment concerns. Full native-memory/FFM semantics belong to Native Interoperability.
