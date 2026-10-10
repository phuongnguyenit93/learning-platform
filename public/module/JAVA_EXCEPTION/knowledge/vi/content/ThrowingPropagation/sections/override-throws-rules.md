Giả sử hợp đồng của lớp cha là:

```java
class Parent {
    void load() throws IOException {
    }
}
```

Phương thức ghi đè không được mở rộng hợp đồng checked exception:

```java
class Child extends Parent {
    @Override
    void load() throws Exception { // compile error
    }
}
```

### VÌ SAO?

Mã nguồn có thể giữ tham chiếu kiểu `Parent`:

```java
Parent value = new Child();
value.load();
```

Bên gọi được biên dịch dựa trên hợp đồng của `Parent`. Nếu `Child` được phép phát sinh một checked exception rộng hơn, bên gọi có thể gặp checked exception mà hợp đồng ban đầu không yêu cầu chuẩn bị.

Đây là một phần của nguyên tắc thay thế (substitutability):

```text
kiểu con có thể thu hẹp loại lỗi được khai báo
nhưng không được buộc bên gọi xử lý checked exception rộng hơn hợp đồng cha
```

Unchecked exception không chịu giới hạn này theo quy tắc catch-or-declare.
