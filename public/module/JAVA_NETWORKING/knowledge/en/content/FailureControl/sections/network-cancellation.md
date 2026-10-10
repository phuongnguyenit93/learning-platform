Cancelling network I/O should answer two questions: **which operation must stop, and is the resource still usable afterward?**

In Java 21, the system-default implementations of Socket, ServerSocket, and DatagramSocket have an important behavior when blocking I/O runs in a **virtual thread**: interrupting a virtual thread blocked on socket I/O wakes the thread and closes the socket.

~~~java
Thread worker = Thread.ofVirtual().start(() -> {
    try (Socket socket = new Socket("localhost", 8080)) {
        socket.getInputStream().read(); // may block
    } catch (IOException e) {
        // cancellation / close is observed here
    }
});

worker.interrupt();
~~~

That behavior is why cancellation must be part of resource-lifetime reasoning. Do not catch the resulting failure and continue under the assumption that the same socket remains usable.

InterruptibleChannel APIs have their own interruption/asynchronous-close semantics, which the NIO chapter builds on.

The module-level rule is simple: cancellation is not merely “stop the thread”; it must leave the system in a **defined resource state**.
