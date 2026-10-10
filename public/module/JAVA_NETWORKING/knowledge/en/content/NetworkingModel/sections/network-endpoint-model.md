A network endpoint contains enough information to locate **one side of a communication**. For Internet sockets, the common mental model is:

~~~text
host/IP + port
~~~

A host name such as <code>example.com</code> is a logical name that normally has to be resolved to one or more IP addresses. A port identifies a transport endpoint on the target host; many services can share one IP address by listening on different ports.

Java keeps these concerns separate:

- InetAddress represents an IP address and may also know a host name;
- InetSocketAddress represents an Internet socket address, typically host/IP + port;
- SocketAddress is the base abstraction for socket addresses;
- UnixDomainSocketAddress represents a local Unix-domain endpoint by path.

Do not equate a URL with a socket endpoint. A URL also carries a scheme, path, query, and resource semantics. For example, <code>https://example.com/orders?id=42</code> contains much more information than the transport endpoint used by the eventual connection.

This distinction becomes the foundation for later chapters: name resolution produces addresses, TCP and UDP use endpoints, and HTTP/WebSocket add higher-level semantics over connections.
