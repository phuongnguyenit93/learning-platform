`finally` được thiết kế cho công việc phải xảy ra khi luồng điều khiển rời `try/catch`.

```java
try {
    useResource();
} finally {
    cleanup();
}
```

Nó thường chạy khi đường thoát là:

- chạy bình thường;
- exception được catch;
- exception tiếp tục lan truyền;
- `return`;
- `break`/`continue` rời vùng liên quan.

Mô hình cần nhớ:

```text
try/catch quyết định kết quả xử lý
        ↓
trước khi luồng điều khiển thực sự rời cấu trúc
        ↓
finally chạy
```

### `finally` không phải bảo đảm tuyệt đối của thế giới bên ngoài

Không nên hiểu “finally luôn chạy” theo nghĩa vật lý tuyệt đối. Nếu tiến trình/JVM bị kết thúc cưỡng bức, gặp sự cố hoặc môi trường mất nguồn, mã nguồn dọn dẹp không thể được đảm bảo.

Trong luồng điều khiển bình thường của JVM, `finally` là cơ chế ngôn ngữ để thực hiện dọn dẹp khi rời khối lệnh.

### Với tài nguyên, ưu tiên try-with-resources

Dùng `finally` thủ công từng là cách phổ biến:

```java
InputStream in = null;
try {
    in = Files.newInputStream(path);
    ...
} finally {
    if (in != null) {
        in.close();
    }
}
```

Nhưng đoạn mã này có nhiều trường hợp biên khi phần thân và `close()` cùng thất bại. Với `AutoCloseable`, `try-with-resources` thường biểu diễn quyền sở hữu tài nguyên an toàn và rõ hơn.
