Java 21 bổ sung API vòng đời rõ ràng cho `HttpClient`; client implements `AutoCloseable` và có `shutdown()`, `shutdownNow()`, `awaitTermination(...)`, `isTerminated()` và `close()`.

Cần phân biệt rõ contract của API với hành vi của cách triển khai. **JDK built-in client** được tạo bởi `newHttpClient()` / `newBuilder().build()` override các method này để cung cấp shutdown theo kiểu best effort. Base class `HttpClient` cũng có cách triển khai mặc định, nhưng chỉ việc method tồn tại không có nghĩa một subclass tùy chỉnh bất kỳ sẽ sở hữu cùng cơ chế shutdown thực tế. Các hành vi dưới đây mô tả cách triển khai built-in mà ứng dụng thông thường nhận từ factory của JDK.

- `shutdown()` bắt đầu orderly shutdown: request đã submit được phép chạy tới completion, request mới không còn được nhận; method không chờ client kết thúc.
- `awaitTermination(duration)` chờ sau shutdown tới khi các thao tác hoàn tất, hết duration hoặc thread bị interrupt.
- `shutdownNow()` cố bắt đầu immediate shutdown, nhưng việc dừng các thao tác đang chạy chỉ theo kiểu best effort.
- `close()` bắt đầu orderly shutdown **và chờ** tới khi các thao tác hoàn tất và client kết thúc.

```java
HttpClient client = HttpClient.newHttpClient();
try (client) {
    HttpResponse<String> response =
            client.send(request, BodyHandlers.ofString());
}
```

Vòng đời của **response body** quyết định vòng đời request. Với `BodyHandlers.ofInputStream()`, response có thể được trả ngay sau headers; bên gọi phải đọc tới EOF hoặc đóng stream:

```java
HttpResponse<InputStream> response =
        client.send(request, BodyHandlers.ofInputStream());

try (InputStream body = response.body()) {
    consume(body);
}
```

Đóng stream trước khi đọc hết có thể khiến kết nối HTTP bên dưới bị đóng và không thể tái sử dụng, nhưng vẫn giải phóng tài nguyên của trao đổi. `ofLines()` tương tự yêu cầu đọc hết hoặc đóng `Stream`; `ofPublisher()` yêu cầu subscribe rồi request tới completion/error hoặc cancel subscription.

Java 21 API cảnh báo rằng nếu các stream trả về không được đọc/đóng, hoặc custom subscriber không request/cancel, orderly shutdown có thể bị đình trệ. Vì `close()` chờ quá trình kết thúc có trật tự, một body bị bỏ quên có thể khiến `close()` phải chờ rất lâu. Do đó **trách nhiệm sở hữu body là một phần của tính đúng đắn khi shutdown client**, không chỉ là chuyện dọn bộ nhớ.
