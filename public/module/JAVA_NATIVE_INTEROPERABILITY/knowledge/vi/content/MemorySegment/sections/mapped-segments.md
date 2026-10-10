Mapped segment ánh xạ một vùng file vào address space của process và biểu diễn vùng đó bằng MemorySegment. Trong Java 21, FileChannel có preview overload nhận Arena:

~~~java
try (FileChannel channel = FileChannel.open(
        path, StandardOpenOption.READ, StandardOpenOption.WRITE);
     Arena arena = Arena.ofConfined()) {

    MemorySegment mapped = channel.map(
            FileChannel.MapMode.READ_WRITE,
            0,
            channel.size(),
            arena);
}
~~~

Lifetime của mapping gắn với arena được truyền vào; khi closeable arena đóng, mapping được unmap theo contract của API.

Mapped segment còn cung cấp các thao tác liên quan đến mapping như `load()`, `isLoaded()`, `unload()` và `force()` khi nền tảng hỗ trợ. Chúng phục vụ việc nạp trước trang nhớ, quan sát trạng thái nạp, yêu cầu unload hoặc đẩy thay đổi xuống file; các thao tác này không thay thế contract về bounds/lifetime của segment.

Mapped memory vẫn chịu ảnh hưởng của file và hệ điều hành. Nội dung có thể thay đổi do process khác ghi file, và thao tác vượt ngoài các giả định của mapping có thể dẫn tới lỗi. Vì thế mapped segment cung cấp Java access model tốt hơn raw mapping nhưng không loại bỏ các vấn đề về concurrency/file system.
