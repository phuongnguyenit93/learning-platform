WebSocket có hai hướng kết thúc đáng phân biệt: **protocol close handshake** và **abort**.

sendClose(code, reason) khởi động việc gửi Close message theo protocol:

~~~java
webSocket.sendClose(
        WebSocket.NORMAL_CLOSURE,
        "done"
);
~~~

Listener.onClose(...) quan sát Close message từ peer và trả CompletionStage để biểu diễn việc xử lý callback.

`sendClose(...)` đóng phía **output** của WebSocket bằng cách gửi Close message; nó không đóng input ngay lập tức. Input tiếp tục mở cho tới khi nhận Close từ peer, `abort()` được gọi hoặc lỗi đóng WebSocket.

`onClose(...)` là callback cuối cùng từ WebSocket đó. Nếu output vẫn còn mở khi nhận Close từ peer, stage mà `onClose` trả về cho cách triển khai biết khi nào có thể đóng output để đáp lại; trả `null` nghĩa là có thể thực hiện ngay.

abort() là đường kết thúc mạnh hơn: đóng kết nối ngay thay vì hoàn tất graceful close handshake. Nó phù hợp cho tình huống ứng dụng không thể hoặc không muốn tiếp tục vòng đời protocol bình thường.

onError(...) báo lỗi phía nhận/vòng đời. Khi lỗi xảy ra, đừng chỉ log rồi giả định cùng WebSocket tiếp tục hoạt động bình thường. Hãy đưa trạng thái kết nối về trạng thái xác định và để chính sách reconnect ở tầng ứng dụng, nếu có, nằm ở layer sở hữu hành vi resilience/realtime.

`onError(...)` là terminal đối với WebSocket đó: đây là listener invocation cuối cùng, và cả input lẫn output đã đóng khi callback bắt đầu. Khác với receive method, callback này không bị `request(n)` kiểm soát.

Reason/status của Close là thông tin protocol; lỗi nghiệp vụ nên có message/schema riêng thay vì overload close code.
