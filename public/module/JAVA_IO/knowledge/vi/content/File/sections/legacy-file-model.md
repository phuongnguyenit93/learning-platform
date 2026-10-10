Tên `File` dễ làm người mới hiểu rằng đối tượng này “chính là tệp đang mở”. Thực tế, một `java.io.File` chủ yếu biểu diễn một **đường dẫn (pathname)** — giá trị mô tả tên/vị trí của một tệp hoặc thư mục trong hệ thống tệp. **Đường dẫn tuyệt đối (absolute pathname)** xác định vị trí từ điểm gốc của hệ thống tệp, còn với `java.io`, **đường dẫn tương đối (relative pathname)** được giải quyết dựa trên thư mục người dùng hiện tại do **thuộc tính hệ thống (system property)** `user.dir` chỉ ra, thường là thư mục nơi JVM được khởi chạy. Đối tượng vẫn có thể được tạo ngay cả khi mục tiêu chưa tồn tại. Cụm “abstract pathname” trong JDK nhấn mạnh rằng đây là mô hình đường dẫn, không phải **tài nguyên tệp đang mở (file handle)** để đọc/ghi.

```text
đối tượng java.io.File
    ↓ chứa đường dẫn
"data/report.txt"
    ↓ khi thao tác cần hỏi hệ thống tệp
exists? isFile? isDirectory? length? mkdir? delete? ...
```

Tạo đối tượng `File` không mở tệp và cũng không đảm bảo đường dẫn tồn tại:

```java
java.io.File file = new java.io.File("data/report.txt");

System.out.println(file.getPath());
System.out.println(file.exists());
```

Dòng đầu luôn có thể in đường dẫn mà đối tượng đang giữ. Dòng `exists()` mới hỏi hệ thống tệp về trạng thái hiện tại.

`File` cũng có thể biểu diễn thư mục:

```java
java.io.File tempDir =
    new java.io.File(System.getProperty("java.io.tmpdir"));

System.out.println(tempDir.isDirectory());
```

Vì vậy mô hình cần nhớ là **đường dẫn + các thao tác hệ thống tệp kiểu cũ**, không phải “tài nguyên tệp đang mở để đọc/ghi”. Muốn đọc/ghi nội dung theo luồng, ta vẫn mở `FileInputStream`, `FileOutputStream`, reader/writer hoặc dùng API NIO hiện đại.
