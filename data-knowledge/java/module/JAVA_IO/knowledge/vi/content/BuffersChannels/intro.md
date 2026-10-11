# Buffer và Channel trong NIO

Luồng truyền thống tạo cảm giác “đọc byte tiếp theo” hoặc “ghi byte tiếp theo”. **NIO (New I/O)** là nhóm API I/O của Java, chủ yếu trong `java.nio` và `java.nio.channels`, bổ sung một mô hình khác: dữ liệu được đặt trong một `Buffer` rồi được vận chuyển qua một `Channel`.

Trong mô hình này, `Buffer` là **vùng trung gian trong bộ nhớ** nơi chương trình đặt dữ liệu cần ghi hoặc nhận dữ liệu vừa đọc. `Channel` là **đường vận chuyển/kết nối I/O** đưa dữ liệu giữa buffer và nguồn hoặc đích như tệp hay socket. Việc tách “nơi dữ liệu đang nằm” khỏi “đường dữ liệu di chuyển” giúp mã nhìn rõ vùng dữ liệu nào đang sẵn sàng đọc/ghi, xử lý các lần truyền chỉ tiến triển một phần và dùng các khả năng riêng của từng loại channel.

`Buffer` của NIO cũng khác với **dùng bộ đệm (buffering)** ở chương Buffered I/O. Buffering là kỹ thuật gom nhiều thao tác I/O nhỏ thành các lần truy cập lớn hơn để giảm chi phí; còn một NIO `Buffer` là đối tượng dữ liệu có trạng thái như `position`, `limit` và `capacity` mà chương trình thao tác trực tiếp.

~~~text
nguồn dữ liệu
    ↓
 Channel
    ↓ read(...)
 Buffer
    ↓
chương trình xử lý
~~~

Ở chiều ghi, hướng di chuyển đảo lại:

~~~text
chương trình đặt dữ liệu vào Buffer
    ↓
 Buffer
    ↓ write(...)
 Channel
    ↓
đích dữ liệu
~~~

Phần khó nhất với người mới thường không phải tên lớp mà là **trạng thái của Buffer**. Hiểu đúng `position`, `limit` và `capacity` sẽ làm cho `flip`, `clear` và `compact` trở nên dễ hiểu thay vì phải học thuộc.
