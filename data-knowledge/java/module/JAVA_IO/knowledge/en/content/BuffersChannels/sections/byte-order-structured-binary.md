A `ByteBuffer` is not limited to individual `byte` operations. It also provides multi-byte primitive operations such as `putShort`, `putInt`, `putLong`, `putFloat`, `putDouble`, and matching `get...` methods. These are convenient for **structured binary** formats, where byte regions have defined meanings such as a four-byte version followed by an eight-byte timestamp.

~~~java
ByteBuffer buffer = ByteBuffer.allocate(12);

buffer.putInt(3);
buffer.putLong(1_700_000_000L);

buffer.flip();

int version = buffer.getInt();
long timestamp = buffer.getLong();
~~~

An `int` occupies four bytes and a `long` occupies eight. When several bytes form one value, code must know the **byte order (endianness)**: whether the most-significant or least-significant byte appears first in the data.

A newly created `ByteBuffer` uses `ByteOrder.BIG_ENDIAN` by default:

~~~text
value 0x01020304
BIG_ENDIAN     → 01 02 03 04
LITTLE_ENDIAN  → 04 03 02 01
~~~

If a file format or protocol specifies little-endian values, set the order before reading or writing multi-byte primitives:

~~~java
ByteBuffer little = ByteBuffer
        .allocate(8)
        .order(ByteOrder.LITTLE_ENDIAN);

little.putInt(0x01020304);
~~~

Byte order is **part of the data contract**, not a performance preference. Reading little-endian bytes as big-endian can still produce a perfectly valid Java number, but it will represent the wrong value. Byte order does not matter for isolated single-byte access; it matters when several bytes are interpreted as one primitive.

A `ByteBuffer` can also create typed views such as `asIntBuffer()` or `asLongBuffer()`. A view shares the underlying byte storage while exposing `int`- or `long`-sized elements; the byte order in effect when the view is created determines how those bytes are interpreted. Typed views can help with dense binary layouts, but the underlying model remains **byte storage + byte order + the primitive layout defined by the format**.
