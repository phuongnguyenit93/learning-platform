Try-with-resources answers **how to close**. Before that, code must decide **who is responsible for closing**.

A useful design convention is:

~~~text
code creates/opens the resource
→ it owns the resource by default
→ it closes the resource

code only receives a caller-provided resource
→ do not guess ownership
→ the contract must state who closes it
~~~

For example, a method that opens its own file:

~~~java
static long countBytes(Path path) throws IOException {
    try (InputStream in = Files.newInputStream(path)) {
        long count = 0;
        byte[] buffer = new byte[8192];
        int read;

        while ((read = in.read(buffer)) != -1) {
            count += read;
        }

        return count;
    }
}
~~~

The method creates the `InputStream`, so ownership is clear and the method closes it.

Now consider a caller-provided stream:

~~~java
static void writeMessage(
        OutputStream out,
        String message
) throws IOException {
    out.write(message.getBytes(StandardCharsets.UTF_8));
}
~~~

`out` came from the caller. Closing it unexpectedly could prevent the caller from writing more to a file, socket, or response. An API should make one of these contracts clear:

~~~text
borrowed resource
→ method uses it but does not close it

owned/transferred resource
→ method receives ownership and will close it
~~~

Ownership also applies to less obvious APIs. `Files.list`, `Files.walk`, `Files.find`, and `Files.lines` return `java.util.stream.Stream` values that are backed by I/O resources; consuming code must arrange for `close()`, usually with try-with-resources. Being a Stream API pipeline does not remove the resource lifecycle.

An object becoming eligible for GC does not mean its external resource was released at the right time. In a long-running server, leaked file descriptors can accumulate until the process can no longer open files or sockets.
