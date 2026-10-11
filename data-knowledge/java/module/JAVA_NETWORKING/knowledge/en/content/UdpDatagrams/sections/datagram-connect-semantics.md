The name `DatagramSocket.connect(...)` is easy to misread through a TCP mental model. For UDP, `connect` **does not perform a TCP-style handshake and does not establish a reliable session**. It associates the socket with one remote IP address and port.

After connecting:

- the socket has a default remote peer;
- for an ordinary unicast peer, datagrams received through the socket are filtered to that associated peer;
- `send()` must target the matching peer; a packet carrying a different address is rejected;
- code can query the remote endpoint through methods such as `getRemoteSocketAddress()` and use a simpler peer-specific flow.

A multicast address is a special case: a datagram socket connected to a multicast address is used only for sending and does not provide the same receive-filter model.

```java
try (DatagramSocket socket = new DatagramSocket()) {
    InetSocketAddress peer = new InetSocketAddress("127.0.0.1", 9000);
    socket.connect(peer);

    byte[] data = "PING".getBytes(StandardCharsets.UTF_8);
    DatagramPacket packet = new DatagramPacket(data, data.length, peer);
    socket.send(packet); // target must match the connected peer
}
```

`connect()` does not require the peer to exist or to "accept" anything. Whether a datagram arrives and whether a peer application processes it still follows UDP semantics. On a connected datagram socket, an unreachable destination **may** surface as `PortUnreachableException`, but the Java API does not guarantee that the exception will always be reported.

When `disconnect()` succeeds, it removes the remote association and returns the socket to unconnected use, where each packet can identify its own peer. Java 21 also permits `disconnect()` to throw `UncheckedIOException` if disconnection fails; after such a failure the socket may be left in an unspecified state, so closing it is safer than assuming it can be reused. Use UDP `connect()` when one socket primarily communicates with one peer and peer filtering/default addressing is useful, rather than because the application needs a TCP connection lifecycle.
