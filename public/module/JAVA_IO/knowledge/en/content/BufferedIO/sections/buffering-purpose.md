A buffer is temporary memory placed between application code and the underlying I/O resource/layer. A buffering wrapper batches small operations before forwarding data to the wrapped object underneath.

```text
many small reads                  fewer larger reads
application <── buffer <───────────────────────── source

many small writes                 fewer larger writes
application ──> buffer ─────────────────────────> sink
```

On input, a wrapper can fetch a block from the underlying stream and satisfy several smaller application reads from memory; fetching the next block into the buffer is often called a **refill**. On output, it can collect several small writes before forwarding a larger block.

The usual benefit is fewer crossings of a more expensive **boundary**, meaning the point where code must call into an underlying I/O/operating-system layer. Buffering does not change the payload and does not guarantee every algorithm becomes faster; the result depends on the source/sink, operation sizes, and whether another layer already buffers efficiently.

For example:

```java
for (byte value : data) {
    out.write(value);
}
```

If `out` is a `BufferedOutputStream`, those small `write` calls can be collected before data is passed to the underlying stream.
