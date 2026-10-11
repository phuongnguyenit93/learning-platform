Two common ways to create a `ByteBuffer` are:

~~~java
ByteBuffer heap = ByteBuffer.allocate(8192);
ByteBuffer direct = ByteBuffer.allocateDirect(8192);
~~~

`allocate` creates a **heap buffer**. Its data resides in Java heap-managed memory and, for an appropriate buffer, the backing array can be accessed with `array()`.

`allocateDirect` creates a **direct buffer**. The JVM attempts to arrange memory so native I/O can use it efficiently on some data paths, potentially avoiding intermediate copies.

The main trade-offs are:

| Heap buffer | Direct buffer |
| --- | --- |
| Usually cheaper to allocate | Usually more expensive to allocate/reclaim |
| Convenient for ordinary Java logic | Can help when a long-lived buffer participates in repeated I/O |
| Often has an accessible backing array | Do not assume an accessible backing array |
| Data is backed by ordinary heap storage | Buffer contents may reside outside the normal garbage-collected heap, depending on the JVM implementation |

A direct buffer is still represented by a Java object. Its backing storage is managed by the JVM and may live outside the normal garbage-collected heap; application code does not receive a standard public `close()` method for releasing that storage on demand.

Do not replace every heap buffer with a direct buffer because “direct” sounds faster. For small operations or short-lived buffers, allocation cost can outweigh any I/O benefit. Choose based on the workload and measurement.

Other buffer types such as `CharBuffer` and `IntBuffer` exist, but `ByteBuffer` is central for byte-oriented file and network I/O. The next chapter applies this exact model to `FileChannel` for random access, transfers, locking, and memory mapping.
