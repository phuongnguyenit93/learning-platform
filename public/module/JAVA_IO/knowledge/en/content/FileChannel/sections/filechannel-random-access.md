Streams naturally encourage sequential processing from beginning to end. A `FileChannel` has a **file position**:

~~~java
long current = channel.position();
channel.position(10);
~~~

`read(buffer)` reads from the current position and advances it by the number of bytes read. `write(buffer)` writes at the current position and advances it by the number of bytes actually written.

For example, write a UTF-8 payload and then return to the start:

~~~java
ByteBuffer data =
        StandardCharsets.UTF_8.encode("Hello FileChannel");

while (data.hasRemaining()) {
    channel.write(data);
}

channel.position(0);
~~~

Random access is even clearer with positional read/write:

~~~java
ByteBuffer part = ByteBuffer.allocate(5);
int read = channel.read(part, 6);
~~~

The `read(buffer, position)` overload reads at the requested offset **without changing the channel's shared file position**. `write(buffer, position)` has the same property for ordinary writable channels. Do not rely on positional-write semantics when the channel is opened with `APPEND`: the JDK leaves the effect of writing at a given position in append mode unspecified.

When a positional write may consume only part of the buffer, the next file offset must advance by the number actually written:

~~~java
ByteBuffer patch = StandardCharsets.UTF_8.encode("JAVA");
long offset = 0;

while (patch.hasRemaining()) {
    int written = channel.write(patch, offset);
    if (written <= 0) {
        throw new IOException("Positional write made no progress");
    }
    offset += written;
}
~~~

`FileChannel` also exposes file size and truncation:

~~~java
long size = channel.size();
channel.truncate(100);
~~~

`truncate(100)` shortens a file that is larger than 100 bytes. It does not automatically extend a smaller file to 100 bytes.

When an application has a **durability** requirement — how strongly written data is expected to survive failures such as a process/JVM stop or power loss, within the guarantees of the storage system — `force(...)` can request that updates be pushed to storage:

~~~java
channel.force(true);
~~~

The boolean controls whether metadata must also be requested: `force(false)` focuses on file-content updates, while `force(true)` also requests the necessary metadata updates. This operation has a cost and its final guarantees still depend on the **storage stack**, meaning the layers from the JVM and operating system through the filesystem, caches, and physical storage device. Do not call it after every small write merely as a generic “safety” measure; define the durability requirement first.

`FileChannel.force(...)` is also not a replacement for `MappedByteBuffer.force()`. When data is modified through a memory-mapped buffer, the mapped buffer has its own `force()` operation for requesting that mapped changes be written to storage.

`RandomAccessFile` is the older `java.io` API for the same broad family of random-access file problems. It exposes a file pointer moved with `seek(...)` and implements `DataInput`/`DataOutput`, which can be convenient in legacy code or code that deliberately uses that primitive-oriented style. `FileChannel` fits better when the problem needs `ByteBuffer`, positional operations that do not change the shared position, transfer, locking, or mapping. `RandomAccessFile.getChannel()` returns a channel associated with the same file, and the two APIs have linked file positions, so mixing both abstractions in the same flow requires care.
