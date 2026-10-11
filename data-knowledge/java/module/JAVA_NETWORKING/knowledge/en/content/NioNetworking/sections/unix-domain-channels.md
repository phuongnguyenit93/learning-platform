Not every socket channel uses an IP address and port. The JDK supports **Unix-domain sockets** through `SocketChannel` and `ServerSocketChannel`, with a `UnixDomainSocketAddress` whose endpoint is a file-system path.

```java
Path socketPath = Path.of("/tmp/java-learning.sock");
Files.deleteIfExists(socketPath);

UnixDomainSocketAddress address = UnixDomainSocketAddress.of(socketPath);

try (ServerSocketChannel server =
         ServerSocketChannel.open(StandardProtocolFamily.UNIX)) {
    server.bind(address);
    try (SocketChannel connection = server.accept()) {
        // use ByteBuffer read/write as with another stream-oriented SocketChannel
    }
} finally {
    Files.deleteIfExists(socketPath);
}
```

A client can open a channel in `StandardProtocolFamily.UNIX` and `connect(address)`. This transport is for same-host IPC; it is not another spelling of `InetSocketAddress`.

Support depends on the platform/provider, so code must account for the protocol family being unsupported. Also, when a Unix-domain server binds a named path, the Java API specifies that the socket file **persists after the channel closes**; the application is responsible for removing the path before rebinding when appropriate.

`UnixDomainSocketAddress` uses a `Path` from the system-default file system, and platforms impose implementation-specific limits on socket-path length. These constraints reinforce why Java's endpoint abstraction is broader than IP address plus port.
