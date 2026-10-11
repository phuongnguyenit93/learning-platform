`Selector` là một **multiplexor của `SelectableChannel`**. Một thread có thể chờ readiness của nhiều channel thay vì block riêng trên từng channel. Selector không thực thi logic nghiệp vụ và không phải thread pool.

Channel phải ở non-blocking mode trước khi đăng ký với selector:

```java
try (Selector selector = Selector.open();
     ServerSocketChannel server = ServerSocketChannel.open()) {

    server.bind(new InetSocketAddress(8080));
    server.configureBlocking(false);
    server.register(selector, SelectionKey.OP_ACCEPT);

    while (true) {
        selector.select();

        Iterator<SelectionKey> it = selector.selectedKeys().iterator();
        while (it.hasNext()) {
            SelectionKey key = it.next();
            it.remove();

            if (key.isAcceptable()) {
                // accept kết nối và đăng ký channel mới nếu cần
            }
        }
    }
}
```

Readiness trả lời câu hỏi kiểu "thao tác này **có vẻ có thể tiến triển ngay**", không hứa rằng thao tác kế tiếp sẽ hoàn tất toàn bộ việc đọc/ghi. Tài liệu `SelectionKey` gọi ready set là một gợi ý; trạng thái có thể thay đổi sau khi lần selection hoàn tất hoặc sau một thao tác I/O.

Các thao tác phổ biến là `OP_ACCEPT`, `OP_CONNECT`, `OP_READ` và `OP_WRITE`, tùy loại channel. `select()` có thể block tới khi có readiness, `selectNow()` kiểm tra mà không block, còn `wakeup()` giúp thread khác đánh thức selector đang chờ để event loop xử lý thay đổi đăng ký/trạng thái.

Khi dùng `selectedKeys()`, ứng dụng phải remove/clear các key đã xử lý. Selector thêm key ready vào selected-key set, nhưng không tự xóa từng key chỉ vì ứng dụng đã xử lý nó.
