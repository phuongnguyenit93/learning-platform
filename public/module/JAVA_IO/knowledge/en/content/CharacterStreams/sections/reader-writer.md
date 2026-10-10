`Reader` is the abstraction for **reading character data**. `Writer` is the abstraction for **writing character data**.

```text
text source ──> Reader ──> char data ──> application
application ──> char data ──> Writer ──> text sink
```

Their APIs follow the stream mental model but use Java characters as the logical unit:

- `Reader.read()` returns a character value as an `int`, or `-1` at EOF. The wider type lets the API represent character values while reserving `-1` to signal end-of-stream.
- `Reader.read(char[])` returns the number of `char` values actually read.
- `Writer.write(...)` can write a `char`, `char[]`, or `String`.

Like byte streams, `Reader.read(char[])` does **not** promise to fill the array. Code that requires exactly N characters must loop using the actual read count rather than assuming one call is enough.

`PrintWriter` is a convenience writer for `print/println/printf`. Like `PrintStream`, its write/print methods do not propagate `IOException`; callers use `checkError()` when they need to observe an I/O failure. That behavior differs from writers such as `BufferedWriter`, so convenience should not hide an error-handling requirement.

A memory-only example:

```java
try (java.io.Reader reader =
         new java.io.StringReader("Java I/O")) {
    char[] buffer = new char[4];
    int count = reader.read(buffer);
    System.out.println(new String(buffer, 0, count)); // Java
}
```

`Reader` and `Writer` let text-processing code work at the right abstraction level. Files and networks still carry bytes underneath, so Java needs a bridge between the character and byte layers.
