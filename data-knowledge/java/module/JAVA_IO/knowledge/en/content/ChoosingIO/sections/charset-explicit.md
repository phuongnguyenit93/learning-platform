When text crosses a **byte-oriented boundary** such as a file or byte stream, encoding/decoding forms the bridge:

~~~text
bytes
↔ Charset encode/decode
↔ characters / String
~~~

For such a byte-backed text format, the charset is part of the data contract. Pure in-memory character sources such as `StringReader` do not perform a byte/charset conversion. For a UTF-8 file format, say so explicitly:

~~~java
String text =
        Files.readString(path, StandardCharsets.UTF_8);

Files.writeString(
        target,
        text,
        StandardCharsets.UTF_8
);
~~~

With a stream bridge:

~~~java
try (
        InputStream in = Files.newInputStream(path);
        Reader reader =
                new InputStreamReader(in, StandardCharsets.UTF_8)
) {
    // read characters as UTF-8
}
~~~

Since Java 18, the default charset of standard Java APIs is UTF-8 unless an implementation is configured through its supported mechanism to use another default. Even so, when a file format or protocol defines a specific charset, code should pass that charset explicitly: it is part of the data contract rather than a decision that should depend on the runtime default.

Charset also explains why arbitrary binary data should not be converted into a `String`:

~~~java
byte[] png = Files.readAllBytes(imagePath);
// new String(png, UTF_8) does not make PNG bytes valid text
~~~

If the payload is binary, keep it as bytes. Use Reader/Writer/String when the payload is actually text with a defined encoding.
