The JDK WebSocket client lives in java.net.http but uses a different data model from HTTP request/response. After the opening handshake, the client keeps a **longer-lived bidirectional connection** for asynchronous message exchange.

Mental model:

~~~text
HttpClient
   ↓ newWebSocketBuilder()
opening handshake
   ↓
WebSocket connection
   ↙              ↘
send messages   Listener callbacks
~~~

The JDK API is a **WebSocket client API**. It is not a WebSocket server framework and it does not provide an application messaging protocol such as STOMP.

Builder and WebSocket operations use a non-blocking API style: buildAsync and send methods return CompletableFuture/CompletionStage values rather than waiting for the entire network action before returning.

The HttpClient still provides infrastructure for the opening handshake, such as proxy, executor, and client-level configuration. After the handshake, WebSocket and Listener become the main lifecycle abstractions.
