Một WebSocket text hoặc binary message có thể đến qua **nhiều callback fragment**. Tham số last cho biết fragment hiện tại có phải phần cuối của message hay không.

~~~java
StringBuilder current = new StringBuilder();

@Override
public CompletionStage<?> onText(
        WebSocket webSocket,
        CharSequence data,
        boolean last) {

    current.append(data);

    if (last) {
        processMessage(current.toString());
        current.setLength(0);
    }

    webSocket.request(1);
    return null;
}
~~~

Do đó không được giả định:

~~~text
one onText callback = one application message
~~~

Binary callback có cùng ý tưởng nhưng dùng ByteBuffer. Nếu cần ghép fragment, ứng dụng phải quản lý bộ tích lũy/trạng thái cẩn thận và đặt giới hạn để tránh peer gửi message quá lớn làm tăng bộ nhớ không kiểm soát.

Fragmentation ở đây là hành vi của API phía nhận cần biết để viết code đúng. Protocol framing sâu hơn thuộc module WebSocket protocol/realtime.
