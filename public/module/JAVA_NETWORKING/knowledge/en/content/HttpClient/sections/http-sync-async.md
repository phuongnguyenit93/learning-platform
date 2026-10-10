`send` and `sendAsync` use the same request/handler model but differ in how the caller observes completion.

`send(...)` blocks the calling thread until the response is available according to the body handler's semantics:

```java
HttpResponse<String> response =
        client.send(request, BodyHandlers.ofString());
```

`sendAsync(...)` returns a `CompletableFuture<HttpResponse<T>>` immediately:

```java
CompletableFuture<Integer> statusFuture = client
        .sendAsync(request, BodyHandlers.ofString())
        .thenApply(HttpResponse::statusCode);
```

Async here is a **completion API**. It does not make every downstream action non-blocking and does not require the caller to manage a `Selector`. The `CompletableFuture` represents an HTTP exchange/response-handling operation that will complete later.

The point at which the response/future becomes available also depends on the body handler. `ofString()` materializes the body as a `String`, whereas `ofInputStream()`, `ofLines()`, or `ofPublisher()` can expose the response after headers are available and leave further body consumption to the caller.

For the default JDK client, the future returned by `sendAsync` is cancelable; cancellation attempts to cancel the exchange but is best effort because processing may already have started. Likewise, interrupting `send` causes the default implementation to attempt cancellation and throw `InterruptedException`. Application code must not infer that successful Java-side cancellation proves that the remote server never saw the request.
