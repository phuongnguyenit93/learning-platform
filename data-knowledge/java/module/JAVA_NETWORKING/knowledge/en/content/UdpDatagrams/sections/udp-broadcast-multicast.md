Broadcast and multicast both send datagrams toward multiple potential receivers, but they use different addressing models.

**Broadcast** uses an IPv4 broadcast address. `DatagramSocket` exposes the `SO_BROADCAST` socket option; where possible, a newly constructed datagram socket has this enabled so broadcast datagrams can be sent. The Java API recommends that a receiver expecting broadcasts bind to the wildcard address because receiving broadcasts while bound to a specific address can be implementation dependent.

```java
try (DatagramSocket socket = new DatagramSocket()) {
    socket.setBroadcast(true);

    byte[] data = "DISCOVER".getBytes(StandardCharsets.UTF_8);
    DatagramPacket packet = new DatagramPacket(
            data,
            data.length,
            new InetSocketAddress("255.255.255.255", 9000));
    socket.send(packet);
}
```

The usable broadcast address normally depends on the network/subnet; the address above is only an API illustration.

**Multicast** sends to a multicast group. Java provides `MulticastSocket`, a `DatagramSocket` subclass, for joining/leaving groups and choosing the relevant network interface. On Java 21, prefer `joinGroup(SocketAddress, NetworkInterface)` because it makes the local interface explicit; the older overload that accepts only `InetAddress` is deprecated.

```java
NetworkInterface netIf = NetworkInterface.getByName("eth0");
InetSocketAddress group = new InetSocketAddress("239.10.10.10", 9000);

try (MulticastSocket socket = new MulticastSocket(9000)) {
    socket.joinGroup(group, netIf);
    try {
        byte[] buffer = new byte[2048];
        DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
        socket.receive(packet);
    } finally {
        socket.leaveGroup(group, netIf);
    }
}
```

Multicast also involves the outgoing network interface and TTL/hop scope. Those are socket/networking mechanics owned here; designing a discovery protocol, membership strategy, or wider multicast topology belongs to the appropriate protocol/system layer.
