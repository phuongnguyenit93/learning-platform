NIO networking keeps the TCP and UDP transport concepts from the previous chapters but replaces stream wrappers with **channels plus `ByteBuffer`**, and lets selectable channels operate in blocking or non-blocking mode.

- `SocketChannel` is a stream-oriented socket channel that reads/writes through `ByteBuffer`. A channel can be unconnected, connection-pending, or connected. The default `open()` family is used for Internet stream sockets; opening with `StandardProtocolFamily.UNIX` gives the same channel abstraction a Unix-domain endpoint instead.
- `ServerSocketChannel` binds/listens and `accept()`s new connections; each accepted connection is represented by its own `SocketChannel`.
- `DatagramChannel` sends and receives datagrams, preserving UDP message boundaries rather than exposing a byte stream.

```java
try (ServerSocketChannel server = ServerSocketChannel.open()) {
    server.bind(new InetSocketAddress(8080));

    try (SocketChannel connection = server.accept()) {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        int read = connection.read(buffer);
    }
}
```

New channels start in blocking mode. NIO does not mean "channels are always non-blocking"; the same abstractions can support a straightforward blocking flow or switch to non-blocking mode for selector registration.

For an Internet stream socket, a `SocketChannel` still exposes a **byte stream**. Moving from `Socket` to `SocketChannel` does not give TCP message boundaries. The framing rules from the TCP chapter still apply.
