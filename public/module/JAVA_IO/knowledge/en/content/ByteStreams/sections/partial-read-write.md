A call to `read(buffer)` does **not** promise to fill the buffer. It may return fewer bytes than the array can hold even though the stream has not reached EOF. This matters especially for networks, compressed streams, pipes, and sources that produce data incrementally.

If a format requires an exact number of bytes, the caller must loop or use a helper with the right completion semantics. `readNBytes(...)` performs repeated reads up to the requested length, but it can still return a smaller count when EOF arrives early, so code must validate that count. `DataInput.readFully(...)`, introduced below for structured binary data, instead throws `EOFException` if it cannot obtain the required bytes.

A manual exact-length loop looks like this:

```java
byte[] header = new byte[8];
int offset = 0;

while (offset < header.length) {
    int count = in.read(header, offset, header.length - offset);
    if (count == -1) {
        throw new java.io.EOFException("Incomplete header");
    }
    offset += count;
}
```

`OutputStream` has a different bulk contract. `write(byte[])` and `write(byte[], off, len)` are responsible for writing the requested range or reporting failure with an exception. Do not apply the “one write reports a smaller completed count” model from NIO `Channel` APIs to `OutputStream`; return-count-based partial writes become a direct concern when channels are introduced later.

`write(int value)` writes only the low eight bits of `value`, so array **overloads** are the normal choice for multi-byte payloads. An overload is another method with the same name but a different parameter list.
