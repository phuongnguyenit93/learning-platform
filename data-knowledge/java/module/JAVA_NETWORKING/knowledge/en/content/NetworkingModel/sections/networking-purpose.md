Networking lets a Java program exchange data with **another process through a network endpoint**. The peer may run on the same machine, on a nearby host, or in a remote data center. Unlike local memory or file access, network I/O crosses a boundary outside the JVM: it has latency, depends on operating-system resources, can fail midway, and must be closed deliberately.

Without networking, an application is limited to local computation or a different IPC mechanism. Networking solves a broader chain of problems:

~~~text
independent peers
→ find one another
→ establish a communication model
→ transfer data
→ handle failure
→ release resources
~~~

The JDK offers several abstraction levels. Low-level APIs include Socket, ServerSocket, DatagramSocket, and network channels. Higher-level APIs include HttpClient and the WebSocket client. The goal of this module is not to memorize classes; it is to understand **which part of the communication problem each abstraction owns**.

A useful mental model is:

~~~text
application intent
    ↓
protocol / API abstraction
    ↓
endpoint + transport
    ↓
network I/O
    ↓
remote process
~~~

When debugging network code, start with four questions: which endpoint is involved, which transport is in use, which operation can be waiting, and which resource must eventually be closed?
