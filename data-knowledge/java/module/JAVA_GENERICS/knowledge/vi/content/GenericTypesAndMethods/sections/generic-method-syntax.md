Danh sách type parameter được đặt **trước kiểu trả về (return type)**:

```java
static <T> T echo(T value) {
    return value;
}
```

Ở đây:

- `<T>` khai báo type parameter của phương thức;
- `T` trong tham số và kiểu trả về cùng chỉ một type variable;
- phương thức có thể nằm trong lớp generic hoặc lớp không generic.

Ví dụ phương thức dùng cùng một `T` cho tham số đầu vào và kiểu trả về:

```java
static <T> Box<T> boxOf(T value) {
    Box<T> box = new Box<>();
    box.set(value);
    return box;
}
```

Phương thức generic hữu ích khi **quan hệ kiểu chỉ tồn tại trong một thao tác** chứ không phải trạng thái của đối tượng.
