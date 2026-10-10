Điểm bắt đầu là **ý nghĩa của dữ liệu**, không phải API nào nghe hiện đại hơn.

| Bài toán | Mô hình/API thường phù hợp |
| --- | --- |
| Byte nhị phân tuần tự | `InputStream` / `OutputStream` |
| Giá trị nguyên thủy nhị phân theo trường/lược đồ (schema) cố định | `DataInput` / `DataOutput`, thường qua `DataInputStream` / `DataOutputStream` |
| Văn bản theo ký tự | `Reader` / `Writer` |
| Thao tác hệ thống tệp ở mức đường dẫn | `Path` + `Files` |
| Cần hiểu khả năng, vùng lưu trữ và provider của đường dẫn | `Path.getFileSystem()` + `FileSystem` / `FileStore` |
| Theo dõi thay đổi thư mục | `WatchService` |
| Tệp nhỏ, **có giới hạn kích thước rõ ràng**, cần tiện ích đọc/ghi một lần | `Files.readString`, `writeString`, `readAllBytes`... |
| I/O byte cần mô hình Buffer/Channel | `Channel` + `ByteBuffer` |
| Tệp cần vị trí, truy cập ngẫu nhiên, truyền trực tiếp, khóa hoặc ánh xạ | `FileChannel` |
| Tệp cần hoàn tất bất đồng bộ theo vị trí | `AsynchronousFileChannel` |
| Tài nguyên đóng gói trên classpath/module path | `Class.getResource(...)`, `Class.getResourceAsStream(...)`, `ClassLoader.getResource(...)`, `ClassLoader.getResourceAsStream(...)` |

Ví dụ, sao chép ảnh không nên đi qua `Reader` vì ảnh là byte nhị phân:

~~~java
try (
        InputStream in = Files.newInputStream(source);
        OutputStream out = Files.newOutputStream(target)
) {
    in.transferTo(out);
}
~~~

Đọc văn bản UTF-8 theo từng dòng phù hợp với `BufferedReader`:

~~~java
try (BufferedReader reader =
             Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
    String line;

    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}
~~~

Khi chỉ cần thao tác ở mức hệ thống tệp, `Files` thường rõ hơn việc tự dựng stream:

~~~java
Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
~~~

Khi cần đọc tại offset cụ thể trong tệp:

~~~java
try (FileChannel channel =
             FileChannel.open(path, StandardOpenOption.READ)) {
    ByteBuffer header = ByteBuffer.allocate(16);
    channel.read(header, 128);
}
~~~

Ví dụ này chỉ minh họa **đọc tại offset**. Nếu quy ước yêu cầu đủ 16 byte header thì vẫn phải lặp theo số byte thực tế đọc được; trước khi đọc dữ liệu từ `header` bằng `get(...)`, cần `flip()` để chuyển buffer sang trạng thái đọc.

Quy tắc thực dụng:

~~~text
chọn mức trừu tượng theo bài toán
→ giữ giải pháp nhỏ và rõ
→ chỉ xuống tầng thấp hơn khi cần khả năng của tầng đó
~~~

Channel không phải “phiên bản nâng cấp luôn tốt hơn stream”. Reader/Writer cũng không phải “stream cho mọi dữ liệu”. Mỗi mức trừu tượng trả lời một loại câu hỏi I/O khác nhau.

Tương tự, `DataInputStream` không thay thế `ObjectInputStream`: nó đọc **giá trị nguyên thủy theo định dạng mà hai bên đã thống nhất**, còn tuần tự hóa đối tượng mang theo quy ước riêng về đồ thị đối tượng và phiên bản. `AsynchronousFileChannel` cũng không “nhanh hơn mặc định” `FileChannel`; nó thay đổi cách hoàn tất được tổ chức và chỉ hữu ích khi tải công việc/kiến trúc thực sự cần mô hình bất đồng bộ.

Với hệ thống tệp, đừng mặc định mọi `Path` đều là cùng một loại đường dẫn của hệ điều hành. Nếu mã phụ thuộc quyền POSIX, di chuyển nguyên tử (atomic move), `WatchService`, `toFile()` hoặc một khả năng cụ thể, hãy nhớ `Path` thuộc về một `FileSystem`/provider và kiểm tra khả năng đó thay vì suy luận từ máy phát triển.

**Tài nguyên trên classpath hoặc module path** thuộc một không gian tên khác với hệ thống tệp. `Class.getResourceAsStream(...)` hoặc `ClassLoader.getResourceAsStream(...)` có thể đọc nội dung nằm bên trong JAR hoặc một nguồn khác do class loader quản lý, vì vậy không được giả định tài nguyên tìm thấy theo cách này luôn có thể chuyển thành `File` hoặc `Path` cục bộ. Khi API trả về stream, các quy tắc vòng đời stream thông thường vẫn áp dụng. Quy tắc tra cứu tương đối/gốc, delegation và liệt kê tài nguyên thuộc module **ClassLoader**; ranh giới cần nhớ trong I/O là **tài nguyên classpath không đồng nghĩa với đường dẫn hệ thống tệp**.
