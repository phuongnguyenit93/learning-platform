Before virtual threads, a common reason to choose a Selector was to avoid dedicating an expensive platform thread to every connection that might spend most of its time blocked. Java 21 changes that trade-off.

JEP 444 specifies that when code in a virtual thread blocks on most network I/O in `java.net` and `java.nio.channels`, the runtime can suspend the virtual thread and release its carrier platform thread for other work. **High connection concurrency therefore no longer automatically implies a move to non-blocking Selector code.**

On Java 21, this benefit assumes the virtual thread can unmount from its carrier. If surrounding code pins the virtual thread, for example while blocking in certain `synchronized` regions or native calls, the carrier can remain occupied for the duration. Detailed pinning mechanics belong to the Virtual Threads/Concurrency curriculum; Networking only needs this limit when comparing I/O models.

A thread-per-connection flow can remain sequential and readable:

```java
try (var executor = Executors.newVirtualThreadPerTaskExecutor();
     ServerSocket server = new ServerSocket(8080)) {

    while (!server.isClosed()) {
        Socket socket = server.accept();
        executor.submit(() -> {
            try (socket) {
                handle(socket);
            }
            return null;
        });
    }
}
```

JDK 21 also specifies blocking operations on the system-default `Socket`, `ServerSocket`, and `DatagramSocket` as interruptible when invoked in a virtual thread: interrupting the blocked virtual thread wakes it and closes the socket. Channels already have their own `InterruptibleChannel` cancellation/interrupt semantics.

Virtual threads do not make network I/O itself faster and do not remove limits such as bandwidth, remote latency, connection pools, or downstream capacity. Selector remains useful for an explicit event-loop/readiness state machine; asynchronous channels remain useful when completion-style APIs or composition fit the surrounding design.
