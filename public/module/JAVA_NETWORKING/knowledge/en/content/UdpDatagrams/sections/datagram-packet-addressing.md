A `DatagramPacket` carries both a **data region** and a **peer address**. The address means the destination when sending and the source after receiving.

For a send, the packet contains the destination:

```java
byte[] data = "PING".getBytes(StandardCharsets.UTF_8);
InetSocketAddress target = new InetSocketAddress("127.0.0.1", 9000);

DatagramPacket packet = new DatagramPacket(data, data.length, target);
socket.send(packet);
```

For a receive, `receive(packet)` fills the buffer and updates the packet with the sender's address and port. An unconnected socket can therefore reply to the peer associated with each individual datagram:

```java
byte[] buffer = new byte[2048];
DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
socket.receive(packet);

SocketAddress sender = packet.getSocketAddress();
int receivedLength = packet.getLength();

DatagramPacket reply = new DatagramPacket(
        packet.getData(),
        packet.getOffset(),
        receivedLength,
        sender);
socket.send(reply);
```

`getOffset()` and `getLength()` identify the valid data region in the backing array. Do not process the whole array returned by `getData()` as though every byte belongs to the current message.

The receive buffer also limits the datagram. If an incoming message is longer than the current `DatagramPacket` length, Java keeps only the part that fits and **truncates the remainder** for that receive. UDP does not turn the remainder into a later `receive()` call. The buffer size must therefore match the protocol's expected datagram size.

After a receive, `getLength()` reports the size of the message just received. If application code explicitly calls `setLength(...)`, that value controls how much of the buffer is available for a later receive, so change it only when the protocol or buffer-management policy actually requires it.
