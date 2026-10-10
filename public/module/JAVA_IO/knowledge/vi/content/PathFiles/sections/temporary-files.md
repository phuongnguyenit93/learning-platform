Ứng dụng thường cần một nơi lưu **tạm thời** cho dữ liệu trung gian: tệp tải lên đang xử lý, tệp giải nén, kết quả biến đổi, bộ nhớ đệm ngắn hạn hoặc dữ liệu phục vụ kiểm thử. Tự ghép một tên như `tmp.txt` dễ đụng tên giữa nhiều thread/tiến trình và cũng khiến mã phải tự quyết định thư mục nào là nơi tạm phù hợp. `Files.createTempFile(...)` và `Files.createTempDirectory(...)` giải quyết đúng bài toán này bằng cách **tạo thật** một tệp/thư mục mới với tên do provider hệ thống tệp tạo đủ duy nhất trong bối cảnh đó.

```java
Path tempFile = Files.createTempFile("report-", ".txt");
Path tempDir = Files.createTempDirectory("work-");
```

Các phiên bản nạp chồng không truyền thư mục cha dùng **thư mục tạm mặc định** của môi trường chạy. Khi ứng dụng muốn kiểm soát nơi đặt dữ liệu, truyền một thư mục rõ ràng:

```java
Path workspace = Path.of("work");
Files.createDirectories(workspace);

Path tempFile = Files.createTempFile(workspace, "upload-", ".bin");
Path tempDir = Files.createTempDirectory(workspace, "extract-");
```

Tạo `Path` chỉ tạo đối tượng mô tả đường dẫn; ngược lại, `createTempFile` và `createTempDirectory` là **thao tác hệ thống tệp** và tài nguyên tương ứng tồn tại ngay khi phương thức trả về thành công.

Một hiểu lầm phổ biến là “tạm” có nghĩa JVM sẽ tự dọn. **Không có bảo đảm như vậy.** `try-with-resources` đóng stream/channel đang mở nhưng không tự xóa tệp hoặc thư mục mà tài nguyên đó trỏ tới. Nếu mã tạo tài nguyên tạm thì mã cũng cần xác định quyền sở hữu và cách dọn dẹp:

```java
Path temp = Files.createTempFile("job-", ".dat");

try {
    Files.writeString(temp, "intermediate data", StandardCharsets.UTF_8);
    process(temp); // helper của ứng dụng
} finally {
    Files.deleteIfExists(temp);
}
```

Với thư mục tạm, cần xóa nội dung bên trong trước rồi mới xóa thư mục; `Files.delete(tempDir)` không xóa đệ quy. Đây là lý do việc duyệt cây phía sau có liên quan trực tiếp tới dọn dẹp workspace tạm phức tạp.

Một số API mở tệp chấp nhận `StandardOpenOption.DELETE_ON_CLOSE`:

```java
Path temp = Files.createTempFile("session-", ".bin");

try (SeekableByteChannel channel = Files.newByteChannel(
        temp,
        StandardOpenOption.WRITE,
        StandardOpenOption.DELETE_ON_CLOSE)) {
    channel.write(ByteBuffer.wrap(new byte[] {1, 2, 3}));
}
```

Tùy chọn này yêu cầu phần triển khai **cố gắng xóa tốt nhất có thể (best effort)** khi tài nguyên được đóng. Nó hữu ích cho một số tệp tạm gắn chặt với vòng đời của handle đang mở, nhưng không nên được coi là chiến lược dọn dẹp duy nhất cho mọi môi trường: provider/nền tảng có thể khác nhau, việc dừng hoặc gặp sự cố bất thường không phải một giao dịch bảo đảm xóa. Khi dọn dẹp là yêu cầu của ứng dụng, quyền sở hữu rõ ràng kết hợp `finally` hoặc quy trình dọn dẹp vẫn là mô hình an toàn hơn.
