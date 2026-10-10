Send-side API trả CompletableFuture<WebSocket>, cho biết thao tác gửi tương ứng đã hoàn thành theo contract của WebSocket API.

~~~java
webSocket.sendText("hello", true)
         .thenRun(() -> System.out.println("sent"));
~~~

Các nhóm send chính:

- sendText(...);
- sendBinary(...);
- sendPing(...);
- sendPong(...);
- sendClose(...).

Boolean last của sendText/sendBinary cho phép ứng dụng chủ động fragment một message khi cần.

Việc send future hoàn tất không đồng nghĩa peer nghiệp vụ đã xử lý message. Nó chỉ phản ánh thao tác gửi phía client. Nếu ứng dụng cần acknowledgement ở tầng nghiệp vụ, phải thiết kế protocol/message riêng.

Giữ distinction:

~~~text
send operation completed
≠ remote business action completed
~~~

Send còn có quy tắc về thao tác đang pending. Nếu bắt đầu text/binary send mới khi một text/binary send trước chưa hoàn tất, hoặc đổi giữa text/binary khi fragmented message trước chưa kết thúc, future có thể complete exceptionally với `IllegalStateException`. Ping/Pong cũng có giới hạn tương tự đối với control-message send đang pending.

Hãy compose các stage gửi hoặc dùng queue/serialization rõ ràng để mỗi lần gửi logic tuân thủ ràng buộc trạng thái:

~~~java
webSocket.sendText("part-1", false)
         .thenCompose(ws -> ws.sendText("part-2", true));
~~~
