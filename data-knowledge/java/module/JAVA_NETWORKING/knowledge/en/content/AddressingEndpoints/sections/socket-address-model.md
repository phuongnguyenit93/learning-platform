SocketAddress is the abstraction for an **address that a socket or channel can bind to or connect to**. Internet sockets commonly use InetSocketAddress.

~~~java
InetSocketAddress remote =
        new InetSocketAddress("example.com", 443);
~~~

An InetSocketAddress can be:

- **resolved**, meaning it already has an InetAddress;
- **unresolved**, meaning it keeps the host string and port without resolving yet.

InetSocketAddress.createUnresolved(...) is useful when another layer, such as proxy handling, needs the original host name.

The same address abstraction appears in two roles:

~~~java
server.bind(new InetSocketAddress("0.0.0.0", 8080));
client.connect(new InetSocketAddress("example.com", 443));
~~~

Binding to a wildcard local address means “listen on matching local interfaces”; it does not mean the remote peer is 0.0.0.0.

Keeping local and remote endpoints distinct makes later TCP and NIO lifecycle reasoning much easier: a socket/channel has a local endpoint and, after connect/accept, a corresponding remote endpoint.
