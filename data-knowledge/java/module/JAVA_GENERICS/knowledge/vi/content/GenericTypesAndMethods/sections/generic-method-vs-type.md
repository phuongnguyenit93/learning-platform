Trong:

```java
class Holder<T> {
    T current;

    <R> R echoOther(R value) {
        return value;
    }
}
```

- `T` thuộc lớp và có ý nghĩa xuyên suốt đối tượng;
- `R` chỉ tồn tại trong khai báo của `echoOther`.

Phương thức cũng có thể khai báo một type parameter trùng tên với type parameter của lớp, nhưng khi đó nó **che khuất (shadow)** type variable bên ngoài và rất dễ gây nhầm:

```java
class Sample<T> {
    <T> T identity(T value) {
        return value;
    }
}
```

Hai `T` ở đây là hai type variable khác nhau. Nên chọn tên khác nếu không có lý do mạnh.

Khi mã generic cần gọi phương thức chỉ có trên một nhóm kiểu nhất định, `T` tự do là chưa đủ. Chương tiếp theo thêm **giới hạn (bound)** để nói rõ khả năng mà type parameter phải có.
