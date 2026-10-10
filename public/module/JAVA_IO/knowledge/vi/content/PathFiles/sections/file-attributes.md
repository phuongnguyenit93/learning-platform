Nội dung tệp là dữ liệu bên trong. **Siêu dữ liệu (metadata)** mô tả tệp: kích thước, thời gian sửa đổi, loại tệp, quyền truy cập và các thuộc tính khác do hệ thống tệp cung cấp.

Các kiểm tra đơn giản:

~~~java
System.out.println(Files.exists(note));
System.out.println(Files.isRegularFile(note));
System.out.println(Files.isDirectory(note));
System.out.println(Files.size(note));
System.out.println(Files.getLastModifiedTime(note));
~~~

`Files.exists(path)` và `Files.notExists(path)` **không phải hai phép phủ định tuyệt đối của nhau**. Nếu hệ thống tệp không thể xác định trạng thái, cả hai có thể cùng trả `false`. Vì vậy:

~~~text
exists == true
→ đã xác nhận tồn tại tại thời điểm kiểm tra

notExists == true
→ đã xác nhận không tồn tại tại thời điểm kiểm tra

cả hai false
→ trạng thái chưa xác định được
~~~

Nếu câu hỏi thật sự là “hai `Path` này có trỏ tới cùng một tệp không?”, đừng suy ra chỉ từ chuỗi đường dẫn hoặc `normalize()`. `Files.isSameFile(a, b)` xử lý định danh tệp và các trường hợp như liên kết tượng trưng phù hợp hơn. Có một ngoại lệ quan trọng: nếu hai giá trị `Path` đã bằng nhau, `isSameFile` trả `true` mà không cần kiểm tra tệp có tồn tại hay không, vì vậy **đây không phải API kiểm tra sự tồn tại của tệp**.

Khi cần lấy nhiều thuộc tính cùng lúc, dùng `readAttributes`:

~~~java
BasicFileAttributes attrs =
        Files.readAttributes(note, BasicFileAttributes.class);

System.out.println(attrs.size());
System.out.println(attrs.creationTime());
System.out.println(attrs.lastModifiedTime());
System.out.println(attrs.isRegularFile());
~~~

`BasicFileAttributes` là lớp nền có tính đa nền tảng tương đối cao. Một số hệ thống tệp hỗ trợ nhóm thuộc tính chuyên biệt như `PosixFileAttributes` hoặc thuộc tính DOS. Mã dùng các nhóm này phải chấp nhận rằng hệ thống tệp khác có thể không hỗ trợ.

Symbolic link cũng ảnh hưởng siêu dữ liệu. Nhiều API mặc định đi theo link tới đích. Khi mục tiêu là hỏi về chính mục link, một số API cho phép `LinkOption.NOFOLLOW_LINKS`:

~~~java
boolean followsTarget = Files.exists(note);
boolean pathEntryExists =
        Files.exists(note, LinkOption.NOFOLLOW_LINKS);
~~~

Một lỗi thiết kế phổ biến là:

~~~text
kiểm tra exists
→ giả định trạng thái vẫn giữ nguyên
→ thực hiện thao tác sau đó
~~~

Hệ thống tệp có thể thay đổi giữa hai bước do thread hoặc tiến trình khác. Vì vậy hãy để thao tác thực tế quyết định thành công/thất bại và xử lý ngoại lệ, thay vì coi kiểm tra trước đó là cam kết.
