```java
void rename(User user) {
    user.setName("B");
}
```

Bên gọi thấy đối tượng bị đổi vì cả tham chiếu của bên gọi và tham chiếu của tham số đều trỏ tới cùng đối tượng `User`.

Điều này **không biến Java thành pass-by-reference**. Phương thức không nhận quyền thay đổi ô biến của bên gọi; nó chỉ nhận một giá trị tham chiếu được sao chép.

Mảng cũng theo cùng quy tắc:

```java
void changeFirst(int[] values) {
    values[0] = 99;
}
```

Bên gọi thấy phần tử đổi vì bên gọi và tham số cùng nhận diện một đối tượng mảng. Đây là **thay đổi dùng chung qua alias**, không phải pass-by-reference.

Đối tượng bất biến giúp quan sát dễ hơn:

```java
void append(String text) {
    text = text + "!";
}
```

`String` bất biến nên biểu thức tạo giá trị/đối tượng khác và gán lại tham số; bên gọi không thấy biến của mình đổi.
