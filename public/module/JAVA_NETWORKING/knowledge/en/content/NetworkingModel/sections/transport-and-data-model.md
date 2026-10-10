A transport determines **the basic communication model visible to the application**.

TCP exposes an **ordered byte stream**. It does not preserve application message boundaries. Two writes by the sender do not imply two matching reads by the receiver, so framing must come from the application protocol: a delimiter, a length prefix, or another structured format.

UDP exposes **datagrams**. Each datagram preserves its own boundary, but UDP does not provide the same delivery and ordering guarantees as TCP. Applications that need more reliability must define it above UDP.

Higher-level APIs add richer semantics:

~~~text
TCP byte stream
    ↑
HTTP request / response

TCP connection
    ↑
WebSocket messages
~~~

Therefore “sending data over the network” is not one universal operation. Before choosing an API, decide whether the application needs a byte stream, independent datagrams, request/response exchanges, or a message-oriented conversation. Choosing the wrong data model often creates unnecessary framing, retry, and lifecycle complexity.
