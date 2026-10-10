Biến tham chiếu có thể giữ `null` nếu kiểu/ngữ cảnh cho phép:

```java
String name = null;
```

Biến kiểu nguyên thủy không thể giữ `null`:

```java
int value = null; // không biên dịch được
```

Kiểu tham chiếu có thể mang `null`; hệ quả đối với kiểu bao và thao tác mở hộp sẽ được học ở chương tiếp theo.

### `null` khác giá trị rỗng hoặc giá trị mặc định của nghiệp vụ

```text
null        → không có đối tượng được tham chiếu nhận diện
""          → có đối tượng String với giá trị rỗng
0           → giá trị int hợp lệ
```

Các trạng thái này có ngữ nghĩa khác nhau. Dùng `null` để biểu diễn nhiều ý nghĩa như “không tìm thấy”, “chưa tải”, “không áp dụng”, “lỗi” cùng lúc sẽ làm hợp đồng khó hiểu.

Trường kiểu tham chiếu có giá trị mặc định là `null`, nhưng biến cục bộ kiểu tham chiếu vẫn phải được gán chắc chắn trước khi đọc.
