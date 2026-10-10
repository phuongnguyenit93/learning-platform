This Networking chapter owns **JDK client mechanics**:

- building/opening the connection;
- Listener callback lifetime;
- demand;
- fragmentation;
- send, close, and error behavior.

It does not own:

- WebSocket server design;
- reconnect/backoff policy;
- application heartbeat strategy;
- STOMP or broker semantics;
- topic/channel/subscription models;
- application-protocol authentication flows;
- distributed realtime architecture.

Mental handoff:

~~~text
JDK WebSocket API
→ how the Java client sends and receives

Realtime / Integration
→ what messages mean
→ how reconnect/subscription works
→ topology and delivery semantics
~~~

This boundary remains useful even when a framework such as Spring WebSocket hides low-level client mechanics. Framework abstraction does not move application-protocol responsibilities into core Java Networking.

The final chapter combines TCP, UDP, NIO, HttpClient, and WebSocket into one decision model so the learner can choose an appropriate abstraction and recognize when a concern belongs to Security, Concurrency, or Integration instead.
