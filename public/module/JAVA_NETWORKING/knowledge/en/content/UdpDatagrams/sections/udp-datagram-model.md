UDP uses a **datagram** model: each send produces an independent unit of data with its own payload and destination endpoint. Java represents a UDP socket with `DatagramSocket` and the unit being sent or received with `DatagramPacket`.

Unlike TCP, the receiver does not call `listen()`/`accept()` to create a new connection for each peer. A `DatagramSocket` normally binds to one local endpoint and receives many datagrams through that same socket:

```text
sender A ---- datagram ----\
                            > DatagramSocket bound to local port
sender B ---- datagram ----/
```

A minimal receiver looks like this:

```java
try (DatagramSocket socket = new DatagramSocket(9000)) {
    byte[] buffer = new byte[2048];
    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);

    socket.receive(packet);

    String text = new String(
            packet.getData(),
            packet.getOffset(),
            packet.getLength(),
            StandardCharsets.UTF_8);
}
```

On a normal blocking `DatagramSocket`, `receive()` waits until a datagram arrives or the operation ends because of timeout, error, or close. Each receive handles at most one datagram; Java does not combine several datagrams into a TCP-style byte stream.

UDP is useful when an application wants message boundaries and is prepared to define its own handling of loss, ordering, retries, or stale data. Those policies belong to the application protocol; `DatagramSocket` provides the datagram transport mechanism itself.
