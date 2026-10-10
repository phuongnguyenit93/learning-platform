Byte streams fit when content should remain binary or when the current layer should not make a text-encoding decision:

- images, audio, and video;
- ZIP, PDF, and other binary formats;
- encrypted or compressed payloads;
- byte-for-byte copying;
- protocols whose byte layout has its own meaning.

For a whole-stream copy:

```java
try (java.io.InputStream in = source();
     java.io.OutputStream out = destination()) {
    in.transferTo(out);
}
```

`source()` and `destination()` are **application-defined example helpers** representing code that obtains real streams from a file, socket, or another resource. They are not built-in JDK methods.

`transferTo` still operates under byte-stream semantics. It is convenient when the goal is to transfer the remaining bytes to another stream, but it does not change ownership rules: the code that owns the streams still decides when they are closed.

When the payload is actually text, operating directly on individual bytes forces application code to perform decoding and makes it easy to split a multi-byte encoded character incorrectly. The next chapter introduces `Reader`/`Writer` so charset conversion happens at an explicit boundary.
