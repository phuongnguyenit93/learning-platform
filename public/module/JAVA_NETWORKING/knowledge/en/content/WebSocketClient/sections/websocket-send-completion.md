Send-side methods return CompletableFuture<WebSocket>, representing completion of the corresponding send operation under the WebSocket API contract.

~~~java
webSocket.sendText("hello", true)
         .thenRun(() -> System.out.println("sent"));
~~~

The main send groups are:

- sendText(...);
- sendBinary(...);
- sendPing(...);
- sendPong(...);
- sendClose(...).

The last flag on text/binary sends lets the application deliberately fragment a message when needed.

Completion of the send future does **not** mean the remote business application has processed the message. It only describes the local send operation. Business acknowledgement, when required, must be designed as part of the application messaging protocol.

Keep this distinction explicit:

~~~text
send operation completed
≠ remote business action completed
~~~

Send operations also have pending-operation rules. Starting a new text/binary send while another text/binary send is pending, or switching text/binary type before a fragmented message is completed, can complete exceptionally with `IllegalStateException`. Ping/Pong sends have a similar pending-operation restriction for control messages.

Compose send stages or use a clear queue/serialization strategy so each logical send respects those state constraints:

~~~java
webSocket.sendText("part-1", false)
         .thenCompose(ws -> ws.sendText("part-2", true));
~~~
