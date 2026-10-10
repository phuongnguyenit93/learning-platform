A `Selector` is a **multiplexor of `SelectableChannel` objects**. One thread can wait for readiness across many channels instead of blocking separately on each channel. A selector does not execute business logic and is not a thread pool.

A channel must be in non-blocking mode before it can be registered with a selector:

```java
try (Selector selector = Selector.open();
     ServerSocketChannel server = ServerSocketChannel.open()) {

    server.bind(new InetSocketAddress(8080));
    server.configureBlocking(false);
    server.register(selector, SelectionKey.OP_ACCEPT);

    while (true) {
        selector.select();

        Iterator<SelectionKey> it = selector.selectedKeys().iterator();
        while (it.hasNext()) {
            SelectionKey key = it.next();
            it.remove();

            if (key.isAcceptable()) {
                // accept and register the new channel when appropriate
            }
        }
    }
}
```

Readiness answers a question like "this operation **appears able to make progress now**"; it does not promise that the next I/O call will complete all work. The `SelectionKey` API explicitly describes the ready set as a hint whose accuracy can change after selection or after I/O occurs.

Common operations are `OP_ACCEPT`, `OP_CONNECT`, `OP_READ`, and `OP_WRITE`, depending on the channel type. `select()` can block for readiness, `selectNow()` checks without blocking, and `wakeup()` lets another thread make a blocked selector return so the event loop can observe registration or state changes.

When using `selectedKeys()`, application code removes or clears processed keys. Selection adds ready keys to that set; it does not remove each key merely because the application handled it.
