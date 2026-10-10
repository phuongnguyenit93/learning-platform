Một bộ khởi tạo `static` có thể thất bại:

```java
final class BrokenPlugin {
    static final int PORT = loadPort();

    private static int loadPort() {
        throw new IllegalStateException("invalid plugin config");
    }
}
```

Lần sử dụng chủ động (active use) đầu tiên:

```java
System.out.println(BrokenPlugin.PORT);
```

`IllegalStateException` phát sinh trong quá trình khởi tạo không phải `Error`, nên JVM thường bọc nó bằng `ExceptionInInitializerError` cho bên gọi đầu tiên.

Sau khi thất bại:

```text
BrokenPlugin Class khi chạy
→ khởi tạo thất bại
→ bị đánh dấu ở trạng thái lỗi (erroneous)
```

Lần sử dụng chủ động sau đó của **cùng định danh class khi chạy** không chạy lại bộ khởi tạo như một lần thử lại. Bên gọi thường thấy `NoClassDefFoundError` báo class không thể khởi tạo.

Ví dụ quan sát:

```java
for (int i = 0; i < 2; i++) {
    try {
        System.out.println(BrokenPlugin.PORT);
    } catch (Throwable error) {
        System.out.println(error.getClass().getName());
    }
}
```

Dạng điển hình:

```text
java.lang.ExceptionInInitializerError
java.lang.NoClassDefFoundError
```

Nếu bộ khởi tạo trực tiếp ném một `Error`, quy trình khởi tạo không cần bọc nó thành `ExceptionInInitializerError`; class vẫn đi vào trạng thái lỗi (erroneous).

Đây là lý do không nên dùng bộ khởi tạo `static` như một cơ chế thử lại. Nếu cấu hình plugin có thể lỗi tạm thời và cần thử lại, hãy thiết kế một vòng đời khi chạy rõ ràng thay vì nhét logic vào quá trình khởi tạo class.

Kết thúc chương, ta đã thấy trạng thái khởi tạo thuộc về định danh class khi chạy. Chương cuối nối định danh đó với GC: **khi plugin dừng, điều kiện nào cho phép cả `Class` và ClassLoader định nghĩa được thu hồi?**
