`try-with-resources` giải quyết **cách đóng**, nhưng trước đó mã phải trả lời **ai có trách nhiệm đóng**.

Một quy ước thiết kế hữu ích:

~~~text
mã tạo/mở tài nguyên
→ mặc định mã đó sở hữu
→ mã đó phải đóng

mã chỉ nhận tài nguyên do bên gọi truyền vào
→ không tự suy đoán quyền sở hữu
→ quy ước phải nói rõ bên nào đóng
~~~

Ví dụ phương thức tự mở tệp:

~~~java
static long countBytes(Path path) throws IOException {
    try (InputStream in = Files.newInputStream(path)) {
        long count = 0;
        byte[] buffer = new byte[8192];
        int read;

        while ((read = in.read(buffer)) != -1) {
            count += read;
        }

        return count;
    }
}
~~~

Phương thức này tạo `InputStream` nên quyền sở hữu rõ ràng: chính phương thức đóng nó.

Ngược lại:

~~~java
static void writeMessage(
        OutputStream out,
        String message
) throws IOException {
    out.write(message.getBytes(StandardCharsets.UTF_8));
}
~~~

`out` đến từ bên gọi. Nếu phương thức tự đóng mà quy ước không nói trước, bên gọi có thể mất quyền ghi tiếp vào socket/tệp/response stream. API nên quyết định rõ một trong hai kiểu:

~~~text
tài nguyên mượn (borrowed resource)
→ phương thức dùng nhưng không đóng

tài nguyên được chuyển quyền sở hữu
→ phương thức nhận quyền sở hữu và sẽ đóng
~~~

Quyền sở hữu cũng áp dụng cho các API dễ bị bỏ sót. `Files.list`, `Files.walk`, `Files.find` và `Files.lines` trả về `java.util.stream.Stream` nhưng stream đó gắn với tài nguyên I/O bên dưới; mã tiêu thụ nó phải bảo đảm `close()`, thường bằng `try-with-resources`. “Là Stream API” không có nghĩa “không còn vòng đời tài nguyên”.

Một đối tượng “có thể được GC” không đồng nghĩa tài nguyên đã được giải phóng đúng thời điểm. Với máy chủ chạy lâu, rò rỉ file descriptor có thể tích lũy cho tới khi tiến trình không mở thêm tệp/socket được nữa.
