Instance/static field:

```java
MethodHandles.Lookup lookup = MethodHandles.lookup();

VarHandle value =
        lookup.findVarHandle(
                Counter.class,
                "value",
                int.class
        );
```

Nếu `Counter` có `static int globalValue`, static field dùng factory riêng:

```java
VarHandle globalValue =
        lookup.findStaticVarHandle(
                Counter.class,
                "globalValue",
                int.class
        );
```

`findVarHandle` dành cho instance field; `findStaticVarHandle` dành cho static field.

Array element:

```java
VarHandle element =
        MethodHandles.arrayElementVarHandle(
                int[].class
        );
```

View trên bytes:

```java
VarHandle ints =
        MethodHandles.byteArrayViewVarHandle(
                int[].class,
                ByteOrder.BIG_ENDIAN
        );
```

`byteBufferViewVarHandle` cung cấp tương tự cho `ByteBuffer`.

Những view này đưa byte order/alignment concerns vào bài toán. Native memory đầy đủ không thuộc module này; khi chuyển sang FFM, handoff sang Native Interoperability.
