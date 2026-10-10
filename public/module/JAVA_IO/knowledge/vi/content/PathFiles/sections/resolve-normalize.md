Ứng dụng thường có một thư mục gốc rồi cần tạo đường dẫn con. `resolve` diễn đạt đúng ý này:

~~~java
Path root = Path.of("workspace");
Path file = root.resolve("notes").resolve("today.txt");
~~~

Nếu đối số của `resolve` là một đường dẫn tuyệt đối, kết quả là chính đường dẫn tuyệt đối đó. Đây là hành vi cần nhớ khi một phần đường dẫn đến từ cấu hình hoặc dữ liệu đầu vào.

`normalize()` xử lý cấu trúc đường dẫn theo cú pháp, ví dụ loại `.` và các cặp `name/..` có thể rút gọn:

~~~java
Path raw = Path.of("data", ".", "reports", "..", "note.txt");
Path normalized = raw.normalize();

System.out.println(normalized); // data/note.txt
~~~

`normalize()` **không truy cập hệ thống tệp** và không giải quyết liên kết tượng trưng (symbolic link, thường gọi là symlink). Symbolic link là một mục trong hệ thống tệp dùng để trỏ tới một đường dẫn/đích khác thay vì tự chứa nội dung của đích. Đây là lý do `normalize()` khác `toRealPath()`: `toRealPath()` truy cập hệ thống tệp, yêu cầu đường dẫn tồn tại và trả về đường dẫn thực sau khi xử lý link theo tùy chọn.

Với symbolic link, một đường dẫn có thành phần `..` có thể mang ý nghĩa khi chạy khác với đường dẫn đã rút gọn thuần cú pháp. Vì vậy không nên xem `normalize()` là bằng chứng rằng hai đường dẫn chắc chắn trỏ cùng một tệp.

`relativize()` trả lời câu hỏi ngược lại: “từ A cần đi tương đối thế nào để tới B?”:

~~~java
Path base = Path.of("workspace", "docs");
Path target = Path.of("workspace", "images", "logo.png");

Path relative = base.relativize(target);
System.out.println(relative);
~~~

Hai đường dẫn phải tương thích, chẳng hạn cùng là đường dẫn tuyệt đối hoặc cùng là đường dẫn tương đối và thuộc hệ thống tệp phù hợp. `relativize()` hữu ích khi lưu liên kết tương đối hoặc hiển thị đường dẫn ngắn, nhưng nó vẫn là phép toán trên đường dẫn, chưa đọc hay ghi dữ liệu.
