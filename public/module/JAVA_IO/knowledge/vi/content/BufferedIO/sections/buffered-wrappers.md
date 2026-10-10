Java dùng các đối tượng lớp bọc để giữ quy tắc đọc/ghi quen thuộc nhưng bổ sung hành vi như đệm dữ liệu:

```text
byte:
FileInputStream  → BufferedInputStream
FileOutputStream → BufferedOutputStream

văn bản:
InputStreamReader  → BufferedReader
OutputStreamWriter → BufferedWriter
```

Ví dụ ghi rồi đọc lại UTF-8:

Các lệnh `Path`/`Files` trong ví dụ chỉ dùng để tạo và dọn tệp tạm. Người học chưa cần hiểu API hệ thống tệp ở đoạn này; mục tiêu là quan sát lớp bọc có bộ đệm và chuỗi `Writer`/`Reader`.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("buffered-", ".txt");
String expected = "Xin chào Java ☕";

try (java.io.BufferedWriter writer =
         new java.io.BufferedWriter(
             new java.io.OutputStreamWriter(
                 new java.io.FileOutputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    writer.write(expected);
}

String actual;
try (java.io.BufferedReader reader =
         new java.io.BufferedReader(
             new java.io.InputStreamReader(
                 new java.io.FileInputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    actual = reader.readLine();
}

System.out.println(expected.equals(actual)); // true
java.nio.file.Files.deleteIfExists(temp);
```

Khi lớp bọc ngoài cùng được đóng, nó đóng chuỗi bên dưới theo quy tắc của các lớp này. Nếu phạm vi hiện tại sở hữu toàn bộ chuỗi, mã thường chỉ đóng lớp bọc ngoài cùng thay vì đóng từng tầng rời rạc; việc bọc một tài nguyên do bên gọi sở hữu không tự động chuyển quyền sở hữu ở mức ứng dụng.

Không nên thêm nhiều lớp bộ đệm chỉ vì “nhiều bộ đệm sẽ nhanh hơn”. Nếu một tầng đã đệm dữ liệu hiệu quả, thêm một bộ đệm khác có thể chỉ tăng bộ nhớ và số lần sao chép. Hãy chọn lớp bọc theo khả năng thực sự cần: đệm byte, đọc văn bản theo dòng, chuyển đổi charset hoặc một hành vi khác.

Sau khi biết cách dữ liệu di chuyển, chương tiếp theo chuyển sang một khái niệm khác: `java.io.File` không phải luồng dữ liệu mà là mô hình cũ để biểu diễn đường dẫn và thao tác với siêu dữ liệu/hệ thống tệp.
