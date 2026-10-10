Các chương trước đã dùng các lớp bọc theo kiểu decorator:

~~~text
FileInputStream
→ InputStreamReader
→ BufferedReader
~~~

Các lớp bọc (wrapper) I/O chuẩn thường **lan truyền lời gọi `close()` xuống đối tượng được bọc**, tức lớp bên dưới mà lớp bọc chuyển tiếp thao tác đọc/ghi tới, theo quy ước của API. Quy tắc lan truyền khi đóng này tách biệt với quyền sở hữu ở mức ứng dụng: mã vẫn phải xác định ngay từ đầu mình có trách nhiệm đóng tài nguyên được bọc hay không.

~~~java
try (BufferedReader reader = Files.newBufferedReader(
        path,
        StandardCharsets.UTF_8
)) {
    System.out.println(reader.readLine());
}
~~~

Với một chuỗi tạo thủ công:

~~~java
InputStream file = Files.newInputStream(path);
Reader decoder =
        new InputStreamReader(file, StandardCharsets.UTF_8);
BufferedReader buffered = new BufferedReader(decoder);
~~~

Đóng `buffered` sẽ đóng `decoder`, rồi tiếp tục đóng đối tượng bên dưới theo quy ước của các lớp bọc chuẩn. Khi quy ước sở hữu của ứng dụng xác định phạm vi hiện tại sở hữu toàn bộ chuỗi, thường chỉ cần đưa lớp bọc ngoài cùng vào `try-with-resources`.

Ở chiều ghi còn có một lý do khác: lớp bọc có thể giữ dữ liệu chưa được đẩy xuống lớp dưới. `close()` của các lớp bọc `Writer`/`OutputStream` chuẩn thường hoàn tất phần `flush` cần thiết rồi đóng đối tượng được bọc:

~~~java
try (BufferedWriter writer = Files.newBufferedWriter(
        path,
        StandardCharsets.UTF_8
)) {
    writer.write("hello");
}
~~~

Không nên dựa vào việc “tiến trình sắp kết thúc” để thay cho `close()`.

Điểm cần cẩn thận xuất hiện khi lớp bọc bao quanh một tài nguyên mà phương thức **không sở hữu**. Nếu phương thức đóng lớp bọc, lớp bọc thường sẽ đóng luôn đối tượng do bên gọi truyền vào. Đây không phải lỗi của lớp bọc; vấn đề là quy ước sở hữu chưa rõ.

Sau khi đã kiểm soát được vòng đời, ta có thể xem một tính năng I/O khác có ranh giới lớn hơn nhiều: cơ chế tuần tự hóa đối tượng nguyên bản của Java (`Java Object Serialization`). Nó biến cả đồ thị đối tượng thành byte và vì thế kéo theo cả vấn đề tương thích lẫn bảo mật.
