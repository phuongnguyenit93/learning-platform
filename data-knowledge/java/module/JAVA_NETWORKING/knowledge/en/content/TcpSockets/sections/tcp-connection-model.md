TCP provides a **bidirectional byte-stream connection** between two endpoints. In Java, a `Socket` represents one end of that connection, while a server uses a `ServerSocket` to wait for new connections. When a client connects successfully, the server does not read or write through the `ServerSocket`; `accept()` returns a new `Socket` dedicated to that client connection.

The relationship can be pictured as:

```text
client Socket  <========== TCP connection ==========>  accepted Socket
                                                      ^
                                                      |
                                                ServerSocket
                                             bind + wait in accept()
```

The key mental model is that TCP carries an ordered sequence of bytes. `Socket` exposes that sequence through `InputStream` and `OutputStream`, but TCP does not know where an application "request", "record", or "message" begins or ends. The application protocol must define those boundaries itself.

An established connection has two complete endpoints: a local address/port and a remote address/port. A server can therefore use one listening port for many clients while every accepted `Socket` still represents an independent connection.
