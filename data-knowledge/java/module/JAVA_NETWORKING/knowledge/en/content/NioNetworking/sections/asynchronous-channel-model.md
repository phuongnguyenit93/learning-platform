`AsynchronousSocketChannel` and `AsynchronousServerSocketChannel` use a **completion model**: application code initiates an operation and consumes its result when the operation completes. This differs from Selector readiness, where the application is told that I/O may proceed and then performs the I/O itself.

The two main completion styles are `Future` and `CompletionHandler`:

```java
try (AsynchronousSocketChannel channel = AsynchronousSocketChannel.open()) {
    channel.connect(new InetSocketAddress("example.com", 8080)).get();

    ByteBuffer buffer = ByteBuffer.allocate(1024);
    Future<Integer> pendingRead = channel.read(buffer);
    int read = pendingRead.get();
}
```

The operation is still initiated through the asynchronous-channel model, but calling `Future.get()` immediately as in this example makes the caller wait at that point. A `Future` does not by itself turn the following code into a callback/composition pipeline.

Or a callback:

```java
channel.read(buffer, state, new CompletionHandler<Integer, State>() {
    @Override
    public void completed(Integer read, State state) {
        // operation completed; process the result and initiate the next step
    }

    @Override
    public void failed(Throwable error, State state) {
        // handle failure and resource lifecycle
    }
});
```

Asynchronous APIs do not remove partial I/O: a completion result is still the number of bytes actually read or written. A buffer also must not be concurrently modified while the asynchronous operation is using it.

These channels impose pending-operation rules. Starting another read while a previous read is outstanding can cause `ReadPendingException`; the corresponding write rule can cause `WritePendingException`, and an asynchronous server permits at most one outstanding accept (`AcceptPendingException`). The state machine still needs clear ownership.

Channels can belong to an `AsynchronousChannelGroup`, through which the implementation manages execution resources used for completion. That is the networking completion mechanism; deeper executor and concurrency design belongs to the Concurrency curriculum.
