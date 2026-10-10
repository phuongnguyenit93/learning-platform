A `BodyHandler<T>` decides **which Java type consumes the response body**. The handler is invoked after the status code and headers are available but before the actual body bytes are read, and it returns a `BodySubscriber<T>` for those bytes.

```text
status + headers arrive
        ↓
BodyHandler<T>.apply(ResponseInfo)
        ↓
BodySubscriber<T>
        ↓ consumes response bytes
CompletionStage<T>
        ↓
HttpResponse<T>.body()
```

Predefined handlers cover most common cases:

```java
BodyHandlers.ofString();       // HttpResponse<String>
BodyHandlers.ofByteArray();    // HttpResponse<byte[]>
BodyHandlers.ofFile(path);     // HttpResponse<Path>
BodyHandlers.discarding();     // consume and discard the body
BodyHandlers.ofInputStream();  // HttpResponse<InputStream>, body remains streaming
```

A handler can select a subscriber from response metadata. For example, materialize a text body only for status 200 and otherwise consume the body while replacing its value with an empty string:

```java
HttpResponse.BodyHandler<String> handler = info ->
        info.statusCode() == 200
                ? HttpResponse.BodySubscribers.ofString(StandardCharsets.UTF_8)
                : HttpResponse.BodySubscribers.replacing("");
```

`BodySubscriber<T>` extends `Flow.Subscriber<List<ByteBuffer>>` and turns the ordered response bytes into `T`. Prefer the predefined `BodyHandlers`/`BodySubscribers` when they fit; a custom subscriber must obey Flow demand/cancellation and resource-lifecycle rules.
