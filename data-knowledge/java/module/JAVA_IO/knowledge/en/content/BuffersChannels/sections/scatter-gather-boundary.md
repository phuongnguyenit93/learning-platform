Some byte channels, including `FileChannel`, can read or write **an array of `ByteBuffer` values in one operation**.

A **scattering read** distributes incoming bytes across several buffers in order:

~~~java
ByteBuffer header = ByteBuffer.allocate(16);
ByteBuffer body = ByteBuffer.allocate(1024);

long read = channel.read(new ByteBuffer[]{header, body});
~~~

The channel visits the buffers in order, filling an earlier buffer before continuing into a later one while data and space remain. Each buffer's `position` advances by the number of bytes that buffer actually receives.

A **gathering write** performs the opposite operation: it consumes remaining bytes from several buffers in order and writes them as one byte sequence to the channel:

~~~java
header.flip();
body.flip();

long written = channel.write(new ByteBuffer[]{header, body});
~~~

This model is useful when data naturally has multiple regions such as `header + payload`, because code does not have to copy everything into one large buffer merely to perform I/O.

The ordinary partial-operation rules still apply. The return value is the **total number of bytes actually transferred**, and one call may leave data in one or more buffers. Code must inspect each buffer's `position`/`hasRemaining()` state and continue according to the channel contract when necessary.

Scatter/gather also **does not mean that the buffers are processed in parallel**. It is still one ordered channel operation over multiple data regions. Parallelism, scheduling, and coordination among tasks or threads are separate concerns.
