Reading one `char` at a time across the underlying layer can create many small operations. Text I/O commonly composes character streams with:

- `BufferedReader` for buffered reads and `readLine()`;
- `BufferedWriter` for collecting small character writes before passing them downstream.

For example:

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("lines-", ".txt");

try (java.io.BufferedWriter writer =
         new java.io.BufferedWriter(
             new java.io.OutputStreamWriter(
                 new java.io.FileOutputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    writer.write("line 1");
    writer.newLine();
    writer.write("line 2");
}

try (java.io.BufferedReader reader =
         new java.io.BufferedReader(
             new java.io.InputStreamReader(
                 new java.io.FileInputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

java.nio.file.Files.deleteIfExists(temp);
```

`readLine()` removes the line terminator from the returned text and returns `null` at EOF. `BufferedWriter.newLine()` emits the platform line separator when that is the format the application wants.

Buffering does not change encoding; the charset bridge still owns encoding and decoding. The next section focuses on when buffered output must be pushed to the layer underneath.
