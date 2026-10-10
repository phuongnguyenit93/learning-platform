The garbage collector can reclaim Java objects after they become unreachable. On systems that use **file descriptors**, a descriptor is an operating-system identifier for an open I/O resource such as a file, socket, or pipe; other platforms may expose an equivalent **native handle** for resources such as files, sockets, or devices. These resources live outside the Java heap and must be released at a predictable point in the program.

Many I/O abstractions therefore have a lifecycle:

```text
acquire/open
    ↓
read/write
    ↓
flush when needed
    ↓
close
```

A basic example:

`Path`/`Files` appear here only to create and remove a safe temporary file; learners do **not** need to understand that filesystem API yet. The later `File` and `Path/Files` chapters introduce those concepts from the beginning.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("io-", ".txt");

try (java.io.OutputStream out =
         new java.io.FileOutputStream(temp.toFile())) {
    out.write("Xin chào Java ☕"
        .getBytes(java.nio.charset.StandardCharsets.UTF_8));
}

java.nio.file.Files.deleteIfExists(temp);
```

`try-with-resources` closes the stream automatically even if the body throws an exception. It is the main Java mechanism for binding a resource lifetime to a clear **code scope**, the block of code in which that resource is owned.

Not every stream owns an operating-system resource. `ByteArrayInputStream`, for example, only reads a byte array in memory and its `close()` has no resource-release effect. Even so, code receiving a general `InputStream` still needs a clear answer to **who owns the stream and who is responsible for closing it**. The later Resource Management chapter develops that ownership model in detail.

With this mental model in place, the next chapter can focus on the lowest stream abstraction: how Java reads and writes raw bytes.
