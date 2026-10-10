`HttpRequest.Builder` separates **request metadata** from **request-body production**. A simple GET can have no body; POST/PUT commonly receive a `BodyPublisher`.

```java
HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://example.com/items"))
        .timeout(Duration.ofSeconds(10))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(
                "{\"name\":\"book\"}", StandardCharsets.UTF_8))
        .build();
```

`BodyPublishers` provides common body sources:

- `noBody()` for a request without a body;
- `ofString(...)` and `ofByteArray(...)` for in-memory bodies;
- `ofFile(...)` for file content;
- `ofInputStream(...)` for a stream supplied on demand;
- `fromPublisher(...)` when the body comes from a `Flow.Publisher<ByteBuffer>`.

`header(name, value)` adds a header value; `setHeader(name, value)` replaces values for that name according to the builder contract. `HttpHeaders` on built requests and received responses is a read-only view.

A body publisher supplies body bytes. It does not automatically define content type, domain serialization, authentication scheme, or idempotency/retry policy; those concerns still belong to application or integration design.
