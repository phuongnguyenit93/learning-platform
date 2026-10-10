Connection được mở qua WebSocket.Builder lấy từ HttpClient:

~~~java
HttpClient client = HttpClient.newHttpClient();

CompletableFuture<WebSocket> future =
        client.newWebSocketBuilder()
              .connectTimeout(Duration.ofSeconds(5))
              .buildAsync(
                      URI.create("wss://example.com/events"),
                      listener
              );
~~~

buildAsync hoàn thành bình thường với WebSocket khi opening handshake thành công. Nó có thể complete exceptionally nếu có I/O error, timeout hoặc server từ chối handshake.

Builder còn có thể cấu hình header và subprotocol. Subprotocol không phải một nhãn tùy ý của ứng dụng sau khi kết nối đã mở; nó là một phần của quá trình thương lượng handshake.

URI thường dùng scheme ws hoặc wss. Với wss, TLS nằm bên dưới connection; certificate/trust/key semantics thuộc Security & Cryptography, còn Networking chỉ cần hiểu handshake có thể thất bại vì transport/security setup.

Đừng block vô hạn bằng future.join() trong luồng xử lý request chỉ vì API trả future. Hãy quyết định rõ timeout, cancellation và vòng đời theo mô hình concurrency của ứng dụng.
