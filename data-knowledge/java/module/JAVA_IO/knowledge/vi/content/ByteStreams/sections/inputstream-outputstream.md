Trước hết, **luồng (stream)** là cách nhìn dữ liệu như một dòng giá trị đi tuần tự từ nguồn tới chương trình hoặc từ chương trình tới đích. Luồng không có nghĩa toàn bộ dữ liệu đã nằm sẵn trong RAM; mã thường xử lý dần khi dữ liệu đi qua.

Đừng nhầm **luồng I/O** ở `java.io` với **Stream API** ở `java.util.stream`. Luồng I/O là mô hình để **đọc/ghi dữ liệu từ nguồn/đích**; `Stream<T>` của Stream API là chuỗi xử lý phần tử bằng `map`, `filter`, `reduce`... Hai khái niệm có cùng từ “stream” nhưng giải quyết hai bài toán khác nhau.

`InputStream` là **mô hình chung (abstraction)** cho việc **đọc byte từ một nguồn**. `OutputStream` là mô hình chung cho việc **ghi byte đến một đích**.

```text
nguồn ──> InputStream ──> ứng dụng
ứng dụng ──> OutputStream ──> đích
```

Hai kiểu này là **lớp trừu tượng (abstract class)**: lớp nền dùng để mô tả hành vi chung chứ không đại diện sẵn cho một nguồn/đích cụ thể. **Quy tắc API (contract)** là hành vi mà mã gọi API có thể dựa vào; **lớp con (subclass)** cung cấp phần cài đặt cho nguồn/đích thật sự:

- `FileInputStream` / `FileOutputStream`: tệp.
- `ByteArrayInputStream` / `ByteArrayOutputStream`: vùng nhớ.
- luồng từ socket hoặc API khác: nguồn/đích khác nhưng vẫn dùng cùng quy tắc luồng byte.

Java cũng có ba **luồng chuẩn (standard stream)** gắn với tiến trình: `System.in` là `InputStream` cho đầu vào chuẩn, còn `System.out` và `System.err` là `PrintStream` cho đầu ra chuẩn và đầu ra lỗi chuẩn. `PrintStream` tiện cho `print/println/printf`, nhưng các phương thức ghi của nó không truyền `IOException` ra bên gọi; lỗi được giữ trong trạng thái lỗi và có thể kiểm tra bằng `checkError()`.

Nhờ đó mã xử lý byte có thể phụ thuộc vào `InputStream` thay vì phải biết dữ liệu đến từ tệp hay vùng nhớ.

Ví dụ ghi rồi đọc lại UTF-8 bằng luồng byte:

Ví dụ dùng tệp tạm làm nguồn/đích có kiểm soát. `Path` và `Files` chỉ là phần phụ trợ để dựng ví dụ ở thời điểm này; chương về hệ thống tệp phía sau sẽ giải thích chúng riêng.

```java
java.nio.file.Path temp = java.nio.file.Files.createTempFile("bytes-", ".bin");
byte[] expected = "Xin chào Java ☕"
    .getBytes(java.nio.charset.StandardCharsets.UTF_8);

try (java.io.OutputStream out =
         new java.io.FileOutputStream(temp.toFile())) {
    out.write(expected);
}

byte[] actual;
try (java.io.InputStream in =
         new java.io.FileInputStream(temp.toFile())) {
    actual = in.readAllBytes();
}

System.out.println(java.util.Arrays.equals(expected, actual)); // true
java.nio.file.Files.deleteIfExists(temp);
```

`readAllBytes()` làm ví dụ ngắn gọn, nhưng nó đưa toàn bộ phần dữ liệu còn lại vào bộ nhớ. Với dữ liệu lớn hoặc không biết trước kích thước, nên đọc tăng dần theo từng khối; chương I/O có bộ đệm sẽ giải thích kỹ hơn cách dùng bộ đệm để giảm số thao tác I/O bên dưới.
