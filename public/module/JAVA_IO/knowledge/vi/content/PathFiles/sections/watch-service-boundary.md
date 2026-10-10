Đôi khi ứng dụng không chỉ muốn “đọc trạng thái hiện tại của thư mục” mà còn muốn biết **sau thời điểm đăng ký có mục nào được tạo, sửa hoặc xóa hay không**. `WatchService` là mức trừu tượng NIO.2 để nhận các sự kiện thay đổi hệ thống tệp kiểu này.

Mô hình:

```text
thư mục
   ↓ đăng ký
WatchService
   ↓ hệ thống tệp/provider báo thay đổi
WatchKey được báo hiệu
   ↓ pollEvents()
WatchEvent: tạo / sửa / xóa / tràn sự kiện
   ↓ xử lý xong
đặt lại WatchKey bằng reset()
```

Tạo đối tượng theo dõi và đăng ký một thư mục:

```java
try (WatchService watcher = tempDir.getFileSystem().newWatchService()) {
    tempDir.register(
            watcher,
            StandardWatchEventKinds.ENTRY_CREATE,
            StandardWatchEventKinds.ENTRY_MODIFY,
            StandardWatchEventKinds.ENTRY_DELETE);

    WatchKey key = watcher.take(); // chặn cho tới khi có WatchKey được báo hiệu

    for (WatchEvent<?> event : key.pollEvents()) {
        if (event.kind() == StandardWatchEventKinds.OVERFLOW) {
            System.out.println("Có thể đã mất một hoặc nhiều sự kiện");
            continue;
        }

        Path relative = (Path) event.context();
        Path changed = tempDir.resolve(relative);
        System.out.println(event.kind().name() + ": " + changed);
    }

    boolean stillValid = key.reset();
    if (!stillValid) {
        System.out.println("Thư mục không còn được theo dõi hợp lệ");
    }
}
```

`take()` **chặn (block)** cho tới khi có một `WatchKey` sẵn sàng. `poll()` không chờ và trả `null` nếu chưa có `WatchKey`; phiên bản nạp chồng `poll(timeout, unit)` cho phép chờ có giới hạn. Đây là các cách phối hợp khác nhau, không phải sự kiện nào “chính xác hơn” sự kiện nào.

`WatchKey` đại diện cho một đăng ký đã được báo hiệu. Sau khi lấy các sự kiện bằng `pollEvents()`, mã phải gọi `reset()` để `WatchKey` có thể quay lại trạng thái chờ và được báo hiệu lần nữa. Nếu `reset()` trả `false`, đăng ký không còn hợp lệ, ví dụ thư mục đã bị xóa hoặc `WatchKey` bị hủy.

`WatchEvent.context()` cho sự kiện thư mục thường là đường dẫn **tương đối với thư mục đã đăng ký**, vì vậy mã ghép nó với thư mục gốc bằng `resolve(...)` khi cần đường dẫn đầy đủ. Một `WatchService` cũng **không tự theo dõi đệ quy**: đăng ký `root` không đồng nghĩa mọi thư mục con hiện tại/tương lai đều được theo dõi; bài toán đệ quy cần quản lý đăng ký cho từng thư mục phù hợp.

`OVERFLOW` là tín hiệu quan trọng: provider báo rằng sự kiện có thể đã bị mất hoặc bỏ qua. Nếu yêu cầu tính đúng đắn đòi hỏi trạng thái cuối phải chính xác, ứng dụng nên **quét lại hệ thống tệp** thay vì giả định danh sách sự kiện nhận được là lịch sử đầy đủ.

`WatchService` là mức trừu tượng trên hệ thống tệp/provider nên chi tiết quan sát **không hoàn toàn giống nhau giữa các nền tảng**. Sự kiện có thể được gộp, số lần `ENTRY_MODIFY` có thể khác nhau, đổi tên có thể xuất hiện như xóa + tạo, độ trễ khác nhau, và hệ thống tệp mạng/từ xa có thể có hành vi riêng. Hãy dùng cơ chế theo dõi này như thông báo “hệ thống tệp có thay đổi cần xử lý”, không như một nhật ký giao dịch tuyệt đối.

`WatchService` là tài nguyên phải đóng. Đóng nó giải phóng đăng ký/tài nguyên bên dưới; thread đang chờ trên `WatchService` có thể nhận `ClosedWatchServiceException`. Quyền sở hữu `WatchService` vì vậy cần rõ giống các tài nguyên I/O khác.

Đến đây `Path` cho ta địa chỉ và `Files` cho ta thao tác. Chương tiếp theo thay đổi góc nhìn: NIO tách **nơi chứa dữ liệu đang xử lý** (`Buffer`) khỏi **đường vận chuyển dữ liệu** (`Channel`).
