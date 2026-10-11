One WebSocket text or binary message may arrive through **multiple callback fragments**. The last flag tells the listener whether the current fragment ends the message.

~~~java
StringBuilder current = new StringBuilder();

@Override
public CompletionStage<?> onText(
        WebSocket webSocket,
        CharSequence data,
        boolean last) {

    current.append(data);

    if (last) {
        processMessage(current.toString());
        current.setLength(0);
    }

    webSocket.request(1);
    return null;
}
~~~

Do not assume:

~~~text
one onText callback = one application message
~~~

Binary callbacks use the same idea with ByteBuffer. If fragments are accumulated, application code should enforce sensible size limits so a peer cannot make memory grow without bound.

Fragmentation here is receive-API behavior needed for correct client code. Deep protocol framing belongs to the WebSocket protocol/realtime area.
