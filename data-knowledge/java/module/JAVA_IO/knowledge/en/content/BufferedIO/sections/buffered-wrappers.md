Java uses wrapper objects to preserve the stream/reader contract while adding buffering:

```text
bytes:
FileInputStream  → BufferedInputStream
FileOutputStream → BufferedOutputStream

text:
InputStreamReader  → BufferedReader
OutputStreamWriter → BufferedWriter
```

A buffered UTF-8 round trip:

The `Path`/`Files` calls in this example only create and clean up a temporary file. Learners do not need the filesystem API yet; the point here is the buffering wrappers and the writer/reader chain.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("buffered-", ".txt");
String expected = "Xin chào Java ☕";

try (java.io.BufferedWriter writer =
         new java.io.BufferedWriter(
             new java.io.OutputStreamWriter(
                 new java.io.FileOutputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    writer.write(expected);
}

String actual;
try (java.io.BufferedReader reader =
         new java.io.BufferedReader(
             new java.io.InputStreamReader(
                 new java.io.FileInputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    actual = reader.readLine();
}

System.out.println(expected.equals(actual)); // true
java.nio.file.Files.deleteIfExists(temp);
```

Closing the outer wrapper closes its underlying chain according to these classes' contracts. When the current application scope owns the whole chain, it normally closes the outermost wrapper rather than separately closing every layer; wrapping a caller-owned resource does not silently transfer application-level ownership.

Adding more buffering layers is not automatically faster. If one layer already buffers effectively, another buffer may only add memory and copying. Choose wrappers for capabilities the code actually needs: byte buffering, line-oriented text, charset conversion, or another behavior.

The next chapter changes focus from data movement to file identity: `java.io.File` is not a data stream but a legacy pathname/filesystem abstraction.
