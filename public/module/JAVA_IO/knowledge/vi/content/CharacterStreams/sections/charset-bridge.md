**Bộ mã ký tự (charset)** là tập quy tắc quy định chuỗi ký tự được biểu diễn thành chuỗi byte như thế nào và ngược lại. **Mã hóa (encoding)** là chiều ký tự → byte; **giải mã (decoding)** là chiều byte → ký tự. Charset cần tồn tại vì cùng một ký tự có thể có cách biểu diễn byte khác nhau giữa các bộ mã, và một byte đơn lẻ không tự mang ý nghĩa văn bản.

`InputStreamReader` dùng một `Charset` để **giải mã byte → ký tự**. `OutputStreamWriter` làm chiều ngược lại: **mã hóa ký tự → byte**.

```text
byte của tệp
    ↓ InputStream
InputStreamReader + bộ giải mã UTF-8
    ↓
ký tự

ký tự
    ↓
OutputStreamWriter + bộ mã hóa UTF-8
    ↓ OutputStream
byte của tệp
```

Ví dụ ghi rồi đọc lại chuỗi UTF-8 qua tệp tạm:

`Path`, `Files.createTempFile(...)`, `toFile()` và `deleteIfExists(...)` ở đây chỉ là phần phụ trợ để tạo một tệp tạm an toàn cho ví dụ. Các chương về hệ thống tệp phía sau mới là nơi học các API đó; phần cần tập trung ở đây là `Reader`/`Writer` và cầu nối charset.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("chars-", ".txt");
String expected = "Xin chào Java ☕";

try (java.io.Writer writer =
         new java.io.OutputStreamWriter(
             new java.io.FileOutputStream(temp.toFile()),
             java.nio.charset.StandardCharsets.UTF_8)) {
    writer.write(expected);
}

StringBuilder actual = new StringBuilder();
try (java.io.Reader reader =
         new java.io.InputStreamReader(
             new java.io.FileInputStream(temp.toFile()),
             java.nio.charset.StandardCharsets.UTF_8)) {
    char[] buffer = new char[8];
    int count;
    while ((count = reader.read(buffer)) != -1) {
        actual.append(buffer, 0, count);
    }
}

System.out.println(expected.contentEquals(actual)); // true
java.nio.file.Files.deleteIfExists(temp);
```

Charset phải khớp với định dạng dữ liệu. Nếu tệp được mã hóa bằng UTF-8 nhưng đọc bằng charset khác, byte vẫn có thể được đọc thành công nhưng văn bản có thể sai hoặc bộ giải mã có thể gặp dữ liệu đầu vào không hợp lệ.

Không phải lỗi văn bản nào cũng nên được xử lý giống nhau. Khi cần chính sách rõ ràng cho dữ liệu đầu vào hỏng, `CharsetDecoder`/`CharsetEncoder` cho phép chọn `CodingErrorAction.REPORT`, `REPLACE` hoặc `IGNORE` cho dữ liệu sai định dạng hoặc không thể ánh xạ. Ví dụ nếu giao thức yêu cầu UTF-8 hợp lệ tuyệt đối, có thể cấu hình bộ giải mã để `REPORT`:

```java
java.nio.charset.CharsetDecoder decoder =
    java.nio.charset.StandardCharsets.UTF_8
        .newDecoder()
        .onMalformedInput(java.nio.charset.CodingErrorAction.REPORT)
        .onUnmappableCharacter(java.nio.charset.CodingErrorAction.REPORT);

java.io.Reader strictReader =
    new java.io.InputStreamReader(inputStream, decoder);
```

Đây là ranh giới về tính hợp lệ của dữ liệu, không phải phần Unicode chuyên sâu: điều cần quyết định ở tầng I/O là dữ liệu lỗi phải được **báo lỗi (REPORT)**, **thay thế (REPLACE)** hay **bỏ qua (IGNORE)**.

Khi cách mã hóa là một phần của định dạng hoặc giao thức, hãy truyền `Charset` rõ ràng. Từ Java 18, charset mặc định của Java là UTF-8 trừ khi phần cài đặt được cấu hình theo cơ chế cho phép thay đổi charset mặc định; tuy vậy, mã phụ thuộc vào một định dạng cụ thể vẫn nên thể hiện quyết định mã hóa ngay tại ranh giới để người đọc không phải đoán.

Luồng ký tự xử lý giá trị `char`/đơn vị mã UTF-16. Các khái niệm sâu hơn như cặp thay thế (surrogate pair), điểm mã (code point) và cụm ký tự hiển thị (grapheme cluster) **chưa cần hiểu để theo tiếp chương này**; chúng thuộc kiến thức String/Unicode. Trách nhiệm của I/O ở đây hẹp hơn: cầu nối charset chuyển đổi đúng giữa byte và biểu diễn ký tự của Java.

Đến đây trách nhiệm của luồng ký tự đã hoàn chỉnh: `Reader`/`Writer` làm việc ở tầng ký tự, còn `InputStreamReader`/`OutputStreamWriter` nối ký tự với byte thông qua charset. Việc ghép `BufferedReader`/`BufferedWriter` thuộc chương tiếp theo về lớp bọc và bộ đệm.
