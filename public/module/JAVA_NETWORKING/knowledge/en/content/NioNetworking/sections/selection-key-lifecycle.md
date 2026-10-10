One channel/selector pair has one `SelectionKey`. The first registration creates that key; registering the same channel with the same selector again returns the existing key while updating the interest set, and a non-null attachment supplied to the three-argument overload replaces the current attachment. Registering the channel with a different selector has a distinct key. Each key therefore ties together one **channel**, one **selector**, and the selection state for that pair.

Keep its two operation sets distinct:

- the **interest set** says which operation categories the application wants tested on the next selection, read/changed through `interestOps(...)`;
- the **ready set** reports operation categories the selector detected as ready, read through `readyOps()` or helpers such as `isReadable()`.

Connection state is often attached to the key:

```java
SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
key.attach(new ConnectionState());
```

When outbound data appears, the event loop can add `OP_WRITE`; after all pending bytes are sent, remove `OP_WRITE` from the interest set. Leaving write interest enabled continuously can make a usually-writable socket wake the selector repeatedly and create a busy loop.

Non-blocking connect also forms a state machine. `SocketChannel.connect(remote)` can return `false`; the channel can then be watched with `OP_CONNECT`, and `finishConnect()` is called when it becomes connectable to finish the connection or surface its failure.

`cancel()` invalidates a key, but actual deregistration is processed by the selector during a later selection operation. Closing the channel or selector also invalidates the key. Event loops therefore need validity checks when other threads may close or cancel resources.
