Physical storage and transport ultimately move bytes, while application code often wants to work with text. Those needs create two important abstraction levels:

```text
binary data            text
    ↓                    ↓
byte abstraction     character abstraction
```

A **byte stream** treats the payload as bytes and does not assign text meaning to them. It is the natural fit for images, ZIP archives, PDFs, encrypted data, and other binary formats.

A **character stream** treats the payload as character data. When characters cross a file or network boundary, a **charset** defines how Java characters map to bytes:

```text
characters ── encode UTF-8 ──> bytes
bytes      ── decode UTF-8 ──> characters
```

That is why arbitrary bytes should not be interpreted as “one byte equals one character.” A Unicode character may require multiple bytes in UTF-8, and a Java `char` is one UTF-16 code unit rather than a guarantee of one complete Unicode code point.

For example:

```java
String text = "Xin chào Java ☕";
byte[] utf8 = text.getBytes(java.nio.charset.StandardCharsets.UTF_8);
String restored = new String(utf8, java.nio.charset.StandardCharsets.UTF_8);

System.out.println(text.equals(restored)); // true
```

Byte streams and character streams are related layers. A character stream commonly sits on top of a byte source or sink and adds encoding/decoding. The next chapter starts with the lower-level `InputStream`/`OutputStream` model before the module introduces `Reader`/`Writer`.
