Mỗi cặp channel/selector có một `SelectionKey`. Lần đăng ký đầu tiên tạo key đó; nếu cùng channel đăng ký lại với cùng selector, API trả lại key hiện có và cập nhật interest set. Nếu dùng overload ba tham số, attachment hiện tại chỉ bị thay khi truyền attachment khác `null`. Cùng channel đăng ký với selector khác sẽ có key riêng. Vì vậy mỗi key nối một **channel**, một **selector** và trạng thái selection của đúng cặp đó.

Hai tập thao tác cần phân biệt:

- **interest set**: những thao tác ứng dụng muốn selector theo dõi ở lần selection tiếp theo, đọc/đổi qua `interestOps(...)`;
- **ready set**: những thao tác selector vừa phát hiện là ready, đọc qua `readyOps()` hoặc helper như `isReadable()`.

Ứng dụng thường attach trạng thái kết nối vào key:

```java
SelectionKey key = channel.register(selector, SelectionKey.OP_READ);
key.attach(new ConnectionState());
```

Khi có dữ liệu gửi ra, event loop có thể thêm `OP_WRITE`; sau khi buffer đang chờ đã gửi hết, bỏ `OP_WRITE` khỏi interest set. Nếu luôn quan tâm `OP_WRITE`, socket thường xuyên writable có thể khiến selector liên tục đánh thức và tạo busy loop.

Kết nối non-blocking cũng dùng state machine. `SocketChannel.connect(remote)` có thể trả `false`; channel sau đó được theo dõi với `OP_CONNECT`, và khi connectable thì gọi `finishConnect()` để hoàn tất hoặc nhận lỗi kết nối.

`cancel()` làm key không còn hợp lệ, nhưng việc hủy đăng ký thực tế được selector xử lý ở lần selection kế tiếp. Đóng channel hoặc selector cũng làm key mất hiệu lực. Vì thế event loop phải kiểm tra tính hợp lệ khi có khả năng thread khác đóng/cancel tài nguyên.
