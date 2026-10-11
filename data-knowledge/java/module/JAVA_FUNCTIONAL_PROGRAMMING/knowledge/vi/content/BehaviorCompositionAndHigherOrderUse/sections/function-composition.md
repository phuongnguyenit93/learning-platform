`Function` cho phép ghép hai phép biến đổi thành một phép biến đổi mới có thể tái sử dụng. Hai phương thức chính khác nhau ở hướng đọc và thứ tự thực thi.

```java
Function<String, String> trim = String::trim;
Function<String, Integer> length = String::length;

Function<String, Integer> trimThenLength = trim.andThen(length);
Function<String, Integer> sameFlow = length.compose(trim);

trimThenLength.apply(" Java "); // 4
```

Với `f.andThen(g)`, dữ liệu đi theo hướng `f -> g`. Với `g.compose(f)`, luồng thực thi cũng là `f -> g`. Có thể kiểm tra thêm bằng kiểu dữ liệu: đầu ra của hàm trước phải tương thích với đầu vào của hàm sau.

Kết hợp hàm hữu ích khi từng bước có ý nghĩa riêng. Nếu chuỗi quá dài và gồm nhiều hàm quá nhỏ, một phương thức thông thường đôi khi lại dễ đọc hơn.
