Khi đã có `Path`, lớp tiện ích `Files` cung cấp các thao tác hệ thống tệp phổ biến. Với tệp nhỏ và có giới hạn kích thước rõ ràng, Java hiện đại có các phương thức tiện lợi để đọc hoặc ghi toàn bộ nội dung:

~~~java
Path tempDir = Files.createTempDirectory("io-demo-");
Path note = tempDir.resolve("note.txt");

Files.writeString(
        note,
        "Xin chào Java I/O",
        StandardCharsets.UTF_8
);

String loaded = Files.readString(note, StandardCharsets.UTF_8);
System.out.println(loaded);
~~~

Ta cố ý truyền `StandardCharsets.UTF_8` để quy tắc chuyển đổi giữa byte trên đĩa và ký tự trong `String` được thể hiện rõ.

Các nhóm thao tác thường gặp:

| Nhu cầu | API thường dùng |
| --- | --- |
| Tạo thư mục | `Files.createDirectory`, `Files.createDirectories` |
| Tạo tệp | `Files.createFile` |
| Đọc/ghi tệp nhỏ | `readString`, `writeString`, `readAllBytes`, `write` |
| Mở luồng | `newInputStream`, `newOutputStream`, `newBufferedReader`, `newBufferedWriter` |
| Sao chép | `copy` |
| Di chuyển/đổi tên | `move` |
| Xóa | `delete`, `deleteIfExists` |

`createDirectory` tạo đúng một thư mục và yêu cầu thư mục cha đã tồn tại. `createDirectories` tạo cả các thư mục cha còn thiếu:

~~~java
Path reports = tempDir.resolve("a").resolve("b").resolve("reports");
Files.createDirectories(reports);
~~~

Với sao chép/di chuyển, hành vi phải được nói rõ bằng tùy chọn khi cần:

~~~java
Path copy = tempDir.resolve("note-copy.txt");
Files.copy(note, copy, StandardCopyOption.REPLACE_EXISTING);

Path moved = tempDir.resolve("archive.txt");
Files.move(copy, moved, StandardCopyOption.REPLACE_EXISTING);
~~~

`StandardCopyOption.ATOMIC_MOVE` có thể yêu cầu hệ thống tệp thực hiện việc di chuyển như một bước nguyên tử (atomic): các bên quan sát không nên thấy trạng thái trung gian kiểu “đã chuyển một phần nhưng chưa xong”. Không phải hệ thống tệp nào cũng hỗ trợ khả năng này. Nếu ứng dụng thực sự cần atomic move, phải xử lý `AtomicMoveNotSupportedException` thay vì giả định tùy chọn luôn thành công.

Một vài ngữ nghĩa rất dễ bị hiểu sai:

- `Files.copy(source, target)` mặc định **đi theo symbolic link ở nguồn** và sao chép đích của link. Nếu truyền `LinkOption.NOFOLLOW_LINKS`, chính symbolic link được sao chép thay vì đích.
- `Files.move(...)` di chuyển chính symbolic link nếu nguồn là symlink; nó không “di chuyển đích mà link đang trỏ tới”.
- `Files.copy(...)` với nguồn là thư mục chỉ tạo thư mục đích tương ứng; nó **không sao chép đệ quy toàn bộ cây**. Muốn sao chép cây phải duyệt cây, ví dụ bằng `walkFileTree`.
- `Files.delete(...)` không xóa đệ quy cả cây thư mục; xóa thư mục không rỗng có thể thất bại với `DirectoryNotEmptyException`.
- Khi dùng `ATOMIC_MOVE`, các tùy chọn di chuyển khác bị bỏ qua. Nếu đích đã tồn tại, việc thay thế hay báo lỗi phụ thuộc phần triển khai; vì vậy không nên ghép `ATOMIC_MOVE` với giả định đa nền tảng rằng `REPLACE_EXISTING` chắc chắn được tôn trọng.

`Files` cũng có các phiên bản nạp chồng (overload) nhận `StandardOpenOption`:

~~~java
Files.writeString(
        note,
        System.lineSeparator() + "Dòng mới",
        StandardCharsets.UTF_8,
        StandardOpenOption.CREATE,
        StandardOpenOption.APPEND
);
~~~

Mô hình ngắn cho các tùy chọn phổ biến:

| Option | Ý nghĩa |
| --- | --- |
| `READ` | Mở để đọc |
| `WRITE` | Mở để ghi |
| `CREATE` | Tạo tệp nếu chưa có |
| `CREATE_NEW` | Chỉ tạo nếu chưa tồn tại; báo lỗi nếu đã có |
| `APPEND` | Ghi tiếp vào cuối tệp |
| `TRUNCATE_EXISTING` | Nếu tệp tồn tại và mở để ghi, cắt độ dài về 0 trước khi ghi |

Điểm quan trọng là tùy chọn mô tả **quy ước mở tệp**, không chỉ là cú pháp. Ví dụ `CREATE_NEW` phù hợp khi ứng dụng cần “tạo mới hoặc báo lỗi”, còn `APPEND` phù hợp khi dữ liệu mới phải nối vào cuối thay vì ghi đè từ đầu.

Khi dữ liệu lớn, `readAllBytes` và `readString` không còn là lựa chọn tốt vì chúng nạp toàn bộ nội dung vào bộ nhớ. Lúc đó nên chuyển sang stream, reader/writer hoặc channel. Chương cuối sẽ gom các tiêu chí lựa chọn này thành một quyết định thống nhất.
