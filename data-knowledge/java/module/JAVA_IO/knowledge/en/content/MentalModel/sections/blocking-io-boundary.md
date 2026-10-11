When code calls an I/O operation, the requested data is not necessarily already available in RAM. The program may have to wait for a filesystem, device, or network peer.

With traditional blocking I/O, a call such as `read()` may not return immediately:

```text
call read()
    ↓
data is not ready
    ↓
calling thread waits
    ↓
data / EOF / error becomes available
    ↓
read() returns or throws
```

A **thread** is one execution flow inside a process. “Blocking” means the calling thread waits for the operation to complete. It does not mean the CPU must spin at full usage during that wait. The JVM and operating system can suspend the thread while other work uses the CPU.

With **non-blocking I/O**, an operation is designed not to keep the calling thread waiting until the resource becomes ready. The call can return control earlier so the program can do other work and react when a readiness/event mechanism reports that data can be processed. This is a difference in waiting and coordination, not a promise that every operation is faster.

**Asynchronous I/O** is a different dimension: an operation is initiated first and its result is delivered later, for example through a `Future` or callback. Asynchronous is therefore not a synonym for non-blocking; the implementation underneath can use different mechanisms depending on the platform. The later FileChannel chapter uses `AsynchronousFileChannel` to make this boundary concrete.

This creates a useful distinction between **CPU-bound work** and **I/O-bound work**. CPU-bound work spends most of its time computing on the CPU; I/O-bound work spends most of its time waiting for files, devices, sockets, or other external resources.

Not every Java I/O API is inherently blocking. NIO also provides channels and non-blocking mechanisms for appropriate workloads. These early chapters intentionally use synchronous stream/file I/O to establish the basic model first.
