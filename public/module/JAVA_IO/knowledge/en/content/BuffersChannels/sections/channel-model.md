A `Channel` connects the program to an I/O source or sink. For a `ReadableByteChannel`, reading moves bytes **from the channel into the buffer**:

~~~java
int count = channel.read(buffer);
~~~

If `count > 0` bytes are read, the buffer's `position` advances by exactly that count. Depending on the channel type and mode, one read may produce fewer bytes than the remaining buffer space; for channels with EOF semantics, `-1` signals end of input.

A `WritableByteChannel` moves data in the opposite direction:

~~~java
int count = channel.write(buffer);
~~~

The channel consumes bytes from:

~~~text
[position, limit)
~~~

and advances `position` by the number of bytes actually written.

A copy loop using **blocking channels** (for example, `FileChannel`) makes both roles visible:

~~~java
ByteBuffer buffer = ByteBuffer.allocate(8 * 1024);

while (source.read(buffer) != -1) {
    buffer.flip();

    while (buffer.hasRemaining()) {
        target.write(buffer);
    }

    buffer.clear();
}
~~~

The inner `while (buffer.hasRemaining())` matters. A single `write` must not be assumed to consume everything remaining in the buffer; the return value reports the actual progress.

This loop deliberately uses a blocking-channel mental model. With a non-blocking channel, `read()` or `write()` may return `0` when no progress is currently possible, so the algorithm must integrate readiness/event-loop handling instead of spinning continuously with this pattern.

Compared with streams:

~~~text
Stream
→ abstraction centered on a sequential byte/character flow

Channel + Buffer
→ separates the conduit from the data staging area
→ buffer state becomes an explicit part of the algorithm
~~~

NIO is not automatically faster merely because a `Channel` is involved. The model is valuable because it enables explicit buffering, random access for suitable channels, non-blocking behavior for suitable channel families, and channel-specific operations such as transfer.
