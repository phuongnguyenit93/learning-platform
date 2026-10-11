Một tài nguyên dùng trong TWR phải có kiểu triển khai `AutoCloseable`:

```java
public interface AutoCloseable {
    void close() throws Exception;
}
```

Ví dụ:

```java
try (InputStream in = Files.newInputStream(path)) {
    return in.read();
}
```

Luồng cơ bản:

```text
tạo tài nguyên
        ↓
chạy phần thân
        ↓
rời phần thân do chạy xong / return / throw
        ↓
Java gọi close()
        ↓
sau đó luồng điều khiển mới tiếp tục ra ngoài
```

### VÌ SAO KHÔNG CHỜ GARBAGE COLLECTOR?

Một đối tượng stream có thể không còn được tham chiếu tới (unreachable) nhưng tài nguyên hệ điều hành phía dưới vẫn cần được dọn dẹp đúng thời điểm.

Mô hình cần nhớ:

```text
vòng đời bộ nhớ
≠
vòng đời tài nguyên bên ngoài
```

TWR giải quyết **vòng đời/quyền sở hữu tài nguyên**, không phải tối ưu GC.

### Catch/finally nằm ở đâu?

```java
try (InputStream in = Files.newInputStream(path)) {
    use(in);
} catch (IOException ex) {
    handle(ex);
} finally {
    afterOperation();
}
```

Tài nguyên được đóng khi rời phần `try` quản lý tài nguyên **trước khi** các khối `catch`/`finally` gắn với câu lệnh try-with-resources bắt đầu xử lý kết quả thoát ra.

Vì vậy khi `catch` bắt được exception, quá trình đóng các tài nguyên do try-with-resources sở hữu đã được thực hiện trước đó.

### Nếu tài nguyên là null?

Một tài nguyên trong try-with-resources có thể có giá trị `null`. Trường hợp này hợp lệ:

```java
void useNullableResource() throws Exception {
    try (AutoCloseable resource = null) {
        // ...
    }
}
```

Khi rời `try`, Java chỉ gọi `close()` nếu tài nguyên khác `null`. Đây là quy tắc của TWR, không phải lý do để cố tình thiết kế tài nguyên bằng `null`; trong mã nguồn thực tế vẫn nên ưu tiên quyền sở hữu và trạng thái tài nguyên rõ ràng.
