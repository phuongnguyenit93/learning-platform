JDK WebSocket client không tự đẩy vô hạn receive callback cho listener. Ứng dụng thể hiện **demand** bằng WebSocket.request(n).

Ví dụ:

~~~java
@Override
public void onOpen(WebSocket webSocket) {
    webSocket.request(1);
}

@Override
public CompletionStage<?> onText(
        WebSocket webSocket,
        CharSequence data,
        boolean last) {

    handle(data);
    webSocket.request(1);
    return null;
}
~~~

request(1) nghĩa là cho phép thêm một lần gọi nhận, không phải “đọc đúng một thông điệp ứng dụng hoàn chỉnh”. Counter này áp dụng cho `onText`, `onBinary`, `onPing`, `onPong` **và `onClose`**. `onOpen` và `onError` không phải receive method bị demand kiểm soát; đặc biệt `onError` có thể được gọi bất kể counter hiện tại.

Text/binary message có thể bị fragment thành nhiều callback, vì vậy demand phải được hiểu cùng fragmentation. `CompletionStage` trả về từ receive callback là cơ chế riêng với counter này: chính `request(n)` mới tăng demand.

Demand control giúp listener không bị gọi nhanh hơn mức ứng dụng chủ động yêu cầu. Tuy nhiên đây không biến WebSocket thành một reactive-streams API hoàn chỉnh; ngữ nghĩa của Flow/Reactive Streams thuộc module khác.

Sai lầm phổ biến là quên request thêm sau onOpen hoặc callback, khiến kết nối vẫn tồn tại nhưng ứng dụng không nhận thêm sự kiện như mong đợi.
