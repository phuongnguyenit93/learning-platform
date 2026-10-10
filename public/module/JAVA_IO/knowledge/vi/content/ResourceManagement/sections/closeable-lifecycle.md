Java biểu diễn khả năng “có thể đóng” bằng `AutoCloseable`:

~~~java
public interface AutoCloseable {
    void close() throws Exception;
}
~~~

`Closeable` là dạng chuyên biệt thường gặp trong I/O. Nó kế thừa `AutoCloseable` và quy ước `close()` của nó dùng `IOException`.

Các kiểu quen thuộc như `InputStream`, `OutputStream`, `Reader`, `Writer`, `FileChannel`, `DirectoryStream` và `FileLock` đều có vòng đời cần quan tâm theo API của chúng.

Mô hình cần nhớ:

~~~text
new/open
→ tài nguyên bên ngoài được tạo hoặc thu nhận

đối tượng Java còn dùng được
→ tài nguyên bên ngoài vẫn có thể đang được giữ

close
→ kết thúc quyền sử dụng và giải phóng theo quy ước
~~~

Sau khi đã đóng, đừng tiếp tục sử dụng tài nguyên trừ khi API nói rõ thao tác nào còn hợp lệ. Ví dụ phần lớn thao tác trên stream/channel đã đóng sẽ thất bại.

Với `Closeable`, `close()` được thiết kế để có thể gọi lặp mà không gây hiệu ứng mới. Tuy vậy, điều này không phải quy tắc chung cho mọi phần triển khai của `AutoCloseable`. Thiết kế đúng vẫn là có **một bên sở hữu rõ ràng** đóng tài nguyên đúng một lần trong vòng đời bình thường.
