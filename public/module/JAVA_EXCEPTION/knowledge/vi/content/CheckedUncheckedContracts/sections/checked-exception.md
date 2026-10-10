Checked exception là exception chịu quy tắc **bắt hoặc khai báo (catch or declare)**.

Nếu một checked exception có thể thoát khỏi phương thức, mã nguồn phải:

```text
`catch` nó
hoặc
khai báo nó bằng `throws`
```

Ví dụ:

```java
String read(Path path) throws IOException {
    return Files.readString(path);
}
```

`Files.readString(path)` có thể ném `IOException`. Nếu `read()` không catch lỗi đó, `read()` phải công bố nó trong `throws`.

Bên gọi tiếp tục phải đưa ra quyết định:

```java
try {
    String content = read(path);
} catch (IOException ex) {
    recover(ex);
}
```

hoặc:

```java
String load(Path path) throws IOException {
    return read(path);
}
```

### VÌ SAO JAVA CÓ CHECKED EXCEPTION?

Ý tưởng của checked exception là đưa một nhóm lỗi vào **hợp đồng được kiểm tra tại thời điểm biên dịch**:

```text
phương thức có một khả năng lỗi mà bên gọi được kỳ vọng phải nhận biết
        ↓
trình biên dịch buộc bên gọi xử lý hoặc tiếp tục khai báo
```

Nó hữu ích ở những ranh giới mà bên gọi thực sự có thể chọn hành động có ý nghĩa, ví dụ đổi file khác, báo lỗi nhập liệu, chuyển sang nguồn dự phòng hoặc chấm dứt thao tác theo cách có chủ ý.

Nhược điểm xuất hiện khi bên gọi không có khả năng phục hồi thực tế. Nếu mọi tầng đều chỉ viết:

```java
throws SomeCheckedException
```

mà không có thêm quyết định thiết kế nào, hợp đồng checked exception có thể trở thành mã lặp lại thay vì thông tin hữu ích.
