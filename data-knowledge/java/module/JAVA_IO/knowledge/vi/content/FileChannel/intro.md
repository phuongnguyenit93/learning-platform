# FileChannel và I/O tệp nâng cao

`FileChannel` là một channel dành cho tệp. Nó vẫn đọc/ghi byte qua `ByteBuffer`, nhưng còn có **vị trí trong tệp**, thao tác tại **độ lệch (offset)** cụ thể, truyền dữ liệu giữa các channel, khóa tệp (file lock) và ánh xạ bộ nhớ (memory mapping). Đây là lúc mô hình Buffer/Channel ở chương trước bắt đầu cho thấy các khả năng mà luồng tuần tự không biểu diễn trực tiếp.

~~~java
Path file = Files.createTempFile("channel-demo-", ".txt");

try (FileChannel channel = FileChannel.open(
        file,
        StandardOpenOption.READ,
        StandardOpenOption.WRITE
)) {
    // làm việc với channel
}
~~~
