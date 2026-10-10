`bind`, `connect`, and `accept` describe different roles in establishing a TCP connection.

- `bind` associates a socket with a local endpoint. A `ServerSocket` normally binds before receiving connections. A client can also bind its `Socket` to a specific local address/port when required; otherwise the platform normally chooses an appropriate local address and ephemeral port as part of connecting.
- `connect` is the active-side operation: the client `Socket` asks to establish a connection to the server endpoint.
- `accept` is the passive-side operation: the `ServerSocket` waits for an incoming connection and returns a new `Socket` when one is accepted.

For example, a server can be created unbound and then bound explicitly:

```java
try (ServerSocket server = new ServerSocket()) {
    server.bind(new InetSocketAddress("0.0.0.0", 8080));

    try (Socket client = server.accept()) {
        // client is the newly accepted connection.
    }
}
```

`0.0.0.0` is the IPv4 wildcard address in this example, allowing the server to receive connections sent to suitable local IPv4 addresses. Binding to port `0` asks the system to choose an ephemeral port; `getLocalPort()` reveals the selected port after binding.

`ServerSocket.bind(endpoint, backlog)` also accepts a `backlog`, the **requested** maximum length of the pending incoming-connection queue. The effective queue behavior is implementation and operating-system dependent, so the value should not be treated as an exact application-level capacity limit.

For a normal blocking `ServerSocket`, `accept()` waits until a connection is available. Timeout, cancellation, and failure control belong to the dedicated failure chapter; the important lifecycle fact here is that `accept()` creates a connected socket and does not turn the `ServerSocket` itself into the client connection.
