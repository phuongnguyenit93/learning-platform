`DatagramChannel` is the NIO counterpart of `DatagramSocket`. It still sends and receives **datagrams**, but uses `ByteBuffer` and the channel model instead of making `DatagramPacket` the primary abstraction.

An unconnected channel uses `send`/`receive` with a per-datagram address:

```java
try (DatagramChannel channel = DatagramChannel.open()) {
    channel.bind(new InetSocketAddress(9000));

    ByteBuffer buffer = ByteBuffer.allocate(2048);
    SocketAddress sender = channel.receive(buffer);

    if (sender != null) {
        buffer.flip();
        channel.send(buffer, sender);
    }
}
```

After `connect(remote)`, a `DatagramChannel` remains associated with that peer until `disconnect()` or `close()`. `read`/`write` can then operate against the connected peer; the channel is still a datagram transport rather than a TCP stream.

The important boundary with NIO is the execution model:

- in blocking mode, `receive()` can wait until a datagram becomes available;
- in non-blocking mode, `receive()` returns `null` immediately when no datagram is ready;
- because it is a `SelectableChannel`, `DatagramChannel` can register with a `Selector` in a non-blocking workflow;
- multicast membership also has channel APIs through `join(...)` and `MembershipKey`.

This chapter only places `DatagramChannel` in the correct UDP mental model. The next chapter first establishes timeout, failure, cancellation, and resource-lifetime control that applies across socket styles; the later NIO Networking chapter then develops `ByteBuffer` state, selector readiness, registration/interest sets, and the broader channel execution models.
