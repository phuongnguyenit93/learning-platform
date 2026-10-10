A **charset** is the set of rules that maps character data to byte sequences and back. **Encoding** is the characters → bytes direction; **decoding** is bytes → characters. This mapping is necessary because bytes do not carry universal text meaning by themselves, and different encodings can represent the same character differently.

`InputStreamReader` uses a `Charset` to **decode bytes → characters**. `OutputStreamWriter` performs the opposite conversion and **encodes characters → bytes**.

```text
file bytes
    ↓ InputStream
InputStreamReader + UTF-8 decoder
    ↓
characters

characters
    ↓
OutputStreamWriter + UTF-8 encoder
    ↓ OutputStream
file bytes
```

A UTF-8 round trip through a temporary file:

`Path`, `Files.createTempFile(...)`, `toFile()`, and `deleteIfExists(...)` are only scaffolding for a safe temporary-file example here. The later filesystem chapters teach those APIs; the focus in this chapter is the `Reader`/`Writer` and charset bridge.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("chars-", ".txt");
String expected = "Xin chào Java ☕";

try (java.io.Writer writer =
         new java.io.OutputStreamWriter(
             new java.io.FileOutputStream(temp.toFile()),
             java.nio.charset.StandardCharsets.UTF_8)) {
    writer.write(expected);
}

StringBuilder actual = new StringBuilder();
try (java.io.Reader reader =
         new java.io.InputStreamReader(
             new java.io.FileInputStream(temp.toFile()),
             java.nio.charset.StandardCharsets.UTF_8)) {
    char[] buffer = new char[8];
    int count;
    while ((count = reader.read(buffer)) != -1) {
        actual.append(buffer, 0, count);
    }
}

System.out.println(expected.contentEquals(actual)); // true
java.nio.file.Files.deleteIfExists(temp);
```

The charset must match the data format. A file encoded as UTF-8 and decoded with a different charset may produce incorrect text or a decoding error even though the underlying bytes were read successfully.

Applications sometimes need an explicit policy for malformed or unmappable text. `CharsetDecoder` and `CharsetEncoder` support `CodingErrorAction.REPORT`, `REPLACE`, and `IGNORE`. For example, a protocol that requires strictly valid UTF-8 can configure a decoder to report bad input:

```java
java.nio.charset.CharsetDecoder decoder =
    java.nio.charset.StandardCharsets.UTF_8
        .newDecoder()
        .onMalformedInput(java.nio.charset.CodingErrorAction.REPORT)
        .onUnmappableCharacter(java.nio.charset.CodingErrorAction.REPORT);

java.io.Reader strictReader =
    new java.io.InputStreamReader(inputStream, decoder);
```

This is a data-validity boundary rather than a deep Unicode topic: the I/O decision is whether bad input should be **reported**, **replaced**, or **ignored**.

When encoding is part of a file format or protocol, pass the `Charset` explicitly. Since Java 18, Java's default charset is UTF-8 unless an implementation is configured through its supported mechanism to use another default; even so, code that depends on a specific format should record the encoding decision directly at the boundary instead of making readers infer it.

Character streams operate on Java `char` values/UTF-16 code units. Beginners do **not** need surrogate-pair, code-point, or grapheme-cluster details to continue here; those belong to the String/Unicode curriculum. The I/O responsibility is narrower: the charset bridge converts correctly between bytes and Java's character representation.

At this point the character-stream responsibility is complete: `Reader`/`Writer` work at the character layer, while `InputStreamReader`/`OutputStreamWriter` bridge characters and bytes through a charset. Composing `BufferedReader`/`BufferedWriter` belongs to the next chapter about wrappers and buffering.
