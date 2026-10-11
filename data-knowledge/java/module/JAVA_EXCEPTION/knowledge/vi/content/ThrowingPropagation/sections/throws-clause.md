`throws` nằm trong phần khai báo:

```java
String load(Path path) throws IOException {
    return Files.readString(path);
}
```

Nó **không tự ném exception**. Nó nói rằng một exception có thể thoát khỏi phương thức.

Với checked exception, `throws` có ý nghĩa bắt buộc tại thời điểm biên dịch khi phương thức không bắt lỗi:

```java
String load(Path path) throws IOException {
    return Files.readString(path);
}
```

Với unchecked exception, khai báo vẫn hợp lệ nhưng không bắt buộc:

```java
void validate(String value) throws IllegalArgumentException {
    if (value.isBlank()) {
        throw new IllegalArgumentException("blank");
    }
}
```

Thông thường chỉ nên liệt kê unchecked exception trong tài liệu/khai báo API khi nó thực sự làm hợp đồng dễ hiểu hơn; đừng thêm mọi `RuntimeException` có thể tưởng tượng.

### Nhiều exception trong throws

```java
void importData(Path path) throws IOException, ParseException {
    ...
}
```

Danh sách nên phản ánh hợp đồng có ích cho bên gọi. `throws Exception` quá rộng thường làm mất thông tin:

```text
bên gọi biết "có lỗi xảy ra"
nhưng
không biết nhóm lỗi nào cần chính sách xử lý nào
```

Khi một phương thức không xử lý exception, lỗi không biến mất. Java **lần ngược ngăn xếp lời gọi (stack unwinding)** để tìm một nơi xử lý phù hợp ở phía gọi bên trên.

Đây là cầu nối giữa `throw` và `try/catch`: `throw` tạo ra sự kết thúc bất thường tại một điểm; cơ chế lan truyền quyết định lỗi đó đi đâu tiếp theo.
