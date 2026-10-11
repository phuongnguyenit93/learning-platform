The JDK WebSocket client does not push an unlimited number of receive callbacks to a listener. The application expresses **demand** through WebSocket.request(n).

~~~java
@Override
public void onOpen(WebSocket webSocket) {
    webSocket.request(1);
}

@Override
public CompletionStage<?> onText(
        WebSocket webSocket,
        CharSequence data,
        boolean last) {

    handle(data);
    webSocket.request(1);
    return null;
}
~~~

request(1) permits another receive invocation; it does not mean “read exactly one complete application message”. The counter applies to `onText`, `onBinary`, `onPing`, `onPong`, **and `onClose`**. `onOpen` and `onError` are not demand-controlled receive methods; in particular, `onError` may be invoked regardless of the counter.

A text or binary message can be delivered in several fragments, so demand must be reasoned about together with fragmentation. The `CompletionStage` returned from a receive callback is separate from this counter: requesting another invocation is what increases demand.

Demand control keeps callbacks from being delivered beyond what the application has requested. It does not turn WebSocket into a complete Reactive Streams abstraction; deeper Flow/reactive semantics belong elsewhere.

A common pitfall is forgetting to request more data after onOpen or a callback, leaving the connection alive but no longer receiving events as expected.
