Convenience APIs such as `readAllBytes` and `readString` are excellent when input is **small and bounded**:

~~~java
String config =
        Files.readString(path, StandardCharsets.UTF_8);
~~~

They keep code short and make whole-content processing easy. The important memory model is that the **entire logical content must fit in memory at once**:

~~~text
readAllBytes(file of size N)
→ returns a byte[] containing the whole file

readString(file)
→ returns one String containing the whole decoded text
→ implementation may also need temporary byte/character buffers while decoding
~~~

If a file can be large, has an untrusted size, or comes from a long-running source, streaming gives a bounded memory model:

~~~java
try (InputStream in = Files.newInputStream(path)) {
    byte[] buffer = new byte[8192];
    int read;

    while ((read = in.read(buffer)) != -1) {
        process(buffer, 0, read);
    }
}
~~~

Streaming does not mean “no buffer.” It usually means processing **one bounded buffer at a time** instead of retaining the full payload.

~~~text
load all
→ simple
→ good for small, bounded data

streaming
→ bounded memory
→ good for large/uncertain data
→ logic must handle chunks and partial data
~~~

A common mistake is to use `readAllBytes()` for an upload because local tests use a 20 KB file. When production receives a 2 GB file, the abstraction was wrong from the start.

Define the data bound before choosing the API. “The current example is small” is different from “the contract guarantees this input is small.”
