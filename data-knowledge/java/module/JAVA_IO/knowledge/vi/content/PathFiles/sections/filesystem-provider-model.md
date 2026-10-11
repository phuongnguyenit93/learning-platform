`Path` không tồn tại một mình. **Mỗi `Path` thuộc về một `FileSystem` cụ thể**. `FileSystem` mô tả không gian tên và quy tắc đường dẫn mà `Path` đang thuộc về: các gốc nào tồn tại, dấu phân cách nào được dùng, `FileStore` nào khả dụng và những khả năng nào provider phía sau hỗ trợ.

Mô hình nên nhớ:

~~~text
Path
→ thuộc về một FileSystem
→ FileSystem được triển khai/cung cấp bởi FileSystemProvider
→ dữ liệu thực tế nằm trên một hay nhiều FileStore
~~~

Trong hầu hết ứng dụng desktop hoặc máy chủ thông thường, `Path.of(...)` dùng **hệ thống tệp mặc định** của hệ điều hành. Nhưng NIO.2 không giới hạn `Path` vào hệ thống tệp mặc định: Java có thể làm việc với hệ thống tệp khác do provider cung cấp, ví dụ hệ thống tệp ZIP/JAR. Điều này giải thích vì sao `Path` là mức trừu tượng rộng hơn một chuỗi đường dẫn Windows/Linux.

~~~java
Path path = Path.of("data", "note.txt");
FileSystem fs = path.getFileSystem();

System.out.println(fs.provider().getScheme());
System.out.println(fs.getSeparator());
~~~

`FileSystemProvider` là lớp triển khai đứng sau các thao tác hệ thống tệp. Mã ứng dụng thường **không gọi provider trực tiếp**; nó dùng `Path` và `Files`, còn provider thực hiện thao tác theo khả năng của hệ thống tệp đó. Đây là nguyên nhân chung cho nhiều ranh giới về tính đa nền tảng đã gặp trong chương này:

~~~text
ATOMIC_MOVE có thể không hỗ trợ
POSIX permission view có thể không tồn tại
WatchService có thể phân phối sự kiện khác nhau
hành vi symbolic link có thể khác
→ vì khả năng/ngữ nghĩa phụ thuộc hệ thống tệp + provider
~~~

`FileStore` đại diện cho vùng lưu trữ/hệ thống tệp phía sau mà một đường dẫn nằm trên đó. Nó cho phép hỏi thông tin như dung lượng và nhóm thuộc tính mà nơi lưu trữ hỗ trợ:

~~~java
FileStore store = Files.getFileStore(path);

long total = store.getTotalSpace();
long usable = store.getUsableSpace();

boolean posix =
        store.supportsFileAttributeView("posix");
~~~

Các giá trị dung lượng chỉ là ảnh chụp tại thời điểm hỏi và không phải bảo đảm về quota hay giao dịch. Tương tự, việc một `FileStore` báo hỗ trợ một nhóm thuộc tính chỉ nói rằng khả năng đó tồn tại ở mức store/provider; thao tác cụ thể vẫn có thể thất bại vì quyền truy cập, trạng thái tệp hoặc điều kiện tranh chấp.

Một hệ quả quan trọng là **không phải mọi `Path` từ mọi provider đều có thể chuyển sang `java.io.File`**. `Path.toFile()` chỉ được hỗ trợ bởi provider mặc định; với provider khác nó có thể ném `UnsupportedOperationException`. Vì vậy mã hiện đại nên giữ dữ liệu dưới dạng `Path` thay vì chuyển sang `File` chỉ vì thói quen.

Hai `Path` từ provider/hệ thống tệp không tương thích cũng không nên được trộn tùy ý. Những thao tác như `resolve`, `relativize` hoặc sao chép/di chuyển có ranh giới provider riêng; khi thiết kế mã dùng lại được, hãy coi **định danh hệ thống tệp** là một phần của ngữ cảnh chứ không giả định mọi đường dẫn đều cùng loại.

Phần này không yêu cầu người mới tự viết `FileSystemProvider` tùy chỉnh. Mục tiêu là hiểu kiến trúc: `Path` thuộc một `FileSystem`, `Files` chuyển thao tác tới provider, và `FileStore` mô tả vùng lưu trữ cùng khả năng hỗ trợ. Mô hình này nối lại các giới hạn đa nền tảng trong toàn bộ chương.
