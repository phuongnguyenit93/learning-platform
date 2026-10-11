Đây là nơi `finally` có thể trở nên nguy hiểm.

### Biểu thức `return` được tính trước, nhưng finally chạy trước khi phương thức thoát

```java
int value() {
    try {
        return 1;
    } finally {
        System.out.println("cleanup");
    }
}
```

Kết quả vẫn là `1`, nhưng phần dọn dẹp chạy trước khi bên gọi nhận giá trị.

### `return` trong finally ghi đè giá trị trả về đang chờ

```java
int dangerous() {
    try {
        return 1;
    } finally {
        return 2;
    }
}
```

Kết quả là `2`.

Luồng:

```text
try chuẩn bị return 1
        ↓
finally chạy
        ↓
finally tạo return mới = 2
        ↓
return 1 bị thay thế
```

`return` trong `finally` còn nguy hiểm hơn khi trước đó đang có một exception chờ được ném:

```java
int dangerous() throws IOException {
    try {
        throw new IOException("original");
    } finally {
        return 0;
    }
}
```

Kết quả là phương thức trả về `0`; `IOException` đang chờ bị thay thế bởi lý do hoàn thành mới từ `finally`.

### `throw` trong finally có thể che exception gốc

```java
try {
    throw new IllegalStateException("original");
} finally {
    throw new RuntimeException("cleanup failed");
}
```

Exception `cleanup failed` thoát ra, còn `original` có thể bị che mất nếu ta quản lý việc dọn dẹp thủ công.

Quy tắc tổng quát là: nếu `finally` tự **hoàn thành bất thường** bằng `return`, `throw`, hoặc một `break`/`continue` hợp lệ trong ngữ cảnh của nó, lý do hoàn thành mới đó thay thế kết quả hoặc exception đang chờ từ `try`/`catch`.

Đây chính là một trong các vấn đề mà `try-with-resources` giải quyết tốt hơn bằng **ngoại lệ được giữ lại (suppressed exception)**.

Quy tắc thực tế:

```text
finally
→ dọn dẹp

tránh
→ return trong finally
→ ném lỗi mới từ `finally` dù có cách quản lý an toàn hơn
```

### GHI NHỚ

```text
try
→ vùng mã nguồn có thể kết thúc bất thường

catch
→ nơi có chính sách xử lý cụ thể

multi-catch
→ nhiều kiểu, một chính sách xử lý thật sự chung

finally
→ dọn dẹp khi rời cấu trúc
```

Chương tiếp theo thay việc dọn dẹp tài nguyên thủ công bằng `try-with-resources`, nơi vòng đời và quyền sở hữu tài nguyên được đưa trực tiếp vào cú pháp.
