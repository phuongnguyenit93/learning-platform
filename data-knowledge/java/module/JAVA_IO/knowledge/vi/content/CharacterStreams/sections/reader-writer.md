`Reader` là **mô hình chung** để **đọc dữ liệu ký tự**. `Writer` là mô hình chung để **ghi dữ liệu ký tự**.

```text
nguồn văn bản ──> Reader ──> dữ liệu char ──> ứng dụng
ứng dụng ──> dữ liệu char ──> Writer ──> đích văn bản
```

API của chúng theo cùng mô hình luồng, nhưng đơn vị xử lý là ký tự Java:

- `Reader.read()` trả một giá trị ký tự dưới dạng `int`, hoặc `-1` ở EOF. Dùng `int` giúp API vừa biểu diễn được giá trị ký tự vừa dành riêng `-1` để báo hết dữ liệu.
- `Reader.read(char[])` trả số `char` thực sự đọc được.
- `Writer.write(...)` ghi `char`, `char[]` hoặc `String`.

Giống luồng byte, `Reader.read(char[])` **không hứa lấp đầy mảng**. Nếu mã cần đúng N ký tự thì phải lặp theo số lượng thực tế đã đọc, thay vì giả định một lần `read` là đủ.

`PrintWriter` là writer tiện cho `print/println/printf`. Giống `PrintStream`, các phương thức ghi của nó không truyền `IOException` ra bên gọi; khi cần biết có lỗi I/O hay không, mã kiểm tra `checkError()`. Vì quy tắc này khác `BufferedWriter`/`OutputStreamWriter`, không nên đổi sang `PrintWriter` chỉ vì cú pháp ngắn hơn nếu bên gọi cần xử lý ngoại lệ trực tiếp.

Ví dụ chỉ làm việc trong bộ nhớ:

```java
try (java.io.Reader reader =
         new java.io.StringReader("Java I/O")) {
    char[] buffer = new char[4];
    int count = reader.read(buffer);
    System.out.println(new String(buffer, 0, count)); // Java
}
```

`Reader`/`Writer` giúp mã xử lý văn bản ở đúng mức mô hình. Tuy nhiên tệp và mạng cuối cùng vẫn truyền byte. Vì thế cần một cầu nối giữa hai thế giới.
