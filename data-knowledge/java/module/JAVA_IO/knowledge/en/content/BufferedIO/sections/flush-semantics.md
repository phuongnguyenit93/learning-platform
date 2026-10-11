With buffered output, data recently written by the application may still live only in the wrapper's memory. `flush()` asks the stream or writer to push pending data to the **next layer underneath it**.

```text
application
    ↓ write
buffer
    ↓ flush
underlying stream/writer
    ↓
OS / device / peer
```

`flush()` matters when a receiver must observe data **before the stream is closed**, for example:

- a request/response protocol is waiting for the current message;
- an interactive program must display a prompt now;
- a long-lived writer has completed one logical batch.

For example:

```java
try (java.io.BufferedWriter writer =
         new java.io.BufferedWriter(
             new java.io.OutputStreamWriter(
                 socketOutputStream,
                 java.nio.charset.StandardCharsets.UTF_8))) {
    writer.write("PING");
    writer.newLine();
    writer.flush(); // push pending characters downstream now
}
```

`socketOutputStream` is an example variable representing an output stream already obtained from a socket; it is not a special JDK API name.

`flush()` does **not** mean the data is physically durable on disk. It only pushes data through buffers controlled by the current abstraction toward the next layer. File durability involves other mechanisms such as the filesystem, `FileDescriptor.sync()`, or `FileChannel.force(...)`.

Normal output wrappers flush what they need to while closing. With a short-lived resource in `try-with-resources`, calling `flush()` immediately before `close()` purely by habit is usually redundant. An explicit flush is useful when code needs a visibility or protocol boundary while the resource remains open.
