The Networking module owns **how the JDK HTTP Client API behaves**: client/request/response abstractions, body streaming, synchronous/asynchronous completion, policy configuration, connection/resource lifetime, and Java 21 shutdown semantics.

It does not own every HTTP integration concern in an application. When the question becomes one of these decisions:

- which calls service A should retry and with what backoff;
- whether to choose JDK `HttpClient`, Spring `RestClient`/`WebClient`, Feign, or another framework;
- how HTTP status/body becomes a domain error;
- where circuit breakers, bulkheads, rate limits, or observability policies live;
- how OAuth/token refresh/service credentials are organized;
- how API contracts/versioning and cross-service request orchestration are designed;

the learning path hands off to the appropriate integration, security, or architecture owner.

That boundary lets learners use the JDK API correctly without confusing a transport/client mechanism with an entire integration architecture:

```text
Networking
    JDK HttpClient mechanics
          ↓ consumed by
HTTP Integration
    application/client patterns + resilience + domain policy
```

The boundary also prevents leakage in the other direction: a framework HTTP client ultimately relies on networking/resource mechanics somewhere, but learning every integration pattern is not a prerequisite for understanding the JDK's `HttpClient`.

The next chapter keeps the same `java.net.http` family but changes the communication model: instead of independent request/response exchanges, the JDK WebSocket client manages a long-lived bidirectional message-oriented connection with listener demand, fragmentation, send completion, and close/error lifecycle.
