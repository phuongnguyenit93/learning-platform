`Path` mô hình hóa một đường dẫn trong hệ thống tệp. **Đường dẫn tuyệt đối (absolute path)** bắt đầu từ gốc đủ để xác định vị trí độc lập với thư mục làm việc hiện tại, ví dụ `C:\work\note.txt` hoặc `/tmp/note.txt`. **Đường dẫn tương đối (relative path)** như `data/note.txt` phải được hiểu dựa trên một đường dẫn cơ sở, thường là thư mục làm việc hiện tại hoặc một `Path` khác mà mã chủ động ghép bằng `resolve(...)`.

Điểm quan trọng với người mới học là: **tạo một Path không đồng nghĩa với truy cập hệ thống tệp**. Đoạn mã sau chỉ tạo một đối tượng mô tả đường dẫn:

~~~java
Path path = Path.of("data", "note.txt");
~~~

Tệp `data/note.txt` có thể tồn tại hoặc chưa tồn tại. Chỉ khi gọi các API như `Files.readString(path)`, `Files.exists(path)` hay `Files.createFile(path)` thì chương trình mới yêu cầu hệ thống tệp thực hiện công việc tương ứng.

`Path` cũng không chỉ là một `String`. Nó biết các thành phần đường dẫn:

~~~java
Path path = Path.of("data", "reports", "2026", "summary.txt");

System.out.println(path.getFileName()); // summary.txt
System.out.println(path.getParent());   // data/reports/2026 theo cách hiển thị của hệ thống tệp
System.out.println(path.isAbsolute());  // false
~~~

Dấu phân cách và cách hiển thị cụ thể phụ thuộc hệ thống tệp. Vì vậy nên xây dựng đường dẫn bằng `Path.of(...)`, `resolve(...)` và các API của `Path` thay vì tự nối chuỗi bằng ký tự phân cách.

Mối quan hệ cần nhớ:

~~~text
Path
→ mô tả vị trí / tên đường dẫn

Files
→ thực hiện thao tác hệ thống tệp bằng Path
~~~

Chương trước dùng `File` để thấy mô hình API cũ. `Path`/`Files` là hướng nên ưu tiên cho mã Java hiện đại vì API rõ vai trò hơn, hỗ trợ nhiều thao tác hơn và biểu diễn lỗi bằng ngoại lệ cụ thể hơn.
