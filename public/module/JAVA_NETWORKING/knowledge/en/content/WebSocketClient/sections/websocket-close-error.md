WebSocket has two termination paths worth distinguishing: a **protocol close handshake** and an **abort**.

sendClose(code, reason) begins protocol-level close:

~~~java
webSocket.sendClose(
        WebSocket.NORMAL_CLOSURE,
        "done"
);
~~~

Listener.onClose(...) observes a Close message from the peer and returns a CompletionStage representing callback processing.

`sendClose(...)` closes the WebSocket's **output** side by sending a Close message; it does not immediately close the input side. Input remains open until a peer Close is received, `abort()` is invoked, or an error closes the WebSocket.

`onClose(...)` is the last listener invocation for that WebSocket. If output is still open when a peer Close arrives, the stage returned from `onClose` tells the implementation when it may reciprocate by closing output; returning `null` means that may happen immediately.

abort() is a stronger path: it closes the connection immediately rather than completing the graceful close handshake. It is appropriate when the application cannot or should not continue normal protocol lifecycle.

onError(...) reports receive/lifecycle failure. After such a failure, do not merely log and assume the same WebSocket continues normally. Move connection state to a defined terminal/error state and let any reconnect policy live in the layer that owns resilience/realtime behavior.

`onError(...)` is terminal for that WebSocket: it is the last listener invocation, and both input and output are already closed when it begins. Unlike receive methods, it is not gated by `request(n)`.

Close status and reason are protocol information. Business failures should use an application message/schema rather than overload close codes.
