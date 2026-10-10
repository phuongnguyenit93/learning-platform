`Channel` là đầu nối tới nguồn hoặc đích I/O. Với `ReadableByteChannel`, đọc nghĩa là đưa byte **từ channel vào buffer**:

~~~java
int count = channel.read(buffer);
~~~

Nếu đọc được `count > 0` byte, `position` của buffer tăng đúng số byte đó. Tùy loại channel và mode, một lần đọc có thể trả số byte nhỏ hơn vùng trống còn lại; với channel có khái niệm EOF, `-1` biểu thị đã tới cuối nguồn.

`WritableByteChannel` làm chiều ngược lại:

~~~java
int count = channel.write(buffer);
~~~

Channel lấy byte trong vùng:

~~~text
[position, limit)
~~~

và `position` tăng theo số byte thực tế đã ghi.

Một vòng sao chép bằng **channel dạng blocking** (ví dụ `FileChannel`) cho thấy cả hai vai trò:

~~~java
ByteBuffer buffer = ByteBuffer.allocate(8 * 1024);

while (source.read(buffer) != -1) {
    buffer.flip();

    while (buffer.hasRemaining()) {
        target.write(buffer);
    }

    buffer.clear();
}
~~~

Vòng `while (buffer.hasRemaining())` bên trong rất quan trọng. Một lần `write` không nên được hiểu là luôn ghi hết phần còn lại; giá trị trả về mới cho biết số byte thực tế đã chuyển.

Vòng lặp trên cố ý dùng mô hình blocking. Với channel dạng non-blocking, `read()` hoặc `write()` có thể trả `0` khi hiện tại chưa tiến triển được, nên thuật toán còn phải tích hợp cơ chế báo sẵn sàng/vòng lặp sự kiện thay vì quay vòng liên tục theo mẫu này.

So với stream:

~~~text
Stream
→ abstraction tập trung vào dòng byte/char tuần tự

Channel + Buffer
→ tách đường vận chuyển khỏi vùng dữ liệu
→ trạng thái buffer trở thành phần rõ ràng của thuật toán
~~~

NIO không tự động nhanh hơn chỉ vì dùng `Channel`. Giá trị của mô hình này nằm ở khả năng kiểm soát buffer, truy cập ngẫu nhiên ở một số channel, non-blocking ở nhóm channel phù hợp và các thao tác đặc thù như transfer.
