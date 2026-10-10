JDK HTTP request and response bodies have a direct boundary with `java.util.concurrent.Flow`.

On the outgoing side, `HttpRequest.BodyPublisher` extends `Flow.Publisher<ByteBuffer>`. For each outgoing request body the client subscribes to the publisher to receive ordered byte buffers. `BodyPublishers.fromPublisher(...)` adapts an existing publisher:

```java
Flow.Publisher<ByteBuffer> source = createBodyPublisher();

HttpRequest request = HttpRequest.newBuilder(uri)
        .POST(HttpRequest.BodyPublishers.fromPublisher(source))
        .build();
```

On the incoming side, `BodySubscriber<T>` extends `Flow.Subscriber<List<ByteBuffer>>`. To expose a response body as a publisher instead of materializing it immediately:

```java
HttpResponse<Flow.Publisher<List<ByteBuffer>>> response =
        client.send(request, HttpResponse.BodyHandlers.ofPublisher());

Flow.Publisher<List<ByteBuffer>> body = response.body();
body.subscribe(mySubscriber);
```

The publisher returned by `ofPublisher()` permits **one subscription**. That subscriber must request data through completion/error, or cancel when it will not continue. Failing to subscribe, request, or cancel can leave the body unfinished and keep the HTTP exchange/resources alive.

Flow brings demand and cancellation to the body transport boundary; it does not define the business backpressure strategy of an entire application. Deeper reactive/concurrency composition belongs to the corresponding curriculum.
