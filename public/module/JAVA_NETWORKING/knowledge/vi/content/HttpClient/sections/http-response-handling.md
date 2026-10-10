`BodyHandler<T>` quyết định **response body sẽ được tiêu thụ thành kiểu Java nào**. Handler được gọi khi status code và headers đã có, trước khi các byte body thực tế được đọc, và nó trả về một `BodySubscriber<T>` để nhận body.

```text
status + headers đến
        ↓
BodyHandler<T>.apply(ResponseInfo)
        ↓
BodySubscriber<T>
        ↓ tiêu thụ các byte response
CompletionStage<T>
        ↓
HttpResponse<T>.body()
```

Các handler dựng sẵn bao phủ phần lớn trường hợp sử dụng:

```java
BodyHandlers.ofString();       // HttpResponse<String>
BodyHandlers.ofByteArray();    // HttpResponse<byte[]>
BodyHandlers.ofFile(path);     // HttpResponse<Path>
BodyHandlers.discarding();     // body được tiêu thụ rồi bỏ
BodyHandlers.ofInputStream();  // HttpResponse<InputStream>, body còn ở dạng stream
```

Handler có thể chọn subscriber dựa trên metadata của response. Ví dụ chỉ materialize body dạng text khi status là 200, còn status khác thì tiêu thụ body rồi thay bằng chuỗi rỗng:

```java
HttpResponse.BodyHandler<String> handler = info ->
        info.statusCode() == 200
                ? HttpResponse.BodySubscribers.ofString(StandardCharsets.UTF_8)
                : HttpResponse.BodySubscribers.replacing("");
```

`BodySubscriber<T>` extends `Flow.Subscriber<List<ByteBuffer>>` và chuyển các byte body có thứ tự thành `T`. Nếu chỉ cần mapping phổ biến, dùng `BodyHandlers`/`BodySubscribers` có sẵn trước khi tự viết subscriber; custom subscriber phải tuân thủ Flow demand/cancellation và vòng đời tài nguyên.
