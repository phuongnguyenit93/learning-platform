Create an `HttpClient` through `HttpClient.newBuilder()` or `newHttpClient()`. Once built, the client is immutable and can send many requests. It is also the unit that shares HTTP configuration and resources.

```java
HttpClient client = HttpClient.newBuilder()
        .version(HttpClient.Version.HTTP_2)
        .followRedirects(HttpClient.Redirect.NORMAL)
        .connectTimeout(Duration.ofSeconds(5))
        .build();
```

Client-level settings such as preferred protocol version, redirect policy, connect timeout, proxy, authenticator, cookie handler, and executor apply across requests sent through that client. Some concerns can be refined at the request boundary, such as request timeout or preferred version.

The Oracle API documents that each `HttpClient` typically manages its own connection pool and may reuse connections when appropriate. Creating a new client for every operation therefore usually loses that reuse opportunity:

```text
GOOD ownership shape
one HttpClient
   ├── request A
   ├── request B
   └── request C

usually wasteful
new HttpClient -> one request -> close/drop
new HttpClient -> one request -> close/drop
```

"Reuse the client" does not mean sharing a mutable request builder across threads. The built `HttpClient` is the shared configuration/resource object; each logical exchange normally builds its own immutable `HttpRequest`.
