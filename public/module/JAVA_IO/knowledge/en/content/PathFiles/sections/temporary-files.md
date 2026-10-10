Applications often need short-lived storage for intermediate data: an upload being processed, extracted files, transform output, a short-lived cache, or test fixtures. Manually choosing a name such as `tmp.txt` can collide across threads or processes and also forces the application to invent its own temporary-directory policy. `Files.createTempFile(...)` and `Files.createTempDirectory(...)` solve that problem by **actually creating** a new file or directory whose generated name is made suitably unique by the filesystem provider for that creation context.

```java
Path tempFile = Files.createTempFile("report-", ".txt");
Path tempDir = Files.createTempDirectory("work-");
```

Overloads without a parent use the environment's **default temporary-file directory**. When the application needs a controlled location, pass a directory explicitly:

```java
Path workspace = Path.of("work");
Files.createDirectories(workspace);

Path tempFile = Files.createTempFile(workspace, "upload-", ".bin");
Path tempDir = Files.createTempDirectory(workspace, "extract-");
```

Constructing a `Path` only creates a path value. By contrast, `createTempFile` and `createTempDirectory` are **filesystem operations**, and the resource exists when the method returns successfully.

A common misconception is that “temporary” means the JVM will automatically clean the resource up. **There is no such general guarantee.** Try-with-resources closes open streams/channels; it does not delete the file or directory that those handles refer to. Code that creates a temporary resource also needs an ownership and cleanup policy:

```java
Path temp = Files.createTempFile("job-", ".dat");

try {
    Files.writeString(temp, "intermediate data", StandardCharsets.UTF_8);
    process(temp); // application-defined helper
} finally {
    Files.deleteIfExists(temp);
}
```

For a temporary directory, its contents must be removed before the directory itself can be deleted; `Files.delete(tempDir)` is not recursive. That is one direct reason tree walking becomes relevant to cleanup of more complex temporary workspaces.

Some file-opening APIs accept `StandardOpenOption.DELETE_ON_CLOSE`:

```java
Path temp = Files.createTempFile("session-", ".bin");

try (SeekableByteChannel channel = Files.newByteChannel(
        temp,
        StandardOpenOption.WRITE,
        StandardOpenOption.DELETE_ON_CLOSE)) {
    channel.write(ByteBuffer.wrap(new byte[] {1, 2, 3}));
}
```

This option asks the implementation to make a **best-effort deletion** when the resource is closed. It is useful for temporary files whose lifetime is tightly coupled to one open handle, but it should not be the only cleanup strategy for every environment: provider/platform behavior can differ, and abnormal termination is not a transactional deletion guarantee. When cleanup is an application requirement, explicit ownership plus a clear `finally`/cleanup workflow is the safer mental model.
