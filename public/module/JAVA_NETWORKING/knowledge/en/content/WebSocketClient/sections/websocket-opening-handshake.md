A connection is opened through a WebSocket.Builder obtained from HttpClient:

~~~java
HttpClient client = HttpClient.newHttpClient();

CompletableFuture<WebSocket> future =
        client.newWebSocketBuilder()
              .connectTimeout(Duration.ofSeconds(5))
              .buildAsync(
                      URI.create("wss://example.com/events"),
                      listener
              );
~~~

buildAsync completes normally with a WebSocket when the opening handshake succeeds. It may complete exceptionally for I/O failure, timeout, or a rejected/invalid handshake.

The builder can also configure headers and requested subprotocols. A subprotocol is negotiated as part of the opening handshake; it is not merely an arbitrary label attached after the connection exists.

URIs normally use ws or wss. With wss, TLS runs underneath the WebSocket connection. Certificate, trust, and key semantics belong to Security & Cryptography; Networking only needs to recognize that transport/security setup can make the handshake fail.

Do not block indefinitely on future.join() merely because the API returns a future. Time bounds, cancellation, and ownership still need an explicit application policy.
