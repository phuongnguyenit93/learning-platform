`FileChannel.map` maps a file region into memory and returns a `MappedByteBuffer`. The example deliberately maps at most one 64 MiB window:

The main modes are `READ_ONLY`, `READ_WRITE`, and `PRIVATE`; `PRIVATE` uses copy-on-write semantics so the process's changes are not propagated as ordinary shared file updates.

~~~java
long regionSize = Math.min(channel.size(), 64L * 1024 * 1024);

if (regionSize > 0) {
    MappedByteBuffer mapped = channel.map(
            FileChannel.MapMode.READ_ONLY,
            0,
            regionSize
    );

    byte first = mapped.get(0);
}
~~~

Here, **virtual memory** is the operating-system mechanism that maps the address space seen by a process to RAM and data backed by storage. The operating system manages memory in blocks called **pages**; when code accesses a page that is not currently resident in RAM, a **page fault** occurs so the operating system can load or map the needed page.

The mental model is:

~~~text
file on storage
↕ operating-system virtual memory
MappedByteBuffer
↕
Java code accesses it like a buffer
~~~

Memory mapping can be useful for large files with substantial random access because the operating system manages page loading. The I/O cost has not disappeared; it appears through virtual-memory behavior such as page faults when a page is not resident in RAM.

Important boundaries include:

- A mapping has a specific offset and size; code must still respect its range.
- For `map(MapMode, long, long)`, one mapped region cannot be larger than `Integer.MAX_VALUE`; very large files may need windowed mappings. This overload predates Java 21, so the size limit is an API constraint rather than a Java-21-specific feature.
- Once successfully created, a mapping remains valid independently of whether the `FileChannel` stays open; closing the channel does **not** automatically unmap or invalidate an existing `MappedByteBuffer`.
- Concurrent truncation or mutation of the underlying file can make mapped access fail or become platform-sensitive.
- `MappedByteBuffer` has no standard application-facing `close()` operation that deterministically unmaps the region at a chosen source line, so its lifetime is less explicit than an ordinary channel.
- For a `READ_WRITE` mapping, `force()` requests that changes be written to the mapped file's storage device; the JDK gives its strongest guarantee for local storage. `force()` has no effect for `READ_ONLY` or `PRIVATE` mappings, so a copy-on-write `PRIVATE` mapping must not be treated as a persistent writable mapping.
- Mapping is most compelling for workloads with meaningful large-file random access; small or sequential files are usually simpler with ordinary streams/channels.

Memory mapping is therefore a specialized tool rather than the default for file I/O.
