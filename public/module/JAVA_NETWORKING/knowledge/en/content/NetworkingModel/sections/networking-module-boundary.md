This module owns **JDK networking APIs and their runtime mechanics from application code**:

- addressing and name resolution;
- TCP and UDP sockets;
- socket options, timeouts, failures, and resource lifetime;
- NIO network channels, selectors, and asynchronous channels;
- the JDK HTTP Client and WebSocket client;
- choosing among networking abstractions.

Several neighboring topics appear only to make the boundary explicit:

- TLS/JSSE, certificates, and key material → Security & Cryptography;
- scheduling, executors, and the virtual-thread model → Concurrency;
- HTTP API design, REST conventions, retries, and resilience policy → Integration / Resilience;
- WebSocket protocol architecture, reconnect policy, STOMP, and messaging semantics → Realtime Integration;
- gateways, proxy architecture, service meshes, and routing → Infrastructure / Network.

This prevents a common learning mistake: seeing one HTTPS request with JSON, retries, and TLS and labeling all of it “Java Networking”. Networking explains the connection/API mechanics; the other concerns have their own owners.

After this entry chapter, the learning flow should feel clear: **endpoint → transport → failure/lifecycle → NIO model → HTTP/WebSocket → decision trade-offs**.
