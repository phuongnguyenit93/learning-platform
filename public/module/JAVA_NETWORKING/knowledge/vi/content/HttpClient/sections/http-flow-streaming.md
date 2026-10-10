Request và response body của JDK HTTP Client có ranh giới trực tiếp với `java.util.concurrent.Flow`.

Ở chiều gửi, `HttpRequest.BodyPublisher` extends `Flow.Publisher<ByteBuffer>`. Khi gửi request có body, client subscribe publisher để nhận các `ByteBuffer` đầu ra theo thứ tự. `BodyPublishers.fromPublisher(...)` là adapter khi ứng dụng đã có một publisher:

```java
Flow.Publisher<ByteBuffer> source = createBodyPublisher();

HttpRequest request = HttpRequest.newBuilder(uri)
        .POST(HttpRequest.BodyPublishers.fromPublisher(source))
        .build();
```

Ở chiều nhận, `BodySubscriber<T>` extends `Flow.Subscriber<List<ByteBuffer>>`. Nếu muốn đưa body ra dưới dạng publisher thay vì materialize ngay:

```java
HttpResponse<Flow.Publisher<List<ByteBuffer>>> response =
        client.send(request, HttpResponse.BodyHandlers.ofPublisher());

Flow.Publisher<List<ByteBuffer>> body = response.body();
body.subscribe(mySubscriber);
```

Publisher do `ofPublisher()` trả về chỉ cho phép subscribe **một lần**. Subscriber phải request dữ liệu cho tới completion/error, hoặc cancel nếu không tiếp tục. Nếu không subscribe, không request hoặc không cancel, body có thể không hoàn tất và giữ trao đổi HTTP/tài nguyên còn sống.

Flow đưa demand/cancellation vào ranh giới transport của body; nó không tự định nghĩa chiến lược backpressure nghiệp vụ của toàn ứng dụng. Các mẫu composition concurrency/reactive sâu hơn thuộc module chuyên trách.
