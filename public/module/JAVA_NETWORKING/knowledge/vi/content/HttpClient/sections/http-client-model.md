`java.net.http.HttpClient` là API HTTP client mức cao của JDK. Thay vì tự mở socket, framing HTTP, parse status line/header và quản lý việc tái sử dụng kết nối, ứng dụng làm việc với ba abstraction chính:

```text
HttpClient
   │  cấu hình + tài nguyên dùng chung
   │
   ├── send/sendAsync(HttpRequest, BodyHandler)
   │                         │
   │                         └── quyết định cách xử lý body của response
   ↓
HttpResponse<T>
   ├── statusCode
   ├── headers
   └── body : T
```

`HttpRequest` mô tả một request đã build: URI, method, headers, timeout, phiên bản HTTP ưu tiên và body publisher tùy chọn. `HttpClient` thực hiện trao đổi HTTP. `HttpResponse<T>` trả metadata của response cùng kiểu body `T` do `BodyHandler<T>` quyết định.

Ví dụ cơ bản:

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

Kiểu generic của `HttpResponse<T>` không mô tả HTTP payload trên đường truyền; nó mô tả **cách biểu diễn Java sau khi body handler xử lý**. Cùng một response có thể được biểu diễn thành `String`, `byte[]`, `Path`, `InputStream`, `Flow.Publisher<...>` hoặc kiểu khác thông qua handler/subscriber phù hợp.
