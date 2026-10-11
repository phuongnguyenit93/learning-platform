Start with **what the data means**, not which API sounds newer.

| Problem | Typical abstraction |
| --- | --- |
| Sequential binary bytes | `InputStream` / `OutputStream` |
| Primitive binary fields with a fixed schema/order | `DataInput` / `DataOutput`, commonly through `DataInputStream` / `DataOutputStream` |
| Text as characters | `Reader` / `Writer` |
| Filesystem operations around paths | `Path` + `Files` |
| Inspect path capabilities/storage/provider | `Path.getFileSystem()` + `FileSystem` / `FileStore` |
| Monitor directory changes | `WatchService` |
| Small bounded file, one-shot convenience | `Files.readString`, `writeString`, `readAllBytes`... |
| Byte I/O that needs Buffer/Channel model | `Channel` + `ByteBuffer` |
| File position, random access, transfer, lock, map | `FileChannel` |
| Positional file I/O with asynchronous completion | `AsynchronousFileChannel` |
| Packaged resources on the classpath/module path | `Class.getResource(...)` / `Class.getResourceAsStream(...)` / `ClassLoader.getResource(...)` / `ClassLoader.getResourceAsStream(...)` |

Copying an image should not go through a `Reader` because the payload is binary:

~~~java
try (
        InputStream in = Files.newInputStream(source);
        OutputStream out = Files.newOutputStream(target)
) {
    in.transferTo(out);
}
~~~

Reading UTF-8 text line by line fits `BufferedReader`:

~~~java
try (BufferedReader reader =
             Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
    String line;

    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
~~~

For a filesystem-level operation, `Files` is often clearer than constructing streams:

~~~java
Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
~~~

When the requirement is reading at a particular file offset:

~~~java
try (FileChannel channel =
             FileChannel.open(path, StandardOpenOption.READ)) {
    ByteBuffer header = ByteBuffer.allocate(16);
    channel.read(header, 128);
}
~~~

This example only demonstrates **reading at an offset**. If the contract requires a complete 16-byte header, the code must still loop using the actual read count; before consuming bytes from `header` with `get(...)`, call `flip()` to switch the buffer into read mode.

A practical rule is:

~~~text
choose the abstraction that matches the problem
→ keep the solution small and explicit
→ move to a lower-level mechanism only when its capability is required
~~~

A channel is not an “always better stream.” A reader/writer is not a text-shaped wrapper for arbitrary data. Each abstraction answers a different kind of I/O question.

Likewise, `DataInputStream` does not replace `ObjectInputStream`: it reads **primitive fields according to a format both sides already agree on**, while native object serialization carries its own object-graph/version contract. `AsynchronousFileChannel` is not “automatically faster” than `FileChannel` either; it changes how completion is organized and is useful only when the workload/architecture needs asynchronous file operations.

For filesystem work, do not assume every `Path` is the same kind of operating-system path. If code depends on POSIX permissions, atomic moves, `WatchService`, `toFile()`, or another capability, remember that the path belongs to a `FileSystem`/provider and check the capability rather than inferring it from the developer machine.

A **classpath/module-path resource** belongs to a different namespace from the filesystem. `Class.getResourceAsStream(...)` or `ClassLoader.getResourceAsStream(...)` may read content packaged inside a JAR or another source managed by a class loader, so code must not assume a resource found this way can always become a local `File` or `Path`. When the API returns a stream, normal stream-lifecycle rules still apply. Relative/root lookup rules, delegation, and resource enumeration belong to the **ClassLoader** module; the I/O boundary to retain is that **a classpath resource is not the same thing as a filesystem path**.
