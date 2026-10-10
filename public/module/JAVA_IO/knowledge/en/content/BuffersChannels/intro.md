# Buffers and Channels in NIO

Traditional streams encourage a “read the next byte” or “write the next byte” mental model. **NIO (New I/O)** is Java's I/O API family, primarily in `java.nio` and `java.nio.channels`, that adds another model: data is staged in a `Buffer` and moved through a `Channel`.

In this model, a `Buffer` is the **in-memory staging area** where application code places data to be written or receives data that was read. A `Channel` is the **I/O conduit/connection** that moves data between the buffer and a source or sink such as a file or socket. Separating “where the data currently lives” from “how it moves” makes readable/writable regions explicit, lets code handle transfers that make only partial progress, and enables capabilities specific to different channel types.

An NIO `Buffer` is also different from **buffering** in the Buffered I/O chapter. Buffering is the technique of batching many small I/O operations into larger ones to reduce overhead; an NIO `Buffer` is a stateful data object with values such as `position`, `limit`, and `capacity` that application code manipulates directly.

~~~text
data source
    ↓
 Channel
    ↓ read(...)
 Buffer
    ↓
application logic
~~~

For writing, the direction is reversed:

~~~text
application puts data into Buffer
    ↓
 Buffer
    ↓ write(...)
 Channel
    ↓
data sink
~~~

The hardest part for beginners is usually not the class names but **Buffer state**. Once `position`, `limit`, and `capacity` are precise, `flip`, `clear`, and `compact` become logical instead of memorized rituals.
