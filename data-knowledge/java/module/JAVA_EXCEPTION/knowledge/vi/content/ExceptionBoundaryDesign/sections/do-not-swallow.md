Cách viết cần tránh:

```java
try {
    run();
} catch (Exception ex) {
    // ignored
}
```

Mã nguồn bên ngoài có thể tiếp tục như thể thao tác đã thành công trong khi trạng thái thực tế chưa đạt kết quả mong muốn.

Hậu quả:

```text
lỗi xảy ra
→ tín hiệu lỗi bị xóa
→ bên gọi thấy thành công giả
→ bug xuất hiện xa nguyên nhân gốc
```

### “Bỏ qua có chủ ý” khác “nuốt lỗi vô thức”

Có trường hợp một lỗi cụ thể được phép bỏ qua:

```java
try {
    deleteTemporaryFile();
} catch (NoSuchFileException ex) {
    // file đã không tồn tại; kết quả mong muốn vẫn đạt
}
```

Điểm khác là:

- kiểu cụ thể;
- lý do rõ;
- kết quả vẫn hợp lệ;
- phạm vi bỏ qua hẹp.

Không nên dùng `catch (Exception)` trống để đạt hiệu ứng tương tự.
