Java Networking ends at **client API mechanics and transport behavior**. Once the application cares about the meaning of a request or message, responsibility has moved into an integration layer.

For HTTP, Networking owns:

- HttpClient configuration and reuse;
- HttpRequest/HttpResponse mechanics;
- body publisher/subscriber behavior;
- timeout/proxy/authenticator mechanics.

Integration owns:

- REST/resource design;
- API contracts and status-code policy;
- serialization/domain schema;
- idempotency/retry semantics;
- service-to-service communication patterns.

For WebSocket, Networking owns listener, demand, fragmentation, send, close, and error lifecycle. Realtime Integration owns reconnect strategy, subscription/topic models, STOMP/broker semantics, and the application message protocol.

Mental handoff:

~~~text
Networking
→ "How does Java send and receive?"

Integration
→ "What contract are the applications using?"
~~~

This keeps Java Advanced deep in runtime/API mechanics without duplicating the Microservice/Integration curriculum.
