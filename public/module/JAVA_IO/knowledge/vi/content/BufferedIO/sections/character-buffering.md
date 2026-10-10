Đọc từng `char` một qua tầng bên dưới có thể tạo rất nhiều thao tác nhỏ. I/O văn bản thường ghép luồng ký tự với:

- `BufferedReader` để đọc qua bộ đệm và có `readLine()`;
- `BufferedWriter` để gom nhiều lần ghi ký tự nhỏ trước khi chuyển tiếp xuống dưới.

Ví dụ:

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("lines-", ".txt");

try (java.io.BufferedWriter writer =
         new java.io.BufferedWriter(
             new java.io.OutputStreamWriter(
                 new java.io.FileOutputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    writer.write("dòng 1");
    writer.newLine();
    writer.write("dòng 2");
}

try (java.io.BufferedReader reader =
         new java.io.BufferedReader(
             new java.io.InputStreamReader(
                 new java.io.FileInputStream(temp.toFile()),
                 java.nio.charset.StandardCharsets.UTF_8))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
}

java.nio.file.Files.deleteIfExists(temp);
```

`readLine()` bỏ ký tự kết thúc dòng khỏi văn bản trả về và trả `null` khi EOF. `BufferedWriter.newLine()` ghi ký tự kết thúc dòng phù hợp với nền tảng khi đó là định dạng mà ứng dụng mong muốn.

Đệm dữ liệu không thay đổi cách mã hóa; cầu nối charset vẫn chịu trách nhiệm mã hóa và giải mã. Phần tiếp theo tập trung vào thời điểm dữ liệu đang nằm trong bộ đệm đầu ra cần được đẩy xuống tầng bên dưới.
