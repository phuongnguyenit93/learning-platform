Not every socket endpoint crosses an IP network. Java supports **Unix-domain sockets**, where an endpoint is identified by a path on supporting operating systems.

~~~java
UnixDomainSocketAddress address =
        UnixDomainSocketAddress.of("/tmp/my-service.sock");
~~~

UnixDomainSocketAddress is still a SocketAddress, so the bind/connect mental model remains useful even though the protocol family is not an Internet socket.

Unix-domain sockets are useful for communication between processes on the same machine:

- no TCP port allocation is required;
- the endpoint participates in a filesystem-like namespace;
- they fit daemon or local-service communication well.

In the JDK, support is primarily exposed through SocketChannel and ServerSocketChannel opened with the appropriate protocol family. Availability is platform-dependent, so portable code must handle unsupported environments.

The repository's Java Version area owns the Java 16 introduction history; Networking owns the current usage and mental model.

With names, addresses, and endpoints now separated clearly, the next chapter moves to TCP and follows a stream-oriented connection through bind/connect/accept, read/write, and close.
