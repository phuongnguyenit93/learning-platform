One of the easiest stream bugs comes from misunderstanding the return value of `InputStream.read()`.

`read()` returns an `int`, not a `byte`:

- `0..255`: the unsigned value of the byte that was read.
- `-1`: end-of-stream (EOF).

The wider `int` return type is what allows the API to represent all 256 byte values and still reserve `-1` for EOF.

```java
try (java.io.InputStream in =
         new java.io.ByteArrayInputStream(new byte[] {10, 20})) {

    int first = in.read();   // 10
    int second = in.read();  // 20
    int eof = in.read();     // -1
}
```

For `read(byte[] buffer)`, the return value is the **number of bytes actually placed into the buffer**, or `-1` when EOF is reached before any byte can be read. Code must use that count instead of assuming the entire array contains fresh data.

```java
byte[] buffer = new byte[4096];
int count;

while ((count = in.read(buffer)) != -1) {
    consume(buffer, 0, count);
}
```

`consume(...)` is an **application-defined example helper** representing whatever processing should happen to those `count` bytes. It is not a JDK method.

A zero-length bulk read may return `0`; for the usual positive-length buffer, normal processing expects a positive count or `-1`.

Two other API groups are easy to misuse:

- `available()` is **not “bytes remaining in the whole stream.”** It estimates how many bytes can currently be read or skipped without blocking and may legitimately return `0`. Do not use it to size the complete payload.
- `mark(...)` / `reset()` only work when the concrete stream supports them. Check `markSupported()` before relying on replay from a marked position; the base `InputStream` contract does not support reset by default.
