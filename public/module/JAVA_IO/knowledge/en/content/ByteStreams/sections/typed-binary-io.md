A raw byte stream only knows that bytes are moving. Many binary formats need a stronger contract, for example:

```text
4 bytes  → record count
8 bytes  → long timestamp
1 byte   → boolean flag
N bytes  → following payload
```

`DataInput` and `DataOutput` are interfaces for reading and writing Java primitive values using a defined binary contract. `DataInputStream` wraps an `InputStream` to provide `DataInput`; `DataOutputStream` wraps an `OutputStream` to provide `DataOutput`.

```text
InputStream  → DataInputStream  → readInt/readLong/readBoolean/...
OutputStream → DataOutputStream → writeInt/writeLong/writeBoolean/...
```

This example defines a tiny format whose field order is `int version` → `long id` → `boolean active`:

```java
byte[] encoded;

try (java.io.ByteArrayOutputStream bytes = new java.io.ByteArrayOutputStream();
     java.io.DataOutputStream out = new java.io.DataOutputStream(bytes)) {

    out.writeInt(1);
    out.writeLong(42L);
    out.writeBoolean(true);
    encoded = bytes.toByteArray();
}

try (java.io.DataInputStream in = new java.io.DataInputStream(
        new java.io.ByteArrayInputStream(encoded))) {

    int version = in.readInt();
    long id = in.readLong();
    boolean active = in.readBoolean();
}
```

The integer methods of `DataOutput` write bytes in **big-endian** order, and `DataInput` reads the same representation. The API does not, however, know which field comes next. **Writer and reader must agree exactly on the schema/framing**: field order, field types, version, lengths, and record boundaries. If the writer emits a `long` first but the reader calls `readInt()` first, the stream is still just bytes; Java has no embedded schema that can repair the mismatch.

For fixed-size fields, `readFully(byte[])` is useful when the format requires **exactly N bytes**. It keeps reading until the array is full and throws `EOFException` if the stream ends too early:

```java
byte[] magic = new byte[4];
in.readFully(magic); // either four bytes, or EOFException
```

Methods such as `readInt()` and `readLong()` also throw `EOFException` when EOF appears in the middle of the primitive value. This differs from `InputStream.read(...)`, where callers receive the actual count and decide whether another read is required.

A variable-length binary record normally needs explicit **framing**, such as a length before its payload:

```java
byte[] payload = ...;
out.writeInt(payload.length);
out.write(payload);

int length = in.readInt();
if (length < 0 || length > 1_000_000) {
    throw new java.io.IOException("Invalid payload length: " + length);
}
byte[] payloadRead = new byte[length];
in.readFully(payloadRead);
```

Validating the length before allocating memory matters when bytes come from an untrusted source; an arbitrary length field should not be allowed to force unbounded allocation.

`writeUTF(String)` / `readUTF()` have an important special contract. They **do not use normal UTF-8 as defined by `StandardCharsets.UTF_8`**; they use the `DataInput`/`DataOutput` **modified UTF-8** format and prefix the encoded string with an unsigned 16-bit byte length. The encoded form is therefore limited to about 65,535 bytes and should not be treated as an ordinary UTF-8 interchange format. When a format requires standard UTF-8, encode explicitly with `StandardCharsets.UTF_8` and define the framing/length yourself.

Typed binary I/O is also **different from Java object serialization**. `DataInputStream`/`DataOutputStream` write primitives and bytes according to an application-defined schema; they do not automatically write class metadata or an object graph. Object serialization is introduced later as a separate topic.
