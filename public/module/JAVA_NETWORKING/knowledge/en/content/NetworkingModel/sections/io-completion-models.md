Three terms are frequently mixed together: **blocking**, **non-blocking**, and **asynchronous completion**.

With **blocking I/O**, a call may keep the current thread waiting until the operation can make progress or completes. Reading from a socket input stream can wait for data.

With **non-blocking I/O**, the operation returns when it cannot make progress immediately. A non-blocking SocketChannel is commonly paired with a Selector so the program can discover which channels are ready.

With **asynchronous I/O**, code starts an operation and receives its result later through a Future or CompletionHandler, as with AsynchronousSocketChannel.

~~~text
blocking       → wait in the call
non-blocking   → call returns; observe readiness
asynchronous   → operation completes later
~~~

These are I/O models, not complete application concurrency architectures. Java 21 adds an important option: blocking network I/O in a virtual thread can suspend that virtual thread rather than monopolize its carrier. Blocking therefore does not automatically mean “cannot scale”.

Networking uses concurrency concepts only to explain I/O behavior. Scheduling, synchronization, executors, and the Java Memory Model remain owned by the Concurrency area.
