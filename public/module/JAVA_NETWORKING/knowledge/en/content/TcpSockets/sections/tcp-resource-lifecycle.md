A network connection holds operating-system resources, so code needs a clear answer to **who owns each socket and who closes it**. A simple ownership rule is that the component taking ownership of a connection closes it with `try-with-resources` when the session ends.

```java
void handleClient(ServerSocket server) throws IOException {
    try (Socket socket = server.accept()) {
        process(socket);
    } // this client connection is closed here
}
```

The `ServerSocket` and accepted `Socket` instances are independent resources:

- closing one accepted `Socket` ends that connection while the server can keep accepting others;
- closing the `ServerSocket` stops the listener and causes a thread blocked in `accept()` to wake with a socket-close failure;
- closing the `ServerSocket` is not automatic lifecycle management for all accepted connections that have already been handed to other code.

The two streams obtained from a `Socket` are tied to the same connection. The Java API specifies that closing either returned `InputStream` or returned `OutputStream` closes the associated socket. Avoid ownership designs where unrelated layers independently believe they own one stream without realizing that closing it affects the entire connection.

`try-with-resources` makes cleanup deterministic on both success and exception paths:

```java
try (Socket socket = new Socket("example.com", 8080)) {
    InputStream in = socket.getInputStream();
    OutputStream out = socket.getOutputStream();
    exchange(in, out);
}
```

Here the `Socket` is the resource with explicit ownership; closing it also ends the streams associated with that connection. This avoids suggesting that the three objects represent three independent network lifecycles.

When half-close is required, manage the lifecycle at the `Socket` level and use `shutdownOutput()`/`shutdownInput()` for their intended roles instead of closing a stream early. Timeouts, resets, cancellation, and other failure modes are developed in the Failure Control chapter; the rule carried forward here is that every exit path must leave resource ownership and closure deterministic.

Before moving into those cross-cutting failure controls, the next chapter contrasts TCP's connection-oriented byte stream with UDP's independent datagram model so the learner can separate transport/data semantics from lifecycle policy.
