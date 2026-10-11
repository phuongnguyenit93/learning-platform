Reading a directory is also I/O. For one directory level, `Files.list` returns a `Stream<Path>`:

This `Stream<Path>` is a **`java.util.stream.Stream`**, meaning the Stream API for processing `Path` elements; it is not an `InputStream` or `OutputStream`. The important twist is that this Stream API pipeline was created by an I/O operation and keeps a directory resource underneath it, so it still has a close lifecycle.

~~~java
try (Stream<Path> entries = Files.list(tempDir)) {
    entries.forEach(System.out::println);
}
~~~

The stream holds a filesystem resource while it is being traversed, so it must be closed. That is why it belongs in a try-with-resources statement.

For recursive traversal:

~~~java
try (Stream<Path> paths = Files.walk(tempDir)) {
    paths
            .filter(Files::isRegularFile)
            .forEach(System.out::println);
}
~~~

`Files.walk` traverses a directory tree to the requested depth. By default it does not follow symbolic links. If `FileVisitOption.FOLLOW_LINKS` is enabled, link cycles can lead to errors such as `FileSystemLoopException`.

When code needs per-file/per-directory callbacks, branch-specific failure handling, or explicit control over whether traversal continues after an error, `Files.walkFileTree` with a `FileVisitor` is a better fit.

`DirectoryStream<Path>` is another way to iterate directory entries:

~~~java
try (DirectoryStream<Path> stream =
             Files.newDirectoryStream(tempDir, "*.txt")) {
    for (Path entry : stream) {
        System.out.println(entry);
    }
}
~~~

`DirectoryStream` must also be closed. For very large directories or trees, avoid collecting every `Path` into a `List` if entries can be processed incrementally.
