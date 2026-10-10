`AsynchronousSocketChannel` và `AsynchronousServerSocketChannel` dùng **completion model**: ứng dụng khởi động thao tác, sau đó nhận kết quả khi thao tác hoàn tất. Đây là mental model khác với Selector, nơi ứng dụng được báo readiness rồi tự gọi I/O.

Hai kiểu nhận completion chính là `Future` và `CompletionHandler`:

```java
try (AsynchronousSocketChannel channel = AsynchronousSocketChannel.open()) {
    channel.connect(new InetSocketAddress("example.com", 8080)).get();

    ByteBuffer buffer = ByteBuffer.allocate(1024);
    Future<Integer> pendingRead = channel.read(buffer);
    int read = pendingRead.get();
}
```

Thao tác vẫn được khởi động theo mô hình asynchronous channel; tuy nhiên nếu bên gọi gọi `Future.get()` ngay như ví dụ trên thì chính bên gọi sẽ chờ kết quả tại điểm đó. `Future` không tự biến phần mã phía sau thành callback/pipeline composition.

Hoặc callback:

```java
channel.read(buffer, state, new CompletionHandler<Integer, State>() {
    @Override
    public void completed(Integer read, State state) {
        // thao tác đã hoàn tất; xử lý kết quả và khởi động bước tiếp theo
    }

    @Override
    public void failed(Throwable error, State state) {
        // xử lý lỗi và vòng đời tài nguyên
    }
});
```

Asynchronous API không loại bỏ partial I/O: kết quả completion vẫn là số byte thực sự đọc/ghi. Buffer cũng không an toàn để code khác thay đổi khi thao tác bất đồng bộ đang sử dụng nó.

Channel loại này có giới hạn về thao tác đang chờ. Ví dụ, bắt đầu một lần đọc mới khi lần đọc trước chưa hoàn tất có thể gây `ReadPendingException`; tương tự có `WritePendingException`, và asynchronous server chỉ cho phép một `accept` đang chờ tại một thời điểm (`AcceptPendingException`). Thiết kế state machine vẫn cần trách nhiệm sở hữu rõ ràng.

Các channel có thể thuộc một `AsynchronousChannelGroup`, nơi cách triển khai quản lý tài nguyên thực thi cho completion. Đây là cơ chế completion của networking; thiết kế executor/concurrency sâu hơn thuộc module Concurrency.
