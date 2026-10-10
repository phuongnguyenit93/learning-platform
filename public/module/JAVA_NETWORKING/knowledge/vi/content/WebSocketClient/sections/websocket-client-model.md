JDK WebSocket client nằm trong package java.net.http nhưng có data model khác HTTP request/response. Sau opening handshake, client giữ một **kết nối hai chiều, lâu sống hơn** để gửi và nhận message bất đồng bộ.

Mental model:

~~~text
HttpClient
   ↓ newWebSocketBuilder()
opening handshake
   ↓
WebSocket connection
   ↙              ↘
send messages   Listener callbacks
~~~

WebSocket API của JDK là **client API**. Nó không phải WebSocket server framework và cũng không cung cấp giao thức nhắn tin của ứng dụng như STOMP.

Các thao tác của builder/WebSocket theo mô hình non-blocking: buildAsync và các phương thức send trả CompletableFuture/CompletionStage thay vì chờ toàn bộ thao tác mạng kết thúc rồi mới return.

Điều cần giữ từ chương HTTP Client là HttpClient vẫn cung cấp hạ tầng cho WebSocket opening handshake, như proxy, executor và một số cấu hình cấp client. Sau handshake, vòng đời được điều khiển qua WebSocket và Listener.
