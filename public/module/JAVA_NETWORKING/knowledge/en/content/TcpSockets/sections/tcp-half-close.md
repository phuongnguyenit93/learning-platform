TCP is full-duplex, so the two transfer directions can finish independently. Java exposes that capability through `shutdownOutput()` and `shutdownInput()` on `Socket`.

`shutdownOutput()` says that the local endpoint will **send no more bytes**. For a TCP socket, data written earlier is sent and followed by TCP's normal termination sequence for the output direction. The peer can still send data in the opposite direction, and the local socket can continue reading it.

One useful pattern is a request whose end is signaled by EOF in one direction:

```java
try (Socket socket = new Socket("example.com", 8080)) {
    OutputStream out = socket.getOutputStream();
    out.write(requestBytes);
    out.flush();

    socket.shutdownOutput(); // request is complete

    byte[] response = socket.getInputStream().readAllBytes();
    // The peer may send a response and then finish its sending direction.
}
```

Unlike `close()`, a half-close leaves the other direction usable. For the same reason, **do not close the `OutputStream` merely to request a half-close**: the `Socket` contract states that closing the stream returned by either `getInputStream()` or `getOutputStream()` closes the associated socket.

`shutdownInput()` places the local read side at end-of-stream; subsequent reads behave as EOF according to the `Socket` contract. It is a local input-side operation, not an application message telling the peer "I no longer want to receive." Application protocols therefore use `shutdownOutput()` more often as a meaningful EOF signal to the other endpoint, while `shutdownInput()` is less common in ordinary application code.

`isInputShutdown()` and `isOutputShutdown()` expose the local half-close state, but those flags do not replace handling EOF and `IOException` in the actual I/O flow.
