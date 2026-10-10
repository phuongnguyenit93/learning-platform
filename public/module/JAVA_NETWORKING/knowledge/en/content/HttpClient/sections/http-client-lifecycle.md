Java 21 added an explicit lifecycle API to `HttpClient`: it implements `AutoCloseable` and exposes `shutdown()`, `shutdownNow()`, `awaitTermination(...)`, `isTerminated()`, and `close()`.

There is an important API-contract boundary here. The **JDK built-in client** returned by `newHttpClient()` / `newBuilder().build()` overrides these methods with best-effort shutdown behavior. The base `HttpClient` class also provides default implementations, but those defaults do not by themselves guarantee that an arbitrary custom subclass owns real shutdown mechanics. The behavior below describes the JDK built-in implementation that normal application code receives from the factories.

- `shutdown()` starts an orderly shutdown: previously submitted requests may run to completion, new requests are no longer accepted, and the method does not wait for termination.
- `awaitTermination(duration)` waits after shutdown until operations complete, the duration expires, or the thread is interrupted.
- `shutdownNow()` attempts to begin immediate shutdown, but stopping active operations is best effort.
- `close()` begins orderly shutdown **and waits** until operations have completed and the client terminates.

```java
HttpClient client = HttpClient.newHttpClient();
try (client) {
    HttpResponse<String> response =
            client.send(request, BodyHandlers.ofString());
}
```

The **response-body lifetime** contributes to request lifetime. With `BodyHandlers.ofInputStream()`, the response can become available after headers while the body remains unread; the caller must read to EOF or close the stream:

```java
HttpResponse<InputStream> response =
        client.send(request, BodyHandlers.ofInputStream());

try (InputStream body = response.body()) {
    consume(body);
}
```

Closing the stream before exhaustion can close the underlying HTTP connection and prevent later reuse, but it still releases the exchange resource. `ofLines()` similarly requires exhausting or closing the `Stream`; `ofPublisher()` requires subscribing and requesting through completion/error, or cancelling the subscription.

The Java 21 API warns that unread/unclosed returned streams, or custom subscribers that neither request nor cancel, can stall orderly shutdown. Because `close()` waits for orderly termination, an abandoned streaming body can make close wait for a long time. **Body ownership is therefore part of correct client shutdown**, not merely memory cleanup.
