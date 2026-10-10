`HttpClient` được tạo qua `HttpClient.newBuilder()` hoặc `newHttpClient()`. Sau khi build, client là immutable và có thể dùng cho nhiều request. Đây cũng là đơn vị chia sẻ tài nguyên/cấu hình của HTTP API.

```java
HttpClient client = HttpClient.newBuilder()
        .version(HttpClient.Version.HTTP_2)
        .followRedirects(HttpClient.Redirect.NORMAL)
        .connectTimeout(Duration.ofSeconds(5))
        .build();
```

Các thiết lập cấp client như phiên bản protocol ưu tiên, redirect policy, connect timeout, proxy, authenticator, cookie handler và executor được dùng chung cho các request gửi qua client đó. Một số thiết lập có thể được tinh chỉnh ở ranh giới request, ví dụ request timeout hoặc phiên bản ưu tiên.

Oracle API mô tả mỗi `HttpClient` thường quản lý connection pool riêng và tái sử dụng kết nối khi phù hợp. Vì vậy tạo client mới cho mỗi thao tác thường làm mất cơ hội tái sử dụng đó:

```text
Mô hình sở hữu phù hợp
một HttpClient
   ├── request A
   ├── request B
   └── request C

thường lãng phí
new HttpClient -> one request -> close/drop
new HttpClient -> one request -> close/drop
```

"Tái sử dụng client" không có nghĩa giữ một request builder mutable dùng chung giữa nhiều thread. `HttpClient` sau build là đối tượng cấu hình/tài nguyên dùng chung; mỗi request logic thường build một `HttpRequest` immutable riêng.
