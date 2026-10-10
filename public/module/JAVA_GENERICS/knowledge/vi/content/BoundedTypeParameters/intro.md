# Tham số kiểu có giới hạn

Generics giúp ta nói “phương thức này làm việc với **một kiểu T nào đó**”. Nhưng đôi khi “kiểu nào cũng được” lại quá rộng.

Giả sử ta muốn viết một phương thức nhận nhiều loại số:

```java
static <T> double twice(T value) {
    // value.doubleValue(); // compile error
    return 0;
}
```

Compiler chỉ biết `T` là một kiểu chưa xác định. Nó **không thể giả định** mọi `T` đều có `doubleValue()`.

Ta cần diễn đạt thêm:

```text
"T có thể thay đổi,
nhưng T phải ít nhất là Number"
```

Đó là vai trò của **tham số kiểu có giới hạn (bounded type parameter)**: vẫn giữ khả năng tái sử dụng của Generics, nhưng giới hạn tập kiểu hợp lệ để phần triển khai có một hợp đồng đủ mạnh để làm việc.
