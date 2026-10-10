TCP preserves byte order, but it **does not preserve the boundaries between `write()` calls**. Code that assumes "one sender write equals one receiver read" therefore does not define a valid framing protocol.

Suppose a sender performs:

```text
write("HELLO")
write("JAVA")
```

The receiver might observe reads such as `"HEL"`, `"LOJA"`, `"VA"`, or another split. The final byte sequence is still `HELLOJAVA`; only the sizes of individual reads differ.

An application needs a **framing** rule. Common approaches include:

- fixed length: every record has a known size;
- delimiter: for example, a text protocol terminates each line with `\n`, together with suitable encoding/escaping rules if payloads can contain the delimiter;
- length prefix: send a length first, then read exactly that many payload bytes;
- self-describing format: a parser identifies the end from the format, while still handling input that arrives in pieces.

A simple length-prefix example:

```java
// sender
byte[] payload = "hello".getBytes(StandardCharsets.UTF_8);
DataOutputStream out = new DataOutputStream(socket.getOutputStream());
out.writeInt(payload.length);
out.write(payload);
out.flush();

// receiver
DataInputStream in = new DataInputStream(socket.getInputStream());
int length = in.readInt();
if (length < 0 || length > 1_048_576) {
    throw new IOException("Invalid frame length: " + length);
}
byte[] message = in.readNBytes(length);
if (message.length != length) {
    throw new EOFException("Connection ended in the middle of a frame");
}
```

Validating the advertised length before allocating memory is part of safe framing. `readNBytes(length)` expresses the intent to collect the requested number of bytes, but EOF can still occur in the middle of a frame and must be treated according to the application protocol.
