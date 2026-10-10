WebSocket.Listener is the receive-side contract of the JDK client. Its main callbacks reflect connection lifetime:

~~~text
onOpen
  ↓
onText / onBinary / onPing / onPong
  ↓
onClose

failure path
→ onError
~~~

A minimal listener can look like:

~~~java
WebSocket.Listener listener = new WebSocket.Listener() {
    @Override
    public void onOpen(WebSocket webSocket) {
        webSocket.request(1);
    }

    @Override
    public CompletionStage<?> onText(
            WebSocket webSocket,
            CharSequence data,
            boolean last) {

        System.out.println(data);
        webSocket.request(1);
        return null;
    }
};
~~~

Receive callbacks for one WebSocket are ordered by the client API, so application code should not invent unnecessary races by assuming arbitrary concurrent callbacks for the same connection.

That ordering has a precise boundary: the next listener invocation starts only after the previous listener **method invocation returns**. For `onText`, `onBinary`, `onPing`, and `onPong`, the returned `CompletionStage` primarily tells the WebSocket when the supplied data object may be reclaimed; completing that stage is **not** what advances the receive-demand counter and is not required before another requested callback can begin.

Callbacks are network-event boundaries, not good places for long blocking business work. If expensive processing is handed off to another executor and the callback returns immediately, later callbacks can begin once demand allows them, so application state may now be processed concurrently. Keep both demand and processing ownership explicit instead of assuming the returned stage serializes application work.
