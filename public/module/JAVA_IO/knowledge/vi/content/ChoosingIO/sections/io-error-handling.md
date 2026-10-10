I/O giao tiếp với hệ thống bên ngoài nên lỗi là một phần bình thường của hoạt động: tệp không tồn tại, không đủ quyền truy cập, ổ đĩa đầy, kết nối đóng, đường dẫn bị thay đổi hoặc hệ thống tệp không hỗ trợ một tùy chọn nào đó.

`IOException` và các kiểu con như `NoSuchFileException`, `AccessDeniedException` giúp mã phân biệt nguyên nhân khi thực sự cần cách xử lý khác nhau:

~~~java
try {
    return Files.readString(path, StandardCharsets.UTF_8);
} catch (NoSuchFileException e) {
    // Chính sách của ứng dụng có thể là dùng cấu hình mặc định,
    // báo lỗi rõ ràng cho người dùng, hoặc ném lại ngoại lệ.
    throw e;
}
~~~

Điểm quan trọng là **không tự động biến “tệp không tồn tại” thành chuỗi rỗng**, vì như vậy “không có tệp” và “tệp tồn tại nhưng rỗng” trở thành cùng một kết quả. Chỉ bắt ngoại lệ khi mã có quyết định hợp lý cho lỗi đó. Việc bắt `IOException` rồi bỏ qua thường biến lỗi I/O thành dữ liệu thiếu hoặc trạng thái khó chẩn đoán.

Một nguyên tắc quan trọng khác là **lỗi không có nghĩa “không có gì đã xảy ra”**. I/O có thể tiến triển một phần:

~~~text
write 100 KB
→ 40 KB đã được ghi
→ lỗi xảy ra
→ đích có thể đã thay đổi
~~~

API Channel thể hiện điều này rất rõ qua số byte trả về. Ví dụ dưới đây giả sử đây là **channel dạng blocking**; nếu là channel dạng non-blocking, `write()` có thể trả `0` và mã cần cơ chế chờ trạng thái sẵn sàng thay vì quay vòng liên tục:

~~~java
while (buffer.hasRemaining()) {
    int written = channel.write(buffer);
    if (written <= 0) {
        throw new IOException("Blocking write made no progress");
    }
    // position tăng theo số byte thực tế đã ghi
}
~~~

Sao chép/di chuyển/xóa cũng có quy ước riêng của hệ thống tệp. Nếu ứng dụng cần công bố một tệp theo kiểu “người đọc thấy phiên bản cũ hoặc phiên bản mới”, có thể ghi vào tệp tạm rồi dùng atomic move khi hệ thống tệp hỗ trợ. Nhưng `ATOMIC_MOVE` cũng có giới hạn hỗ trợ: nếu không thực hiện được nguyên tử thì có `AtomicMoveNotSupportedException`; khi đích đã tồn tại, thay thế hay báo lỗi còn có thể phụ thuộc phần triển khai. Vì vậy chính sách công bố phải nói rõ ứng dụng chấp nhận hành vi nào thay vì giả định `REPLACE_EXISTING` luôn có cùng ngữ nghĩa khi đi kèm atomic move.

Thử lại (retry) cũng cần ngữ nghĩa rõ. Đọc lại từ nguồn có thể đơn giản; thử lại một lần ghi đã tiến triển một phần có thể nhân đôi dữ liệu nếu không biết offset/trạng thái đích. Một thao tác **idempotent** là thao tác có thể lặp lại mà vẫn cho cùng kết quả cuối mong muốn; một thao tác **resumable** là thao tác có thể tiếp tục từ vị trí/trạng thái đã hoàn thành thay vì bắt đầu lại. Đừng thêm retry chung cho mọi `IOException` nếu chưa biết thao tác có các đặc tính này hay không.

Việc dọn dẹp tài nguyên vẫn áp dụng khi lỗi xảy ra, vì vậy quyền sở hữu và `try-with-resources` ở chương trước là một phần của xử lý lỗi I/O, không chỉ là phong cách viết mã.
