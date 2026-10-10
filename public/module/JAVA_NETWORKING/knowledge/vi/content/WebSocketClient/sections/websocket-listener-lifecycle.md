WebSocket.Listener là contract phía nhận của JDK WebSocket client. Các callback chính phản ánh vòng đời:

~~~text
onOpen
  ↓
onText / onBinary / onPing / onPong
  ↓
onClose

nhánh lỗi
→ onError
~~~

Một listener đơn giản:

~~~java
WebSocket.Listener listener = new WebSocket.Listener() {
    @Override
    public void onOpen(WebSocket webSocket) {
        webSocket.request(1);
    }

    @Override
    public CompletionStage<?> onText(
            WebSocket webSocket,
            CharSequence data,
            boolean last) {

        System.out.println(data);
        webSocket.request(1);
        return null;
    }
};
~~~

JDK sắp xếp các callback nhận của cùng một WebSocket theo thứ tự; ứng dụng không nên giả định cùng listener callback được gọi song song tùy ý rồi tự tạo race condition không cần thiết.

Ranh giới của tính tuần tự này cần hiểu chính xác: callback kế tiếp chỉ bắt đầu sau khi **method callback trước return**. Với `onText`, `onBinary`, `onPing` và `onPong`, `CompletionStage` được trả về chủ yếu cho WebSocket biết khi nào dữ liệu callback có thể được thu hồi; việc stage hoàn tất **không** làm tăng demand counter và cũng không phải điều kiện bắt buộc để một callback khác đã được request bắt đầu.

Callback là nơi xử lý sự kiện mạng, không phải nơi phù hợp để chạy business logic blocking dài. Nếu handoff xử lý nặng sang executor khác rồi callback return ngay, callback sau có thể bắt đầu khi demand cho phép, nên trạng thái ứng dụng lúc này có thể bị xử lý đồng thời. Phải quản lý rõ cả demand lẫn trách nhiệm sở hữu việc xử lý thay vì giả định `CompletionStage` tự serialize business work.
