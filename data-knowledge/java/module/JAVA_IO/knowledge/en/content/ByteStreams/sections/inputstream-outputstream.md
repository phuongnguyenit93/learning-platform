A **stream** is a sequential view of values moving from a source into the program or from the program toward a sink. It does not imply that the entire payload is already stored in RAM; code commonly processes data as it flows past.

Do not confuse a `java.io` **I/O stream** with the `java.util.stream` **Stream API**. An I/O stream reads or writes data across a source/sink boundary; `Stream<T>` is a pipeline for processing elements with operations such as `map`, `filter`, and `reduce`. They share the word “stream” but solve different problems.

`InputStream` is the abstraction for **reading bytes from a source**. `OutputStream` is the abstraction for **writing bytes to a sink**.

```text
source ──> InputStream ──> application
application ──> OutputStream ──> sink
```

Both are **abstract classes**: base classes that define shared behavior rather than one concrete source or sink. A **contract** is the behavior callers may rely on, while a **subclass** supplies an implementation for the actual source or sink:

- `FileInputStream` / `FileOutputStream`: files.
- `ByteArrayInputStream` / `ByteArrayOutputStream`: memory.
- Streams obtained from sockets or other APIs: different resources with the same byte-stream contract.

Java also exposes three process-level standard streams: `System.in` is an `InputStream` for standard input, while `System.out` and `System.err` are `PrintStream` instances for standard output/error. `PrintStream` is convenient for `print/println/printf`, but its write/print methods do not propagate `IOException`; callers use `checkError()` when that distinction matters.

This lets byte-processing code depend on `InputStream` instead of knowing whether the bytes came from a file or memory.

Here is a UTF-8 payload written and read back through byte streams:

The example uses a temporary file as a controlled source/sink. `Path` and `Files` are only example scaffolding here; the later filesystem chapters explain them directly.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("bytes-", ".bin");
byte[] expected = "Xin chào Java ☕"
    .getBytes(java.nio.charset.StandardCharsets.UTF_8);

try (java.io.OutputStream out =
         new java.io.FileOutputStream(temp.toFile())) {
    out.write(expected);
}

byte[] actual;
try (java.io.InputStream in =
         new java.io.FileInputStream(temp.toFile())) {
    actual = in.readAllBytes();
}

System.out.println(java.util.Arrays.equals(expected, actual)); // true
java.nio.file.Files.deleteIfExists(temp);
```

`readAllBytes()` keeps the example small, but it loads all remaining data into memory. For large or unbounded input, read incrementally in chunks; the Buffered I/O chapter later explains how buffering reduces underlying I/O calls.
