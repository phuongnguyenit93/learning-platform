`File` giải quyết được nhiều nhu cầu cơ bản, nhưng API cũ có một số giới hạn đáng chú ý.

Thứ nhất, nhiều thao tác báo thất bại bằng `boolean` thay vì cho biết nguyên nhân chi tiết:

```java
java.io.File file = new java.io.File("data/report.txt");

if (!file.delete()) {
    System.out.println("Xóa thất bại, nhưng boolean không nói rõ nguyên nhân");
}
```

Thất bại có thể do tệp không tồn tại, thiếu quyền, tệp đang được sử dụng, hệ thống tệp từ chối thao tác hoặc lý do khác. Chỉ từ `false`, mã không có đủ ngữ cảnh để phân biệt.

Thứ hai, cách xử lý đường dẫn dưới dạng chuỗi dễ trộn nhiều khái niệm:

- đường dẫn tương đối và tuyệt đối;
- **ký tự phân cách (separator)** giữa các thành phần đường dẫn có thể khác theo nền tảng, ví dụ `/` hoặc `\`;
- `.` biểu diễn “thư mục hiện tại”, còn `..` biểu diễn “thư mục cha” trong cú pháp đường dẫn;
- **liên kết tượng trưng (symbolic link, symlink)** — một mục trong hệ thống tệp trỏ tới đường dẫn/mục tiêu khác — và **đường dẫn chuẩn tắc (canonical path)** — dạng đường dẫn đã được hệ thống tệp giải quyết/chuẩn hóa theo quy tắc của nó;
- thao tác trên đường dẫn so với thao tác trên nội dung tệp.

`getAbsoluteFile()` chỉ tạo biểu diễn tuyệt đối theo môi trường hiện tại. `getCanonicalFile()` còn giải quyết thêm các chi tiết phụ thuộc hệ thống tệp và có thể cần I/O, vì vậy nó có thể ném `IOException`. Hai khái niệm này không nên coi là giống nhau.

Thứ ba, API `File` không cung cấp mô hình phong phú bằng **NIO.2**, tên thường dùng cho nhóm API hệ thống tệp hiện đại trong `java.nio.file` như `Path` và `Files`, với thuộc tính, liên kết tượng trưng, duyệt cây thư mục, tùy chọn sao chép/di chuyển và thông tin lỗi chi tiết.
