`java.net.http.HttpClient` is the JDK's higher-level HTTP client API. Instead of opening sockets, framing HTTP, parsing status/header data, and managing connection reuse manually, application code works with three primary abstractions:

```text
HttpClient
   │  shared configuration + resources
   │
   ├── send/sendAsync(HttpRequest, BodyHandler)
   │                         │
   │                         └── decides how to consume the response body
   ↓
HttpResponse<T>
   ├── statusCode
   ├── headers
   └── body : T
```

`HttpRequest` describes a built request: URI, method, headers, timeout, preferred HTTP version, and an optional body publisher. `HttpClient` performs the exchange. `HttpResponse<T>` exposes response metadata together with the body type `T` selected by the `BodyHandler<T>`.

A basic example:

```java
HttpClient client = HttpClient.newHttpClient();

HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://example.com/"))
        .GET()
        .build();

HttpResponse<String> response =
        client.send(request, HttpResponse.BodyHandlers.ofString());

System.out.println(response.statusCode());
System.out.println(response.body());
```

The generic type of `HttpResponse<T>` does not describe the payload on the wire. It describes the **Java representation after the body handler processes it**. The same HTTP response body can be represented as `String`, `byte[]`, `Path`, `InputStream`, `Flow.Publisher<...>`, or another type through an appropriate handler/subscriber.
