`HttpRequest.Builder` tách **metadata của request** khỏi **việc tạo request body**. GET đơn giản có thể không có body; POST/PUT thường nhận một `BodyPublisher`.

```java
HttpRequest request = HttpRequest.newBuilder()
        .uri(URI.create("https://example.com/items"))
        .timeout(Duration.ofSeconds(10))
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(
                "{\"name\":\"book\"}", StandardCharsets.UTF_8))
        .build();
```

`BodyPublishers` cung cấp các nguồn phổ biến như:

- `noBody()` cho request không có body;
- `ofString(...)`, `ofByteArray(...)` cho body đã có trong bộ nhớ;
- `ofFile(...)` cho dữ liệu từ file;
- `ofInputStream(...)` cho stream do supplier cung cấp;
- `fromPublisher(...)` khi body đến từ một `Flow.Publisher<ByteBuffer>`.

`header(name, value)` thêm một giá trị header; `setHeader(name, value)` đặt lại header cùng tên theo contract của builder. `HttpHeaders` ở phía request/response là view chỉ đọc sau khi đối tượng tương ứng đã được build/nhận.

Body publisher chỉ chịu trách nhiệm cung cấp các byte của body. Content type, domain serialization, authentication scheme và idempotency/retry policy không tự xuất hiện chỉ vì chọn một publisher; tầng ứng dụng/integration vẫn phải định nghĩa chúng.
