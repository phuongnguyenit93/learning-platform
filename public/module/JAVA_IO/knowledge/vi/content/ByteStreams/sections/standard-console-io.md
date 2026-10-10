Ba luồng `System.in`, `System.out` và `System.err` là các **luồng chuẩn của tiến trình**. Chúng cho chương trình một quy ước chung để nhận đầu vào và phát đầu ra mà không cần biết dữ liệu đang nối trực tiếp với terminal, được chuyển hướng từ tệp hay được một tiến trình khác nối qua pipe.

```text
đầu vào chuẩn      → System.in  → InputStream
đầu ra chuẩn       → System.out → PrintStream
đầu ra lỗi chuẩn   → System.err → PrintStream
```

Ví dụ khi chạy trực tiếp trong terminal, `System.in` có thể nhận dữ liệu người dùng gõ và `System.out` hiển thị ra màn hình. Nhưng **trình bao lệnh (shell)** có thể chuyển hướng chính chương trình đó:

```text
java App < input.txt > output.txt 2> error.txt
```

Lúc đó mã Java vẫn dùng `System.in/out/err`, nhưng nguồn/đích thật sự đã thay đổi. Vì vậy **I/O chuẩn không đồng nghĩa với I/O terminal**. Đây cũng là lý do mã thư viện thường không nên tự ý `close()` các luồng chuẩn: vòng đời của chúng thuộc tiến trình hoặc chương trình khởi chạy, và đóng `System.out` có thể làm những phần mã chạy sau không còn ghi đầu ra được nữa.

Khi ứng dụng thật sự cần tương tác với terminal, Java có `java.io.Console`:

```java
java.io.Console console = System.console();

if (console != null) {
    String name = console.readLine("Tên của bạn: ");
    char[] password = console.readPassword("Mật khẩu: ");

    if (name != null) {
        console.printf("Xin chào %s%n", name);
    }
    if (password != null) {
        java.util.Arrays.fill(password, '\0');
    }
}
```

`Console` cung cấp các thao tác hướng tới terminal như `readLine`, `printf`, `reader()`, `writer()` và `readPassword()`. `readPassword()` cố gắng không hiển thị lại ký tự ra terminal và trả `char[]` để bên gọi có thể xóa dữ liệu nhạy cảm khỏi mảng sau khi dùng. Cả `readLine(...)` và `readPassword(...)` đều có thể trả `null` khi đầu vào console đi tới cuối luồng (EOF), vì vậy mã không được dùng trực tiếp kết quả mà không kiểm tra.

Điểm quan trọng nhất là `System.console()` **có thể trả `null`**. Điều này thường xảy ra khi JVM không có console tương tác phù hợp, ví dụ một số IDE, trình chạy kiểm thử, dịch vụ/tiến trình nền hoặc khi các luồng chuẩn đang được nối pipe/chuyển hướng. Vì vậy mã cần phương án thay thế hoặc một mô hình đầu vào khác thay vì giả định `Console` luôn tồn tại.

`System.out`/`System.err` là `PrintStream`, còn `Console.writer()` trả `PrintWriter`. Hai nhóm API in văn bản này thuận tiện, nhưng chúng giữ lỗi I/O trong trạng thái lỗi thay vì ném `IOException` từ các phương thức `print/println/printf`; khi cần quan sát lỗi, dùng `checkError()` theo quy tắc tương ứng.
