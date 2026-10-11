`ByteBuffer` carries both bytes and state through `position`, `limit`, and `capacity`. Network I/O advances the buffer position, so protocol state and buffer state have to be managed together.

One `read()` or `write()` **does not mean that an entire frame was processed**:

- `read(buffer)` can consume fewer bytes than `buffer.remaining()`; in non-blocking mode it can return `0`; `-1` marks end-of-stream.
- `write(buffer)` can write fewer than the remaining bytes. If `buffer.hasRemaining()` is still true, the unsent data must be retained for a later write.

A simple blocking write can loop until the buffer is drained:

```java
ByteBuffer out = StandardCharsets.UTF_8.encode("hello\n");
while (out.hasRemaining()) {
    channel.write(out);
}
```

For a non-blocking channel, that loop must not become a busy-spin when `write()` returns `0`. An event loop normally stores the pending buffer in connection state and enables `OP_WRITE` only while unsent data exists.

The read side commonly follows this state transition:

```text
channel.read(buffer)
        ↓
buffer.flip()      // switch from filling the buffer to reading received data
        ↓
parse/consume bytes
        ↓
buffer.compact()   // retain an incomplete frame and make room for more input
```

`clear()` is appropriate when all old data was consumed; `compact()` is useful when part of a frame remains. This is why buffer state and protocol framing must be designed together in non-blocking network code.
