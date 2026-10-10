Luồng (stream) thường dẫn ta tới cách đọc tuần tự từ đầu đến cuối. `FileChannel` có một **vị trí tệp (file position)**:

~~~java
long current = channel.position();
channel.position(10);
~~~

`read(buffer)` đọc từ `position` hiện tại rồi tăng `position` theo số byte đã đọc. `write(buffer)` ghi từ `position` hiện tại rồi cũng tăng `position` theo số byte thực tế đã ghi.

Ví dụ ghi một đoạn dữ liệu UTF-8 rồi quay lại đầu:

~~~java
ByteBuffer data =
        StandardCharsets.UTF_8.encode("Hello FileChannel");

while (data.hasRemaining()) {
    channel.write(data);
}

channel.position(0);
~~~

Truy cập ngẫu nhiên trở nên rõ hơn với thao tác đọc/ghi theo vị trí:

~~~java
ByteBuffer part = ByteBuffer.allocate(5);
int read = channel.read(part, 6);
~~~

Phiên bản nạp chồng (overload) `read(buffer, position)` đọc từ độ lệch chỉ định nhưng **không thay đổi vị trí tệp chung của channel**. `write(buffer, position)` có cùng đặc điểm với channel ghi thông thường. Không được dựa vào ngữ nghĩa ghi theo vị trí khi channel được mở với `APPEND`: JDK không quy định kết quả của thao tác ghi tại một vị trí chỉ định trong chế độ append.

Khi thao tác ghi theo vị trí có thể chỉ ghi một phần buffer, độ lệch của lần sau phải tăng theo số byte đã ghi:

~~~java
ByteBuffer patch = StandardCharsets.UTF_8.encode("JAVA");
long offset = 0;

while (patch.hasRemaining()) {
    int written = channel.write(patch, offset);
    if (written <= 0) {
        throw new IOException("Positional write made no progress");
    }
    offset += written;
}
~~~

Ngoài `position`, `FileChannel` còn cho biết kích thước và có thể cắt ngắn tệp bằng `truncate`:

~~~java
long size = channel.size();
channel.truncate(100);
~~~

`truncate(100)` làm tệp ngắn lại nếu tệp đang lớn hơn 100 byte. Nó không tự mở rộng tệp nhỏ thành 100 byte.

Khi ứng dụng có yêu cầu về **độ bền dữ liệu (durability)** — mức bảo đảm rằng dữ liệu đã ghi vẫn còn sau sự cố như tiến trình/JVM dừng hoặc máy mất điện, tùy khả năng của hệ thống lưu trữ — `force(...)` có thể yêu cầu các thay đổi được đẩy xuống thiết bị lưu trữ:

~~~java
channel.force(true);
~~~

Tham số boolean cho biết Java có cần yêu cầu đẩy cả siêu dữ liệu (metadata) hay không: `force(false)` tập trung vào thay đổi nội dung tệp, còn `force(true)` yêu cầu thêm các cập nhật metadata cần thiết. Đây là thao tác có chi phí và bảo đảm cuối cùng vẫn phụ thuộc **chuỗi tầng lưu trữ (storage stack)**, tức các lớp từ JVM, hệ điều hành, hệ thống tệp, bộ nhớ đệm cho tới thiết bị lưu trữ vật lý. Không nên gọi sau từng lần ghi nhỏ chỉ vì muốn “an toàn hơn”; yêu cầu về độ bền dữ liệu phải được xác định rõ.

`FileChannel.force(...)` cũng không thay thế `MappedByteBuffer.force()`. Nếu dữ liệu được sửa thông qua buffer ánh xạ bộ nhớ, chính `MappedByteBuffer` có `force()` để yêu cầu đẩy thay đổi của vùng ánh xạ xuống tầng lưu trữ.

`RandomAccessFile` là API `java.io` cũ hơn cho cùng nhóm bài toán truy cập tệp tại vị trí tùy ý. Nó có một con trỏ tệp (file pointer) có thể di chuyển bằng `seek(...)` và còn triển khai `DataInput`/`DataOutput`, nên thuận tiện trong mã cũ hoặc khi cần đọc/ghi giá trị nguyên thủy theo mô hình đó. `FileChannel` phù hợp hơn khi bài toán cần `ByteBuffer`, thao tác theo vị trí không làm đổi vị trí dùng chung, truyền trực tiếp, khóa hoặc ánh xạ. `RandomAccessFile.getChannel()` trả về channel gắn với cùng tệp và vị trí tệp của hai API liên kết với nhau, vì vậy trộn cả hai mức trừu tượng trong cùng luồng xử lý cần đặc biệt cẩn thận.
