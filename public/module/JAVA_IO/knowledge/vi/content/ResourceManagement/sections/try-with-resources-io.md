Tự viết `close()` thủ công cho mọi đường chạy rất dễ sai:

~~~java
InputStream in = Files.newInputStream(path);
byte[] data = in.readAllBytes();
in.close();
~~~

Nếu `readAllBytes()` ném ngoại lệ, dòng `close()` không chạy. `try-with-resources` gắn việc đóng tài nguyên vào cấu trúc ngôn ngữ:

~~~java
try (InputStream in = Files.newInputStream(path)) {
    byte[] data = in.readAllBytes();
    System.out.println(data.length);
}
~~~

Khi rời khối lệnh, Java gọi `close()` dù phần xử lý hoàn tất bình thường hay ném ngoại lệ.

Nhiều tài nguyên có thể được khai báo cùng lúc:

~~~java
try (
        InputStream in = Files.newInputStream(source);
        OutputStream out = Files.newOutputStream(target)
) {
    in.transferTo(out);
}
~~~

Chúng được đóng theo thứ tự ngược với thứ tự khai báo: `out` trước, rồi `in`. Quy tắc này đặc biệt hữu ích khi tài nguyên khai báo sau phụ thuộc vào tài nguyên khai báo trước.

Nếu phần xử lý ném ngoại lệ và `close()` cũng ném ngoại lệ, Java giữ ngoại lệ chính và gắn lỗi đóng tài nguyên dưới dạng **ngoại lệ bị nén (suppressed exception)**. Biết quy tắc này giúp đọc log đúng; cơ chế ngoại lệ và ngoại lệ bị nén đầy đủ thuộc module Exception.

Từ Java 9, một biến `final` hoặc effectively final đã tồn tại cũng có thể được dùng trong phần khai báo tài nguyên:

~~~java
InputStream in = Files.newInputStream(path);

try (in) {
    System.out.println(in.read());
}
~~~

Với I/O, `try-with-resources` nên là lựa chọn mặc định khi phạm vi sở hữu tài nguyên có thể biểu diễn rõ bằng một khối lệnh.
