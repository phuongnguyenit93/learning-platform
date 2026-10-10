The basic client and server lifecycles can be read side by side:

```text
Server                                  Client
------                                  ------
create ServerSocket                     create Socket
bind local endpoint                     connect remote endpoint
accept() waits for an incoming          TCP connection is established
connection                              with the server endpoint
   |
accepted Socket
   |                                    |
read/write bytes <--------------------> read/write bytes
   |                                    |
close accepted Socket                  close Socket

The ServerSocket can continue accepting other connections until it is closed.
```

A minimal sequential server shows the ownership of each accepted socket:

```java
try (ServerSocket server = new ServerSocket(8080)) {
    while (!server.isClosed()) {
        try (Socket connection = server.accept()) {
            handle(connection);
        }
    }
}
```

A real server often handles multiple connections concurrently. This Networking chapter owns the socket boundary: every connection has its own `Socket` and resource lifecycle. Thread, executor, and virtual-thread design belong to the corresponding concurrency curriculum.

A client commonly scopes one communication session with `try-with-resources`:

```java
try (Socket socket = new Socket()) {
    socket.connect(new InetSocketAddress("example.com", 8080));

    // use socket.getInputStream() and socket.getOutputStream()
}
```

After `close()`, the socket cannot be reused for a new connection; create another socket for another connection. Likewise, closing an accepted `Socket` does not close the `ServerSocket`. The listener and each established connection are distinct resources.
