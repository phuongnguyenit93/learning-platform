Sockets and channels own operating-system resources. Garbage collection is not an appropriate connection-lifecycle strategy. Code should have a **clear owner** responsible for close.

For scope-bound resources, prefer try-with-resources:

~~~java
try (Socket socket = new Socket("localhost", 8080);
     InputStream in = socket.getInputStream()) {

    // communicate
}
~~~

Closing a Socket closes the streams associated with that socket. Closing a channel makes subsequent I/O fail because the channel is no longer open.

Cleanup must also happen when:

- connection setup succeeds but protocol setup fails;
- read or write throws;
- a task is cancelled;
- the application abandons an operation.

Avoid contracts where several layers all believe they own the same socket lifecycle. If a library receives a Socket from its caller, the contract should state whether the library closes it.

Clear ownership becomes essential for cancellation, orderly shutdown, and connection reuse in later chapters.
