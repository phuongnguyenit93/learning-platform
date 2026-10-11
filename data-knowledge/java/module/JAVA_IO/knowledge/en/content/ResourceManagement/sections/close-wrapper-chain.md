Earlier chapters used decorator-style wrappers:

~~~text
FileInputStream
→ InputStreamReader
→ BufferedReader
~~~

Standard I/O wrappers generally **propagate `close()` to their delegate**, the lower-level object to which the wrapper forwards read/write operations, according to their API contract. That close-propagation rule is separate from application-level ownership: code still has to decide whether it was responsible for closing the wrapped resource in the first place.

~~~java
try (BufferedReader reader = Files.newBufferedReader(
        path,
        StandardCharsets.UTF_8
)) {
    System.out.println(reader.readLine());
}
~~~

For a manually built chain:

~~~java
InputStream file = Files.newInputStream(path);
Reader decoder =
        new InputStreamReader(file, StandardCharsets.UTF_8);
BufferedReader buffered = new BufferedReader(decoder);
~~~

closing `buffered` closes `decoder` and then the lower delegate according to the standard wrapper contracts. When application-level ownership says this scope owns the whole chain, the outermost wrapper is usually the resource that needs to appear in try-with-resources.

Output wrappers add another reason to close correctly: they may still hold buffered output. Closing standard writer/output wrappers performs the required flush behavior before closing their delegate:

~~~java
try (BufferedWriter writer = Files.newBufferedWriter(
        path,
        StandardCharsets.UTF_8
)) {
    writer.write("hello");
}
~~~

Do not substitute “the process is about to exit” for a proper `close()` lifecycle.

The key caveat appears when a wrapper surrounds a resource the method **does not own**. Closing the wrapper will usually close the caller's delegate too. That is not a wrapper bug; it means the ownership contract was unclear.

With resource lifetime under control, the next chapter examines an I/O feature with a much larger boundary: Java native object serialization. Turning an object graph into bytes introduces both compatibility and security concerns.
