`send` và `sendAsync` dùng cùng mô hình request/handler nhưng khác cách bên gọi chờ completion.

`send(...)` block thread gọi cho tới khi response khả dụng theo semantics của body handler:

```java
HttpResponse<String> response =
        client.send(request, BodyHandlers.ofString());
```

`sendAsync(...)` trả ngay một `CompletableFuture<HttpResponse<T>>`:

```java
CompletableFuture<Integer> statusFuture = client
        .sendAsync(request, BodyHandlers.ofString())
        .thenApply(HttpResponse::statusCode);
```

Async ở đây là **completion API**. Nó không biến mọi xử lý phía sau thành non-blocking và không yêu cầu bên gọi tự dùng `Selector`. `CompletableFuture` chỉ biểu diễn việc trao đổi HTTP/xử lý response sẽ hoàn tất sau.

Thời điểm response/future trở nên khả dụng còn phụ thuộc body handler. `ofString()` materialize toàn body thành `String`, trong khi `ofInputStream()`, `ofLines()` hoặc `ofPublisher()` có thể trả response sau khi headers có và để bên gọi tiếp tục tiêu thụ body sau đó.

Với client mặc định của JDK, future trả từ `sendAsync` có thể cancel; cancellation cố gắng hủy trao đổi nhưng chỉ theo kiểu best effort vì request có thể đã bắt đầu được xử lý. Tương tự, interrupt `send` khiến cách triển khai mặc định cố hủy trao đổi rồi ném `InterruptedException`. Mã không nên suy luận "cancel thành công ở phía Java" đồng nghĩa server từ xa chắc chắn chưa thấy request.
