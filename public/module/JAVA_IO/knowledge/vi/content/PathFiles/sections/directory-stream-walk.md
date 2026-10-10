Đọc một thư mục cũng là I/O. Với một cấp con trực tiếp, `Files.list` trả về `Stream<Path>`:

`Stream<Path>` ở đây là **`java.util.stream.Stream`**, tức Stream API để xử lý phần tử `Path`; nó không phải `InputStream`/`OutputStream`. Điểm đặc biệt là stream này được tạo từ một thao tác I/O và giữ tài nguyên thư mục ở bên dưới, nên dù là Stream API nó vẫn có vòng đời phải đóng.

~~~java
try (Stream<Path> entries = Files.list(tempDir)) {
    entries.forEach(System.out::println);
}
~~~

Stream này giữ tài nguyên hệ thống tệp trong quá trình duyệt nên phải đóng. Vì vậy nó nằm trong `try-with-resources`.

Khi muốn duyệt đệ quy:

~~~java
try (Stream<Path> paths = Files.walk(tempDir)) {
    paths
            .filter(Files::isRegularFile)
            .forEach(System.out::println);
}
~~~

`Files.walk` duyệt cả cây thư mục theo độ sâu được yêu cầu. Mặc định nó không đi theo symbolic link. Nếu bật `FileVisitOption.FOLLOW_LINKS`, cần chấp nhận khả năng gặp vòng liên kết và lỗi như `FileSystemLoopException`.

Nếu cần kiểm soát hành vi ở từng thư mục/tệp, xử lý lỗi riêng cho từng nhánh hoặc quyết định có tiếp tục sau lỗi hay không, `Files.walkFileTree` cùng `FileVisitor` phù hợp hơn.

`DirectoryStream<Path>` là một lựa chọn khác để lặp qua từng mục:

~~~java
try (DirectoryStream<Path> stream =
             Files.newDirectoryStream(tempDir, "*.txt")) {
    for (Path entry : stream) {
        System.out.println(entry);
    }
}
~~~

`DirectoryStream` cũng phải đóng. Với cây hoặc thư mục rất lớn, tránh gom mọi `Path` vào một `List` nếu có thể xử lý dần.
