Một đối tượng Java có thể được **bộ thu gom rác (garbage collector)** thu hồi khi không còn tham chiếu mạnh. Trên các hệ thống dùng **file descriptor**, đây là mã định danh của hệ điều hành cho một tài nguyên I/O đang mở như tệp, socket hoặc pipe; trên nền tảng khác có thể gặp **handle gốc (native handle)** tương ứng cho tài nguyên như tệp, socket hoặc thiết bị. Những tài nguyên này nằm ngoài heap Java, nên chương trình cần kết thúc việc sử dụng chúng ở một thời điểm xác định.

Vì vậy nhiều mô hình I/O có vòng đời:

```text
mở/nhận tài nguyên
    ↓
đọc/ghi
    ↓
flush nếu cần
    ↓
close
```

Ví dụ cơ bản:

`Path`/`Files` xuất hiện trong ví dụ chỉ để tạo và xóa một tệp tạm an toàn; người học **chưa cần hiểu API hệ thống tệp này ở đây**. Các chương `File` và `Path/Files` phía sau sẽ định nghĩa chúng từ đầu.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("io-", ".txt");

try (java.io.OutputStream out =
         new java.io.FileOutputStream(temp.toFile())) {
    out.write("Xin chào Java ☕"
        .getBytes(java.nio.charset.StandardCharsets.UTF_8));
}

java.nio.file.Files.deleteIfExists(temp);
```

`try-with-resources` gọi `close()` tự động kể cả khi phần thân ném ngoại lệ. Đây là cơ chế chính của Java để gắn vòng đời tài nguyên với một **phạm vi mã (scope)** rõ ràng.

Không phải mọi luồng I/O đều giữ tài nguyên hệ điều hành. Ví dụ `ByteArrayInputStream` chỉ đọc từ mảng byte trong RAM và `close()` của nó không giải phóng file descriptor. Tuy vậy, khi mã nhận một `InputStream` chung, cần hiểu **ai sở hữu luồng và ai chịu trách nhiệm đóng nó**. Chương Quản lý tài nguyên phía sau sẽ phát triển rõ mô hình quyền sở hữu này.

Từ mô hình này, chương kế tiếp có thể đi vào tầng thấp nhất của luồng I/O: Java đọc và ghi byte thô như thế nào.
